package com.vti.vti_champion.dto.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class StudentResponse {
    private Integer id;
    private String fullname;
    private String username;
    private String email;
    private String avatarUrl;
    private String departmentName;
    private LocalDateTime createDate;
}
