package com.vti.vti_champion.dto.request;

import lombok.Data;

@Data
public class SubmitAnswerRequest {
    private Integer examResultId;
    private Integer questionId;
    private Integer answerId;
}
