package com.vti.vti_champion.dto.request;

import com.vti.vti_champion.constant.DifficultyLevel;
import lombok.Data;

import java.util.List;

@Data
public class UpdateQuestionRequest {
    private String content;
    private DifficultyLevel difficultyLevel;
    private String explanation;
    private List<AnswerRequest> answers;
}
