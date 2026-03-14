package com.vti.vti_champion.controller;

import com.vti.vti_champion.configuration.JwtService;
import com.vti.vti_champion.dto.request.LoginRequest;
import com.vti.vti_champion.dto.request.RegisterRequest;
import com.vti.vti_champion.entity.RefreshToken;
import com.vti.vti_champion.entity.Setting;
import com.vti.vti_champion.entity.User;
import com.vti.vti_champion.repository.SettingRepository;
import com.vti.vti_champion.repository.UserRepository;
import com.vti.vti_champion.service.interfaces.IRefreshTokenService;
import com.vti.vti_champion.service.interfaces.IUserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("api/v1/auth")
@CrossOrigin("http://localhost:3000")
@RequiredArgsConstructor
@Validated
@Slf4j
public class AuthController {
    private final AuthenticationManager authenticationManager;
    private final IUserService userService;
    private final JwtService  jwtService;
    private final IRefreshTokenService refreshTokenService;
    private final MessageSource messageSource;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final SettingRepository settingRepository;

    @PostMapping("/login")
    public ResponseEntity<?> login (@RequestBody LoginRequest request, HttpServletResponse response) {
        Locale locale = LocaleContextHolder.getLocale();

        try {
            Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword()));

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            User user = userService.getUserByUsername(userDetails.getUsername());

            String accessToken = jwtService.generateAccessToken(userDetails);
            RefreshToken token = refreshTokenService.createRefreshToken(user);

            Cookie cookie1 = new Cookie("refreshToken", token.getToken());
            cookie1.setHttpOnly(true);
            cookie1.setSecure(true);
            cookie1.setPath("/");
            if (request.isRememberMe()) {
                cookie1.setMaxAge(30 * 24 * 60 * 60);
            }
            else {
                cookie1.setMaxAge(24 * 60 * 60);
            }

            Cookie cookie2 = new Cookie("accessToken", accessToken);
            cookie2.setHttpOnly(true);
            cookie2.setSecure(false);
            cookie2.setPath("/");
            cookie2.setMaxAge(15 * 60);

            response.addCookie(cookie1);
            response.addCookie(cookie2);

            return ResponseEntity.ok(Map.of(
                    "message", "Login thanh cong",
                    "accessToken", accessToken
            ));

        } catch (BadCredentialsException e) {
            throw new BadCredentialsException("password.incorrect");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        // 1. Kiểm tra username/email đã tồn tại chưa (tùy chọn)
        if (userRepository.existsByUsername(request.getUsername())) {
            return ResponseEntity.badRequest().body("Username đã tồn tại!");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            return ResponseEntity.badRequest().body("Email đã tồn tại!");
        }

        // 2. Tạo đối tượng User mới
        User user = new User();
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setFullname(request.getFullName());

        // 3. MÃ HÓA MẬT KHẨU (Bước quan trọng nhất)
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        Setting studentRole = settingRepository.findByName("STUDENT")
                .orElseThrow(() -> new RuntimeException("Lỗi: Không tìm thấy Role STUDENT trong hệ thống"));

        user.setRole(studentRole);
        userRepository.save(user);
        return ResponseEntity.ok("Đăng ký thành công với quyền STUDENT!");


    }
}
