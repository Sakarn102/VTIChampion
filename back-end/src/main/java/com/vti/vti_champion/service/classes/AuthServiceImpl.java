package com.vti.vti_champion.service.classes;

import com.vti.vti_champion.configuration.CustomUserDetails;
import com.vti.vti_champion.configuration.JwtService;
import com.vti.vti_champion.dto.request.LoginRequest;
import com.vti.vti_champion.dto.request.RegisterRequest;
import com.vti.vti_champion.entity.RefreshToken;
import com.vti.vti_champion.entity.User;
import com.vti.vti_champion.repository.UserRepository;
import com.vti.vti_champion.service.interfaces.IAuthService;
import com.vti.vti_champion.service.interfaces.IRefreshTokenService;
import com.vti.vti_champion.service.interfaces.IUserService;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.util.WebUtils;

import java.util.HashMap;
import java.util.Locale;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements IAuthService {
    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final IRefreshTokenService refreshTokenService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public Map<String, Object> login(LoginRequest request, HttpServletResponse response) {
            User user = userRepository.findByUsernameOrEmail(request.getUsernameOrEmail(), request.getUsernameOrEmail())
                    .orElseThrow(() -> new RuntimeException("username_or_email.incorrect"));

            if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
                throw new BadCredentialsException("password.incorrect");
            }

            // 1. Xác thực người dùng
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getUsernameOrEmail(), request.getPassword()));

            // 2. Lấy UserDetails và User Entity
            CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

            // 3. Tạo Token
            String accessToken = jwtService.generateAccessToken(userDetails);
            RefreshToken token = refreshTokenService.createRefreshToken(user);

            // 4. Tạo Cookies
            Cookie cookie1 = new Cookie("refreshToken", token.getToken());
            cookie1.setHttpOnly(true);
            cookie1.setSecure(true);
            cookie1.setPath("/");
            if (request.isRememberMe()) {
                cookie1.setMaxAge(30 * 24 * 60 * 60);
            } else {
                cookie1.setMaxAge(24 * 60 * 60);
            }

            Cookie cookie2 = new Cookie("accessToken", accessToken);
            cookie2.setHttpOnly(true);
            cookie2.setSecure(false);
            cookie2.setPath("/");
            cookie2.setMaxAge(15 * 60);

            response.addCookie(cookie1);
            response.addCookie(cookie2);

            return Map.of(
                    "message", "Login thanh cong",
                    "accessToken", accessToken
            );

    }

    @Override
    public void logout(HttpServletRequest request, HttpServletResponse response) {
        // 1. Lấy và xóa Refresh Token trong Database
        Cookie cookie = WebUtils.getCookie(request, "refreshToken");
        if (cookie != null) {
            refreshTokenService.deleteByToken(cookie.getValue());
        }

        Cookie cookie1 = new Cookie("refreshToken", null);
        cookie1.setHttpOnly(true);
        cookie1.setSecure(true);
        cookie1.setPath("/");
        cookie1.setMaxAge(0);

        Cookie cookie2 = new Cookie("accessToken", null);
        cookie2.setHttpOnly(true);
        cookie2.setSecure(false);
        cookie2.setPath("/");
        cookie2.setMaxAge(0);

        response.addCookie(cookie1);
        response.addCookie(cookie2);


    }
}
