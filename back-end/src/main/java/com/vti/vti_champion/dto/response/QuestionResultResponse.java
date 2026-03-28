package com.vti.vti_champion.dto.response;

import lombok.Data;

@Data
public class QuestionResultResponse {
    private Integer questionId;
    private String content;
    private Integer selectedAnswerId;
    private Integer correctAnswerId;
    private Boolean isCorrect;
    private String explanation;
}
