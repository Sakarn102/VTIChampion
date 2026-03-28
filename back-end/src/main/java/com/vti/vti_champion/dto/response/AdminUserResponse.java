package com.vti.vti_champion.dto.response;

import com.vti.vti_champion.entity.Setting;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class AdminUserResponse {
    private Integer id;
    private String email;
    private String username;
    private String fullname;
    private String roleName;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
