package com.vti.vti_champion.controller;

import com.vti.vti_champion.dto.response.QuestionResponse;
import com.vti.vti_champion.service.Impl.QuestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("/api/v1/questions")
@RequiredArgsConstructor
public class QuestionController {

    private final QuestionService questionService;

    @GetMapping("/instructor/{id}")
    public ResponseEntity<Page<QuestionResponse>> getInstructorQuestions(
            @PathVariable(name = "id") Integer id,
            Pageable pageable) {

        // Trả về danh sách câu hỏi theo Instructor ID
        Page<QuestionResponse> result = questionService.findAllQuestion(id, pageable);
        return ResponseEntity.ok(result);
    }
}
