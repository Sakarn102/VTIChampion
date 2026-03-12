package com.vti.vti_champion.service.classes;

import com.vti.vti_champion.dto.request.CreateExamRequest;
import com.vti.vti_champion.dto.request.UpdateExamRequest;
import com.vti.vti_champion.dto.response.ExamResponse;
import com.vti.vti_champion.dto.response.QuestionResponse;
import com.vti.vti_champion.entity.*;
import com.vti.vti_champion.entity.Class;
import com.vti.vti_champion.repository.ClassRepository;
import com.vti.vti_champion.repository.ExamRepository;
import com.vti.vti_champion.repository.QuestionRepository;
import com.vti.vti_champion.repository.UserRepository;
import com.vti.vti_champion.service.interfaces.IExamService;
import com.vti.vti_champion.specification.ExamSpecification;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class ExamService implements IExamService {
    ExamRepository examRepository;
    QuestionRepository questionRepository;
    UserRepository userRepository;
    ClassRepository classRepository;
    ModelMapper modelMapper;


    @Override
    public ExamResponse createExam(CreateExamRequest request) {

        Exam exam = new Exam();

        exam.setTitle(request.getTitle().trim());
        exam.setCode(request.getCode().toUpperCase());
        exam.setDuration(request.getDuration());

        User creator = userRepository.findById(request.getCreatorId())
                .orElseThrow(() -> new RuntimeException("Người tạo (Creator) không tồn tại!"));

        Class classRoom = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Lớp học (Class Room) không tồn tại!"));

        exam.setCreator(creator);
        exam.setClassRoom(classRoom);

        List<Question> clonedQuestions = new ArrayList<>();

        for (Integer questionId : request.getQuestionIds()) {
            // 1. Lấy câu hỏi GỐC từ ngân hàng đề
            Question originalQuestion = questionRepository.findById(questionId)
                    .orElseThrow(() -> new RuntimeException("Câu hỏi ID " + questionId + " không tồn tại trong ngân hàng đề!"));

            // 2. TẠO BẢN SAO CÂU HỎI (New hoàn toàn)
            Question cloneQuestion = new Question();
            cloneQuestion.setContent(originalQuestion.getContent());
            cloneQuestion.setDifficultyLevel(originalQuestion.getDifficultyLevel());
            cloneQuestion.setCreator(originalQuestion.getCreator());
            cloneQuestion.setExam(exam);

            // 3. TẠO BẢN SAO CÁC ĐÁP ÁN (New hoàn toàn)
            List<Answer> cloneAnswers = new ArrayList<>();
            if (originalQuestion.getAnswers() != null) {
                for (Answer originalA : originalQuestion.getAnswers()) {
                    Answer cloneA = new Answer();
                    cloneA.setContent(originalA.getContent());
                    cloneA.setIsCorrect(originalA.getIsCorrect());
                    cloneA.setQuestion(cloneQuestion); // Gắn vào câu hỏi bản sao
                    cloneAnswers.add(cloneA);
                }
            }
            cloneQuestion.setAnswers(cloneAnswers);

            clonedQuestions.add(cloneQuestion);
        }

        // Gán danh sách bản sao vào Exam
        exam.setQuestions(clonedQuestions);

        examRepository.save(exam);

        ExamResponse examResponse = modelMapper.map(exam, ExamResponse.class);
        examResponse.setCreatorName(creator.getFullname());
        examResponse.setClassName(classRoom.getName());

        return examResponse;
    }

    @Override
    @Transactional(readOnly = true)
    public Page<ExamResponse> getAllExams(
            String keyword, Integer classId, Integer creatorId,
            LocalDate startDate, LocalDate endDate, Pageable pageable
    ) {

        LocalDateTime start = (startDate != null) ? startDate.atStartOfDay() : null;
        LocalDateTime end = (endDate != null) ? endDate.atStartOfDay() : null;

        Specification<Exam> spec = Specification.where(ExamSpecification.hasKeyword(keyword))
                .and(ExamSpecification.hasClassId(classId))
                .and(ExamSpecification.hasCreatorId(creatorId))
                .and(ExamSpecification.createdBeetween(start, end));

        return examRepository.findAll(spec, pageable).map(exam -> {
            ExamResponse response = modelMapper.map(exam, ExamResponse.class);

            if (exam.getClassRoom() != null) response.setClassName(exam.getClassRoom().getName());
            if (exam.getCreator() != null) response.setCreatorName(exam.getCreator().getFullname());

            return response;
        });
    }

    @Override
    @Transactional
    public void deleteExam(Integer examId) {
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài thi ID: " + examId));

        examRepository.deleteById(examId);
    }

    @Override
    @Transactional
    public ExamResponse updateExam(Integer examId, UpdateExamRequest request) {
        // 1. Tìm Exam
        Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bài thi!"));

        // 3. CHUẨN BỊ BẢN SAO MỚI (Logic này sẽ tạo ra dòng mới trong DB)
        List<Question> clonedQuestions = new ArrayList<>();
        for (Integer qId : request.getQuestionIds()) {
            Question originalQuestion = questionRepository.findById(qId)
                    .orElseThrow(() -> new RuntimeException("Câu hỏi ID " + qId + " không tồn tại!"));

            // Tạo object mới hoàn toàn -> Sẽ sinh ra ID mới
            Question cloneQ = new Question();
            cloneQ.setContent(originalQuestion.getContent());
            cloneQ.setDifficultyLevel(originalQuestion.getDifficultyLevel());
            cloneQ.setCreator(originalQuestion.getCreator());
            cloneQ.setExam(exam); // Gắn vào Exam này

            List<Answer> cloneAs = new ArrayList<>();
            if (originalQuestion.getAnswers() != null) {
                for (Answer originalA : originalQuestion.getAnswers()) {
                    Answer cloneA = new Answer();
                    cloneA.setContent(originalA.getContent());
                    cloneA.setIsCorrect(originalA.getIsCorrect());
                    cloneA.setQuestion(cloneQ);
                    cloneAs.add(cloneA);
                }
            }
            cloneQ.setAnswers(cloneAs);
            clonedQuestions.add(cloneQ);
        }

        // 4. XOÁ CÁC BẢN SAO CŨ CỦA EXAM NÀY (Để thay thế bằng bộ mới)
        // Đảm bảo trong Exam entity có orphanRemoval = true
        exam.getQuestions().clear();
        // Flush để xóa sạch các câu cũ trong DB trước khi thêm mới, tránh lỗi FK
        examRepository.saveAndFlush(exam);

        // 5. CẬP NHẬT THÔNG TIN VÀ THÊM CÂU HỎI MỚI
        exam.setTitle(request.getTitle().trim());
        exam.setCode(request.getCode().toUpperCase());
        exam.setDuration(request.getDuration());

        exam.getQuestions().addAll(clonedQuestions);

        // 6. LƯU LẠI
        examRepository.save(exam);

        ExamResponse response = modelMapper.map(exam, ExamResponse.class);
        response.setClassName(exam.getClassRoom().getName());
        return response;
    }
}
