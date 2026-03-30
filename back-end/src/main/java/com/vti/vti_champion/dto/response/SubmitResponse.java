package com.vti.vti_champion.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class SubmitResponse {
    private Double score;
    private Integer totalCorrect;
    private Integer totalQuestions;
    private String status;
    private List<QuestionResultResponse> details;
}
