package com.vti.vti_champion.dto.response;

import lombok.Data;

import java.util.List;

@Data
public class PracticeQuestionResponse {
    private Integer id;
    private String content;
    private String explanation;
    private List<PracticeAnswerResponse> answers;
}
