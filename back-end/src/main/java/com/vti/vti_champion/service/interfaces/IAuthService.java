package com.vti.vti_champion.service.interfaces;

import com.vti.vti_champion.dto.request.LoginRequest;
import com.vti.vti_champion.dto.request.RegisterRequest;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

import java.util.Map;

public interface IAuthService {
    Map<String, Object> login(LoginRequest request, HttpServletResponse response);
    void logout(HttpServletRequest request, HttpServletResponse response);
}
