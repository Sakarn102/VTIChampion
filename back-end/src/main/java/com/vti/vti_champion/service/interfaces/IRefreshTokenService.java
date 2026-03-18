package com.vti.vti_champion.service.interfaces;

import com.vti.vti_champion.entity.RefreshToken;
import com.vti.vti_champion.entity.User;

import java.util.Optional;

public interface IRefreshTokenService {
    RefreshToken createRefreshToken(User user);
//    Optional<RefreshToken> findByToken(String token);
    void deleteByToken(String token);

}
