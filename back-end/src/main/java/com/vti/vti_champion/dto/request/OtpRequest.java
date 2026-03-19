package com.vti.vti_champion.dto.request;

import lombok.Data;

@Data
public class OtpRequest {
    private String email;
    private String code;
}
