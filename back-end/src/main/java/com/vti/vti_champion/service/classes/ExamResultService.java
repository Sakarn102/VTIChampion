package com.vti.vti_champion.service.classes;

import com.vti.vti_champion.dto.response.*;
import com.vti.vti_champion.entity.ExamResult;
import com.vti.vti_champion.entity.StudentAnswer;
import com.vti.vti_champion.repository.ExamResultRepository;
import com.vti.vti_champion.repository.StudentAnswerRepository;
import com.vti.vti_champion.service.interfaces.IExamResultService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ExamResultService implements IExamResultService {
    private final ExamResultRepository examResultRepository;
    private final StudentAnswerRepository studentAnswerRepository;
    private final ModelMapper modelMapper;

    @Override
    public List<StudentResultResponse> getStudentResult(Integer userId) {
        return examResultRepository.findByUserId(userId).stream()
                .map(student -> {
                    StudentResultResponse response = new StudentResultResponse();
                    response.setExamResultId(student.getId());
                    response.setExamTitle(student.getExam().getTitle());
                    response.setExamCode(student.getExam().getCode());
                    response.setScore(student.getScore());
                    response.setStartTime(student.getStartTime());
                    response.setEndTime(student.getEndTime());
                    response.setType(student.getExam().getType().toString());
                    return response;
                }).collect(Collectors.toList());
    }

    @Override
    public ResultDetailResponse getResultDetail(Integer resultId) {
        ExamResult result = examResultRepository.findById(resultId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy kết quả ID: " + resultId));

        List<StudentAnswer> studentAnswers = studentAnswerRepository.findByExamResultId(resultId);

        List<ResultQuestionDetail> questions = result.getExam().getQuestions().stream()
                .map(q -> {
                    Integer chosenId = studentAnswers.stream()
                            .filter(sa -> sa.getQuestion().getId().equals(q.getId()))
                            .map(sa -> sa.getAnswer().getId())
                            .findFirst().orElse(null);

                    List<AnswerResponse> options = q.getAnswers().stream()
                            .map(a -> new AnswerResponse(a.getId(), a.getContent(), a.getIsCorrect()))
                            .collect(Collectors.toList());

                    return ResultQuestionDetail.builder()
                            .questionId(q.getId())
                            .content(q.getContent())
                            .explanation(q.getExplanation())
                            .chosenAnswerId(chosenId)
                            .options(options)
                            .build();
                }).collect(Collectors.toList());

        return ResultDetailResponse.builder()
                .resultId(resultId)
                .examTitle(result.getExam().getTitle())
                .examCode(result.getExam().getCode())
                .score(result.getScore())
                .startTime(result.getStartTime())
                .endTime(result.getEndTime())
                .status(result.getStatus())
                .questions(questions)
                .build();
    }

    @Override
    public List<TeacherResultResponse> getScoresByStudent(Integer userId) {
        return examResultRepository.findByStudent_Id(userId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TeacherResultResponse> getScoresByExam(Integer examId) {
        return examResultRepository.findByExam_Id(examId).stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public List<TeacherResultResponse> getScoresByClass(Integer classId) {
        List<ExamResult> results = examResultRepository.findResultsByClassId(classId);
        return results.stream().map(this::convertToDto)
                .collect(Collectors.toList());
    }

    private TeacherResultResponse convertToDto(ExamResult entity) {
        TeacherResultResponse dto = modelMapper.map(entity, TeacherResultResponse.class);

        if (entity.getStudent() != null) {
            dto.setStudentName(entity.getStudent().getFullname());
        }

        // ModelMapper tự khớp các field trùng tên.
        // Những field lồng nhau sâu, nên set thủ công cho an toàn
        dto.setExamTitle(entity.getExam().getTitle());
        dto.setExamCode(entity.getExam().getCode());

        if (entity.getExam().getClassRoom().getId() != null) {
            dto.setClassName(entity.getExam().getClassRoom().getName());
        }

        return dto;
    }
}
