package com.vti.vti_champion.dto.response;

import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class TeacherResultResponse {
    private Integer examResultId;
    private String studentName;
    private String examTitle;
    private String examCode;
    private BigDecimal score;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String className; // Thêm tên lớp để dùng cho API số 3
}
