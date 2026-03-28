package com.vti.vti_champion.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ClassResponse {
    private Integer id;
    private String name;
    private String thumbnailUrl;
    private LocalDateTime createDate;
    private Boolean isActive;

    private String departmentName;
    private String teacherName;
}
