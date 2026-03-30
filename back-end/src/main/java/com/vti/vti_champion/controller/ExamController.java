package com.vti.vti_champion.controller;

import com.vti.vti_champion.dto.request.CreateExamRequest;
import com.vti.vti_champion.dto.request.UpdateExamRequest;
import com.vti.vti_champion.dto.response.ExamResponse;
import com.vti.vti_champion.service.classes.ExamService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/exams")
@CrossOrigin("http://localhost:3000")
public class ExamController {
    private final ExamService examService;

    @PostMapping("/create-exam")
    public ResponseEntity<?> createExam(@Valid @RequestBody CreateExamRequest request) {
        System.out.println("Dữ liệu nhận được: " + request.toString());
        examService.createExam(request);
        return ResponseEntity.ok(Map.of("message", "Tạo mới Exam thành công!"));
    }

    @GetMapping("/getAll")
    public ResponseEntity<Page<ExamResponse>> getAllExams(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer classId,
            @RequestParam(name = "teacher_id", required = false) Integer teacherId,

            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate startDate,

            @RequestParam(required = false)
            @DateTimeFormat(pattern = "yyyy-MM-dd") LocalDate endDate,

            Pageable pageable
    ) {
        Page<ExamResponse> response = examService.getAllExams(keyword, classId, teacherId, startDate, endDate, pageable);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExam(@PathVariable Integer id) {
        examService.deleteExam(id);

        return ResponseEntity.ok("Xoá thành công Exam có ID = " + id);
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateExam(@PathVariable Integer id, @Valid @RequestBody UpdateExamRequest request) {
        examService.updateExam(id, request);

        return ResponseEntity.ok(Map.of("message", "Update Exam thành công!"));
    }

}
