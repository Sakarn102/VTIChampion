package com.vti.vti_champion.controller;

import com.vti.vti_champion.dto.request.LoginRequest;
import com.vti.vti_champion.dto.request.RegisterRequest;
import com.vti.vti_champion.entity.User;
import com.vti.vti_champion.service.classes.OtpService;
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
@CrossOrigin("http://localhost:3000")
@RequiredArgsConstructor
@Validated
@Slf4j
public class AuthController {
    private final IUserService userService;
    private final IAuthService authService;
    private final OtpService otpService;

    @PostMapping("/login")
    public ResponseEntity<?> login (@RequestBody LoginRequest request, HttpServletResponse response) {
        Map<String, Object> result = authService.login(request, response);
        return ResponseEntity.ok(result);
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        try {
            User savedUser = userService.register(request);
            return ResponseEntity.ok(Map.of(
                    "message", "Register successfully!"
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletRequest request, HttpServletResponse response) {
       authService.logout(request, response);

       return  ResponseEntity.ok(Map.of("message", "Logout successfully!"));

    }

    @PostMapping("/verify-email")
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
