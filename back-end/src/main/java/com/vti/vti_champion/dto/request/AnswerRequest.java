package com.vti.vti_champion.dto.request;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class AnswerRequest {
    private String content;

    @JsonProperty("isCorrect") // // Ép Jackson phải nhận đúng key này
    private boolean isCorrect;

}
