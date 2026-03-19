package com.vti.vti_champion.controller;

import com.vti.vti_champion.dto.request.LoginRequest;
import com.vti.vti_champion.dto.request.OtpRequest;
import com.vti.vti_champion.dto.request.RegisterRequest;
import com.vti.vti_champion.entity.User;
import com.vti.vti_champion.service.classes.OtpService;
import com.vti.vti_champion.service.classes.RegisterCheckService;
import com.vti.vti_champion.service.interfaces.IAuthService;
import com.vti.vti_champion.service.interfaces.IUserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("api/v1/auth")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@Validated
@Slf4j
public class AuthController {
    private final IUserService userService;
    private final IAuthService authService;
    private final OtpService otpService;
    private final RegisterCheckService registerCheckService;

    @PostMapping("/login")
    public ResponseEntity<?> login (@RequestBody LoginRequest request, HttpServletResponse response) {
        Map<String, Object> result = authService.login(request, response);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            userService.register(request);
            return ResponseEntity.ok(Map.of(
                    "message", "Đăng ký thành công! Vui lòng kiểm tra Email để nhận mã xác thực!"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestBody OtpRequest request) {
        otpService.verifyOtp(request.getEmail(), request.getCode());
        return ResponseEntity.ok(Map.of(
                "message", "Xác thực thành công! Giờ bạn có thể đăng nhập!"
        ));
    }

    @PostMapping("/send-code")
    public ResponseEntity<?> sendCode(@Valid @RequestBody RegisterRequest request) {
        registerCheckService.checkInfo(request);
        otpService.sendCode(request.getEmail());

        return ResponseEntity.ok().build();
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
       authService.logout(request, response);

       return  ResponseEntity.ok(Map.of("message", "Logout successfully!"));

    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestParam String email) {
        boolean result = userService.findUserByEmail(email);
        if (result) {
            otpService.sendCode(email);

            return ResponseEntity.ok(Map.of(
                    "message", "Verification Code has been sent to your email!"
            ));
        }

        return ResponseEntity.badRequest().body(Map.of(
                "message", "Account not found!"
        ));
    }

}
