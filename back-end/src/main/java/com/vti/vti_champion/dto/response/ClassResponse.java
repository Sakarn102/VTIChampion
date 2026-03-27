package com.vti.vti_champion.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ClassResponse {
    private Integer id;
    private String name;
    private LocalDateTime createDate;
    private String thumbnailUrl;
    private Boolean isActive;
    private String departmentName; // Từ Setting.name
    private String teacherName; // Từ User.fullname theo teacher_id
}
