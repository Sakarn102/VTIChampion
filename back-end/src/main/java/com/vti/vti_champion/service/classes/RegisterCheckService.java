package com.vti.vti_champion.service.classes;

import com.vti.vti_champion.dto.request.RegisterRequest;
import com.vti.vti_champion.repository.UserRepository;
import com.vti.vti_champion.utils.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class RegisterCheckService {
    private final UserRepository  userRepository;

    public void checkInfo(RegisterRequest request){
        if (userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("username.existed!");
        }

        if (userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("email.existed!");
        }

        if (!PasswordUtil.isValidPassword(request.getPassword())){
            throw new RuntimeException("password.invalid!");
        }
    }
}
