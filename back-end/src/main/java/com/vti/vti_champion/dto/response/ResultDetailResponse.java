package com.vti.vti_champion.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResultDetailResponse {
    private Integer resultId;
    private String examTitle;
    private String examCode;
    private Double score;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String status;
    private List<ResultQuestionDetail> questions;
}
