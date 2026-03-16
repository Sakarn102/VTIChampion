package com.vti.vti_champion.service.classes;

import com.vti.vti_champion.entity.RefreshToken;
import com.vti.vti_champion.entity.User;
import com.vti.vti_champion.repository.RefreshTokenRepository;
import com.vti.vti_champion.service.interfaces.IRefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class RefreshTokenService implements IRefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-expiration}")
    private Long refreshExpiration;

    @Override
    @Transactional
    public RefreshToken createRefreshToken(User user) {
        RefreshToken token = refreshTokenRepository.findByUserId(user.getId())
                .orElse(new RefreshToken());

        token.setUser(user);
        token.setToken(UUID.randomUUID().toString());
        token.setExpiryDate(Instant.now().plusMillis(refreshExpiration));

        return refreshTokenRepository.save(token);
    }

    @Override
    @Transactional
    public void deleteByToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }
}
