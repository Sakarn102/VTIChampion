package com.vti.vti_champion.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class QuestionResponse {
    private Integer questionId;
    private String content;
    private String difficultyLevel;
    private String explanation;
    private LocalDateTime createDate;
    private List<AnswerResponse> answers;
}
