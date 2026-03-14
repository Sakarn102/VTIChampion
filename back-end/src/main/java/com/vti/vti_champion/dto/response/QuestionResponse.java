package com.vti.vti_champion.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionResponse {
    private Integer questionId;
    private String content;
    private String difficultyLevel;
    private String explanation;
    private List<AnswerResponse> answers;
}
