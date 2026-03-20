package com.vti.vti_champion.service.interfaces;

import com.vti.vti_champion.dto.request.RegisterRequest;
import com.vti.vti_champion.dto.request.UpdateUserRequest;
import com.vti.vti_champion.entity.User;
import org.springframework.web.multipart.MultipartFile;

public interface IUserService {
    public User getUserByUsernameOrEmail(String username, String email);
    User register(RegisterRequest request);
    User updateMe(Integer userId, UpdateUserRequest request, MultipartFile avatar);
    boolean findUserByEmail(String email);
    org.springframework.data.domain.Page<User> getAllUsers(org.springframework.data.domain.Pageable pageable);
}
