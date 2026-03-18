package com.vti.vti_champion.dto.mail;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class CodeSender {
    private final String toEmail;
    private final String code;
}
