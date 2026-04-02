package com.vti.vti_champion.dto.request;

import lombok.Data;

@Data
public class UpdateClassRequest {
    private String name;
    private String thumbnailUrl;
    private Integer departmentId;
    private Integer teacherId;
    private Boolean isActive;
}
