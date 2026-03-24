package com.vti.vti_champion.dto.request;

import com.vti.vti_champion.constant.DifficultyLevel;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class CreateQuestionRequest {
    @NotBlank(message = "Content cannot be null!")
    private String content;

    private DifficultyLevel difficultyLevel;

    @NotBlank(message = "Explanation cannot be null!")
    private String explanation;

    @NotEmpty(message = "Vui lòng tạo ít nhất 1 câu trả lời ")
    private List<AnswerRequest> answers;
}
