package com.vti.vti_champion.dto.response;

import com.vti.vti_champion.entity.Setting;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserResponse {
    private Integer id;
    private String email;
    private String username;
    private String fullname;
    private String avatarUrl;
    private SettingResponse role;
    private Boolean isActive;
    private Boolean hasClass = false;
}
