package com.vti.vti_champion.dto.request;

import lombok.Data;

@Data
public class ClassFilterRequest {
    private String name;
    private Integer departmentId;
    private Integer teacherId;
    private Boolean isActive;
}
