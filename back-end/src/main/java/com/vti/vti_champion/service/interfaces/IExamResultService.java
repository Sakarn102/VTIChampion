package com.vti.vti_champion.service.interfaces;


import com.vti.vti_champion.dto.response.ResultDetailResponse;
import com.vti.vti_champion.dto.response.StudentResultResponse;
import com.vti.vti_champion.dto.response.TeacherResultResponse;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface IExamResultService {

    // Hoc vien xem diem cua minh
    List<StudentResultResponse> getStudentResult(Integer userId);

    // Xem chi tiết bài làm
    ResultDetailResponse getResultDetail(Integer resultId);

    // 1. Lấy điểm theo học viên
    List<TeacherResultResponse> getScoresByStudent(Integer userId);

    // 2. Lấy điểm theo đề thi
    List<TeacherResultResponse> getScoresByExam(Integer examId);

    // 3. Lấy điểm cả lớp
    List<TeacherResultResponse> getScoresByClass(Integer classId);
}
