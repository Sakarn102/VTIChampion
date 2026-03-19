package com.vti.vti_champion.service.classes;

import com.vti.vti_champion.dto.mail.CodeSender;
import com.vti.vti_champion.entity.Otp;
import com.vti.vti_champion.entity.User;
import com.vti.vti_champion.repository.OtpRepository;
import com.vti.vti_champion.repository.UserRepository;
import com.vti.vti_champion.service.interfaces.IOtpService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.ApplicationEventPublisher;
import org.springframework.context.MessageSource;
import org.springframework.context.i18n.LocaleContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Locale;
import java.util.Random;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class OtpService implements IOtpService {
    private final OtpRepository otpRepository;
    private final PasswordEncoder passwordEncoder;
    private final MessageSource messageSource;
    private final ApplicationEventPublisher eventPublisher;
    private final UserRepository userRepository;

    // 1. Tạo mã 6 số ngẫu nhiên
    private String generateOtp() {
        return String.valueOf(ThreadLocalRandom.current().nextInt(100000, 1000000));
    }

    @Override
    @Transactional
    public void verifyOtp(String email, String code) {
        Locale locale = LocaleContextHolder.getLocale();

        // Tìm OTP mới nhất của Email
        Otp otp = otpRepository.findTopByEmailOrderByCreatedAtDesc(email)
                .orElseThrow(() -> new RuntimeException(messageSource.getMessage("code.invalid", null, locale)));

        // Kiểm tra logic
        if (otp.isUsed()) {
            throw new RuntimeException(messageSource.getMessage("code.used", null, locale));
        }
        if (otp.getExpiredDate().isBefore(LocalDateTime.now())) {
            throw new RuntimeException(messageSource.getMessage("code.expired", null, locale));
        }

        // So khớp mã code người dùng nhập với Hash trong DB
        if (!passwordEncoder.matches(code, otp.getOtpHash())) {
            throw new RuntimeException("code.incorrect");
        }

        // ĐÁNH DẤU ĐÃ DÙNG & KÍCH HOẠT USER
        otp.setUsed(true);
        otpRepository.save(otp);

        // KÍCH HOẠT USER TRONG DATABASE
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found!"));
        user.setEnabled(true);
        userRepository.save(user);
    }

    @Override
    @Transactional
    public void sendCode(String email) {
        // 1. Tạo mã 6 số ngẫu nhiên
        String code = generateOtp();
        String codeHashed = passwordEncoder.encode(code);

        // 2. Hash mã trước khi lưu vào DB
        Otp otp = new Otp();
        otp.setEmail(email);
        otp.setOtpHash(codeHashed);
        otp.setCreatedAt(LocalDateTime.now());
        otp.setExpiredDate(LocalDateTime.now().plusMinutes(5));
        otpRepository.save(otp);

        // 3. Bắn sự kiện gửi Mail (CodeSender là DTO chứa email và code thô)
        eventPublisher.publishEvent(new CodeSender(email, code));

    }
}
