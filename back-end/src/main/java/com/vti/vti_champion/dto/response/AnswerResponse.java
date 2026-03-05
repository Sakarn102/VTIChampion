package com.vti.vti_champion.dto.response;

import lombok.Data;

@Data
public class AnswerResponse {
    private Integer id;
    private String content;
    private Boolean isCorrect;
}
