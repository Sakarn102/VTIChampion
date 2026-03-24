package com.vti.vti_champion.controller;

import com.vti.vti_champion.configuration.CustomUserDetails;
import com.vti.vti_champion.dto.request.CreateQuestionRequest;
import com.vti.vti_champion.dto.request.UpdateQuestionRequest;
import com.vti.vti_champion.dto.response.QuestionResponse;
import com.vti.vti_champion.entity.Question;
import com.vti.vti_champion.service.classes.QuestionService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/v1/questions")
@CrossOrigin("http://localhost:3000")
public class QuestionController {
    private final QuestionService questionService;
    private final ModelMapper modelMapper;

    @GetMapping("/my-questions")
    public ResponseEntity<?> getQuestionsByTeacher(
            Authentication authentication,
            Pageable pageable)
    {
        // Lấy ID của Giáo viên đang đăng nhập từ Token
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        Integer teacherid = userDetails.getId();

        Page<QuestionResponse> questions = questionService.getQuestionsByTeacher(teacherid, pageable);

        return ResponseEntity.ok(questions);
    }

    @PostMapping("/create-question")
    public ResponseEntity<?> createQuestionByTeacher(
            Authentication authentication,
            @RequestBody CreateQuestionRequest request
    )
    {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        QuestionResponse saved = questionService.createQuestionByTeacher(userDetails.getId(), request);
        return new ResponseEntity<>(saved, HttpStatus.CREATED);
    }

    @PutMapping("/update-question/{id}")
    public ResponseEntity<?> updateQuestionByTeacher(
            @PathVariable Integer id,
            Authentication authentication,
            @RequestBody UpdateQuestionRequest request
    )
    {
        CustomUserDetails userDetails =  (CustomUserDetails) authentication.getPrincipal();
        Integer currentTeacherid = userDetails.getId();

        Question updatedQuestion = questionService.updateQuestionByTeacher(id, currentTeacherid, request);

        QuestionResponse response = modelMapper.map(updatedQuestion, QuestionResponse.class);
        response.setQuestionId(updatedQuestion.getId());

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/delete-question/{id}")
    public ResponseEntity<?> deleteQuestionByTeacher(@PathVariable Integer id, Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chua dang nhap");
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Integer currentTeacherid = userDetails.getId();

        questionService.deleteQuestionByTeacher(id, currentTeacherid);

        return ResponseEntity.ok(Map.of("messsage", "Xoa cau hoi thanh cong"));
    }
}
