package com.vti.vti_champion.service.interfaces;

public interface IOtpService {
    void verifyOtp(String email, String code);
    void sendCode(String email);
}
