package com.vti.vti_champion.dto.request;

import lombok.Data;

@Data
public class UpdateTeacherRequest {
    private String username;
    private String password;
    private String fullName;
    private String email;
    private Integer departmentId;
}
