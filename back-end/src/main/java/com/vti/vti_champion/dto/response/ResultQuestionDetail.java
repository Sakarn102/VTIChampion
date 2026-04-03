package com.vti.vti_champion.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ResultQuestionDetail {
    private Integer questionId;
    private String content;
    private String explanation;
    private Integer chosenAnswerId;
    private List<AnswerResponse> options;
}
