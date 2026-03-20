package com.vti.vti_champion.dto.request;

import lombok.Data;

@Data
public class ResetPasswordRequest {
    private String email;
    private String code;
    private String newPassword;
}
