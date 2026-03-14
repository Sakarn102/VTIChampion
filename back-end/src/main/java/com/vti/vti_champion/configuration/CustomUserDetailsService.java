package com.vti.vti_champion.configuration;

import com.vti.vti_champion.entity.User;
import com.vti.vti_champion.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String usernameOrEmail) throws UsernameNotFoundException {
        User user;

        if (usernameOrEmail.contains("@")) {
            user = userRepository.findByEmail(usernameOrEmail).orElseThrow(() -> new BadCredentialsException("Email not found"));
        } else {
            user = userRepository.findByUsername(usernameOrEmail).orElseThrow(() -> new BadCredentialsException("Username not found"));
        }

        return new CustomUserDetails(user);
    }
}
