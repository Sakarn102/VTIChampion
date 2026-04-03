package com.vti.vti_champion.service.classes;

import com.vti.vti_champion.constant.Type;
import com.vti.vti_champion.dto.request.StartExamRequest;
import com.vti.vti_champion.dto.request.SubmitAnswerRequest;
import com.vti.vti_champion.dto.response.QuestionResultResponse;
import com.vti.vti_champion.dto.response.SubmitResponse;
import com.vti.vti_champion.entity.*;
import com.vti.vti_champion.repository.ExamRepository;
import com.vti.vti_champion.repository.ExamResultRepository;
import com.vti.vti_champion.repository.StudentAnswerRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class TakeExamService {
    private final ExamResultRepository examResultRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final ExamRepository examRepository;
    private final ModelMapper modelMapper;

    // 1. Khởi tạo lượt thi
    @Transactional
    public Integer startExam(StartExamRequest request, User student) {
        Exam exam = examRepository.findById(request.getExamId())
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đề thi ID: " + request.getExamId()));
        
        ExamResult examResult = new ExamResult();
        examResult.setExam(exam);
        examResult.setStudent(student);
        examResult.setStartTime(LocalDateTime.now());
        examResult.setStatus("IN_PROGRESS");

        return examResultRepository.save(examResult).getId();
    }

    // 2. Lưu đáp án
    @Transactional
    public void saveStepAnswer(SubmitAnswerRequest request) {
        StudentAnswer sa = studentAnswerRepository.findByExamResultIdAndQuestionId(request.getExamResultId(), request.getQuestionId())
                .orElse(new StudentAnswer());

        ExamResult examResult = new ExamResult();
        examResult.setId(request.getExamResultId());

        Question question = new Question();
        question.setId(request.getQuestionId());

        Answer answer = new Answer();
        answer.setId(request.getAnswerId());

        sa.setExamResult(examResult);
        sa.setQuestion(question);
        sa.setAnswer(answer);

        studentAnswerRepository.save(sa);
    }

    @Transactional
    public SubmitResponse submitExam(Integer examResultId) {
        ExamResult result = examResultRepository.findById(examResultId).orElseThrow(() -> new RuntimeException("Exam Result Not Found"));
        Exam exam = result.getExam();
        LocalDateTime timeNow = LocalDateTime.now();

        // Xác định chế độ luyện tập hay thi thật (Dựa theo Type của đề thi)
        boolean isTypeExam = exam.getType().equals(exam.getType());

        // 1. KIỂM TRA THỜI GIAN ((Chỉ áp dụng cho chế độ TEST/THI THẬT))
        if (exam.getDuration() != null && exam.getDuration() > 0) {
            // Tính số phút đã trôi qua từ lúc bắt đầu
            long minutesPassed = java.time.Duration.between(result.getStartTime(), timeNow).toMinutes();

            // Cho phép bù 2 phút sai số do đường truyền mạng
            if (minutesPassed > exam.getDuration() + 2) {
                result.setStatus("LATE");
            } else {
                result.setStatus("COMPLETED");
            }
        } else {
            result.setStatus("PRACTICE_DONE");
        }


        // 1. Lấy tất cả đáp án sinh viên đã chọn
        List<StudentAnswer> studentAnswers = studentAnswerRepository.findByExamResultId(examResultId);

        // 2. Map dữ liệu để so sánh
        List<QuestionResultResponse> details = exam.getQuestions().stream().map(q -> {
            QuestionResultResponse dto = new QuestionResultResponse();
            dto.setQuestionId(q.getId());
            dto.setContent(q.getContent());

            // Tìm xem câu này sinh viên chọn đáp án nào
            StudentAnswer sa = studentAnswers.stream()
                    .filter(a -> a.getQuestion().getId().equals(q.getId()))
                    .findFirst()
                    .orElse(null);

            // Tìm đáp án đúng thực tế trong DB
            Answer correctAnswer = q.getAnswers().stream()
                    .filter(ans -> Boolean.TRUE.equals(ans.getIsCorrect())).findFirst()
                    .orElse(null);

            dto.setSelectedAnswerId(sa != null ? sa.getAnswer().getId() : null);
            dto.setCorrectAnswerId(correctAnswer != null ? correctAnswer.getId() : null);

            // Kiểm tra đúng/sai
            boolean isCorrect = sa != null
                    && sa.getAnswer() != null
                    && sa.getAnswer().getId().equals(dto.getCorrectAnswerId());
            dto.setIsCorrect(isCorrect);

            // LOGIC HIỂN THỊ EXPLANATION (GIẢI THÍCH)
            // Chỉ trả về explanation nếu trả lời SAI (theo yêu cầu của bạn)
            if (isTypeExam) {
                // Chế độ Luyện tập: Hiện giải thích cho TẤT CẢ các câu
                dto.setExplanation(q.getExplanation());
            } else {
                // Chế độ Thi thật (Test): Chỉ hiện giải thích nếu SAI
                if (!isCorrect) {
                    // Sai mới hiện giải thích
                    dto.setExplanation(q.getExplanation());
                } else {
                    // Đúng thì để null
                    dto.setExplanation(null);
                }
            }
            return dto;
        }).collect(Collectors.toList());

        // 3. Tính điểm
        long correctCount = details.stream().filter(QuestionResultResponse::getIsCorrect).count();
        double score = (double) correctCount / exam.getQuestions().size() * 10;

        // 4. Lưu vào DB
        result.setScore(Math.round(score * 10.0) / 10.0);
        result.setEndTime(LocalDateTime.now());
        examResultRepository.save(result);

        // 5. Trả về cho FE
        SubmitResponse response = new SubmitResponse();
        response.setScore(result.getScore());
        response.setTotalCorrect((int) correctCount);
        response.setTotalQuestions(exam.getQuestions().size());
        response.setDetails(details);
        response.setStatus(result.getStatus());

        return response;
    }

}
