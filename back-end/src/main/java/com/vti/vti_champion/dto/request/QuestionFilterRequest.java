package com.vti.vti_champion.dto.request;

import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import java.time.LocalDate;

@Data
public class QuestionFilterRequest {

    // Tìm kiếm theo nội dung câu hỏi
    private String search;

    // Lọc theo ngày tạo (từ ngày)
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate from;

    // Lọc theo ngày tạo (đến ngày)
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate to;
}
