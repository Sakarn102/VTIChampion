package com.vti.vti_champion.controller;

import com.vti.vti_champion.configuration.CustomUserDetails;
import com.vti.vti_champion.dto.response.StudentResultResponse;
import com.vti.vti_champion.dto.response.TeacherResultResponse;
import com.vti.vti_champion.service.classes.ExamResultService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/results")
@CrossOrigin("http://localhost:3000")
@RequiredArgsConstructor
public class ExamResultController {
    private final ExamResultService examResultService;

    @GetMapping("/student/my-history")
    public ResponseEntity<?> getMyHistory(Authentication authentication) {
        // 1. Lấy UserDetails từ SecurityContext
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Integer userId = userDetails.getId(); // ID của học viên đang đăng nhập

        // 2. Gọi service lấy dữ liệu
        List<StudentResultResponse> history = examResultService.getStudentResult(userId);

        return ResponseEntity.ok(history);
    }

    @GetMapping("/teacher/student/{userId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> getScoresByStudent(@PathVariable Integer userId) {
        List<TeacherResultResponse> responses = examResultService.getScoresByStudent(userId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/teacher/exam/{examId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> getScoresByExam(@PathVariable Integer examId) {
        List<TeacherResultResponse> responses = examResultService.getScoresByExam(examId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/teacher/class/{classId}")
    @PreAuthorize("hasAnyRole('TEACHER', 'ADMIN')")
    public ResponseEntity<?> getResultsByClass(@PathVariable Integer classId) {
        List<TeacherResultResponse> responses = examResultService.getScoresByClass(classId);
        return ResponseEntity.ok(responses);
    }

    @GetMapping("/check-my-role")
    public ResponseEntity<?> checkRole(Authentication auth) {
        if (auth == null) return ResponseEntity.ok("Chưa đăng nhập hoặc Filter JWT lỗi");
        return ResponseEntity.ok(auth.getAuthorities());
    }

}
