package com.vti.vti_champion.service.interfaces;

import com.vti.vti_champion.dto.request.CreateExamRequest;
import com.vti.vti_champion.dto.request.UpdateExamRequest;
import com.vti.vti_champion.dto.response.ExamResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.time.LocalDateTime;

public interface IExamService {
    ExamResponse createExam(CreateExamRequest request);
    Page<ExamResponse> getAllExams(String keyword, Integer classId, Integer teacherId, LocalDate startDate, LocalDate endDate, Pageable pageable);
    void deleteExam(Integer id);
    ExamResponse updateExam(Integer examId, UpdateExamRequest request);
}
