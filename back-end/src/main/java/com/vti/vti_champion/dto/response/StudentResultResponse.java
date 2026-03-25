package com.vti.vti_champion.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class StudentResultResponse {
    private Integer examResultId;
    private String examTitle;
    private String examCode;
    private BigDecimal score;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String type; // 'Test' hoặc 'Practice' từ bảng exam
}
