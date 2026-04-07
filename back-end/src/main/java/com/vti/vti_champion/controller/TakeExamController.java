package com.vti.vti_champion.controller;

import com.vti.vti_champion.configuration.CustomUserDetails;
import com.vti.vti_champion.dto.request.StartExamRequest;
import com.vti.vti_champion.dto.request.SubmitAnswerRequest;
import com.vti.vti_champion.dto.response.SubmitResponse;
import com.vti.vti_champion.entity.User;
import com.vti.vti_champion.repository.UserRepository;
import com.vti.vti_champion.service.classes.TakeExamService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/take-exam")
@CrossOrigin("http://localhost:3000")
public class TakeExamController {
    private final TakeExamService takeExamService;
    private final UserRepository userRepository;
    private final com.vti.vti_champion.repository.ExamRepository examRepository;
    private final com.vti.vti_champion.repository.ExamResultRepository examResultRepository;

    @PostMapping("/start-exam")
    public ResponseEntity<?> startExam(
            @RequestBody StartExamRequest request,
            Authentication authentication)
    {
        // Lấy User đang đăng nhập từ Spring Security
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Integer studentId = userDetails.getId();
        User currentStudent = userRepository.findById(studentId).orElseThrow();

        Integer resultId = takeExamService.startExam(request, currentStudent);
        return ResponseEntity.ok(resultId);
    }

    // API kiểm tra lượt còn lại
    @GetMapping("/check-attempts/{examId}")
    public ResponseEntity<?> checkAttempts(
            @PathVariable Integer examId,
            Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Integer studentId = userDetails.getId();

        com.vti.vti_champion.entity.Exam exam = examRepository.findById(examId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đề thi!"));

        // Bài Luyện tập (Practice) không giới hạn số lần
        boolean isPractice = exam.getType() != null && exam.getType().name().equals("Practice");
        if (isPractice) {
            return ResponseEntity.ok(java.util.Map.of(
                "maxAttempts", -1,
                "completedAttempts", 0,
                "remainingAttempts", -1,
                "canTakeExam", true,
                "isPractice", true
            ));
        }

        long completed = examResultRepository.countCompletedAttempts(studentId, examId);
        int maxAttempts = exam.getMaxAttempts() != null ? exam.getMaxAttempts() : 1;
        long remaining = Math.max(0, maxAttempts - completed);

        return ResponseEntity.ok(java.util.Map.of(
            "maxAttempts", maxAttempts,
            "completedAttempts", completed,
            "remainingAttempts", remaining,
            "canTakeExam", remaining > 0,
            "isPractice", false
        ));
    }

    // API 2: Lưu đáp án từng câu
    @PostMapping("/save-answer")
    public ResponseEntity<?> saveAnswer(@RequestBody SubmitAnswerRequest request) {
        takeExamService.saveStepAnswer(request);
        return ResponseEntity.ok("Da ghi nhan dap an");
    }

    @PostMapping("/submit/{examResultId}")
    public ResponseEntity<?> submitExam(@PathVariable("examResultId") Integer examResultId) {
        SubmitResponse response = takeExamService.submitExam(examResultId);

        return ResponseEntity.ok(response);
    }
}
