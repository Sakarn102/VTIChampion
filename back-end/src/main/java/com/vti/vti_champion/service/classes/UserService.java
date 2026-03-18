package com.vti.vti_champion.service.classes;

import com.vti.vti_champion.configuration.CloudinaryService;
import com.vti.vti_champion.dto.request.RegisterRequest;
import com.vti.vti_champion.dto.request.UpdateUserRequest;
import com.vti.vti_champion.entity.Setting;
import com.vti.vti_champion.entity.User;
import com.vti.vti_champion.repository.SettingRepository;
import com.vti.vti_champion.repository.UserRepository;
import com.vti.vti_champion.service.interfaces.IUserService;
import com.vti.vti_champion.utils.PasswordUtil;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

@Service
@RequiredArgsConstructor
public class UserService implements IUserService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private final SettingRepository settingRepository;
    private final CloudinaryService cloudinaryService;

    private static final String DEFAULT_AVATAR = "https://i.pinimg.com/736x/21/91/6e/21916e491ef0d796398f5724c313bbe7.jpg";

    @Override
    public User getUserByUsernameOrEmail(String username, String email) {
        return userRepository.findByUsernameOrEmail(username, email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy Username hoac Email!"));
    }

    @Override
    public User register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists! ");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists! ");
        }

        User user = modelMapper.map(request, User.class);
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        Setting setting = settingRepository.findByName("Student")
                .orElseThrow(() -> new RuntimeException("Role not found!"));
        user.setRole(setting);
        user.setAvatarUrl(DEFAULT_AVATAR);
        user.setIsActive(true);

        return userRepository.save(user);
    }

    @Override
    public User updateMe(Integer userId, UpdateUserRequest request, MultipartFile avatar) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found!"));

        boolean updated = false;

        if (Boolean.TRUE.equals(request.getRemoveAvatar())) {
            user.setAvatarUrl(DEFAULT_AVATAR);
            updated = true;
        }

        if (request.getFullName() != null) {
            if (request.getFullName().isBlank()) {
                throw new RuntimeException("fullname.notBlank!");
            }
            user.setFullname(request.getFullName());
            updated = true;
        }

        if (request.getUsername() != null) {
            if (request.getUsername().isBlank()) {
                throw new RuntimeException("username.notBlank!");
            }
            user.setUsername(request.getUsername());
            updated = true;
        }

        if (request.getEmail() != null) {
            if (request.getEmail().isBlank()) {
                throw new RuntimeException("email.notBlank!");
            }
            user.setEmail(request.getEmail());
            updated = true;
        }

        if (request.getNewPassword() != null) {
            if (request.getCurrentPassword() == null) {
                throw new RuntimeException("password.current.notBlank");
            }

            if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPassword())) {
                throw new RuntimeException("password.current.false");
            }

            if (!PasswordUtil.isValidPassword(request.getNewPassword())) {
                throw new RuntimeException("password.invalid");
            }

            user.setPassword(passwordEncoder.encode(request.getNewPassword()));
            updated = true;
        }

        if (avatar != null && !avatar.isEmpty()) {
            String avatarUrl = cloudinaryService.uploadUserAvatar(avatar, userId);
            user.setAvatarUrl(avatarUrl);
            updated = true;
        }

        if (!updated) {
            throw new RuntimeException("noFiled!");
        }

        return userRepository.save(user);
    }

    @Override
    public boolean findUserByEmail(String email) {
        return userRepository.existsByEmail(email);
    }
}
