package com.vti.vti_champion.controller;

import com.vti.vti_champion.configuration.CustomUserDetails;
import com.vti.vti_champion.dto.request.UpdateUserRequest;
import com.vti.vti_champion.dto.response.SettingResponse;
import com.vti.vti_champion.dto.response.UserResponse;
import com.vti.vti_champion.entity.User;
import com.vti.vti_champion.service.classes.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin("http://localhost:3000")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        UserResponse userResponse = new UserResponse();
        userResponse.setId(userDetails.getId());
        userResponse.setUsername(userDetails.getUsername());
        userResponse.setFullname(userDetails.getFullName());
        userResponse.setEmail(userDetails.getEmail());
        userResponse.setAvatarUrl(userDetails.getAvatarUrl());

        SettingResponse settingResponse = new SettingResponse();
        settingResponse.setName(userDetails.getAuthorities().iterator().next().getAuthority());

        userResponse.setRole(settingResponse);

        return  ResponseEntity.ok(Map.of(
                "message", "Get thông tin user thành công",
                "data", userResponse
        ));
    }

    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateMe(
            Authentication authentication,
            @Valid @RequestPart(value = "data", required = false) UpdateUserRequest request,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar)
    {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Integer userId = userDetails.getId();

        User updatedUser = userService.updateMe(userId, request, avatar);

        return ResponseEntity.ok(Map.of(
                "message", "Updated Successfully!",
                "data", updatedUser
        ));
    }

    @GetMapping
    public ResponseEntity<?> getAllUsers(org.springframework.data.domain.Pageable pageable) {
        org.springframework.data.domain.Page<UserResponse> responses = userService.getAllUsers(pageable).map(user -> {
            UserResponse res = new UserResponse();
            res.setId(user.getId());
            res.setUsername(user.getUsername());
            res.setEmail(user.getEmail());
            res.setFullname(user.getFullname());
            res.setAvatarUrl(user.getAvatarUrl());
            res.setIsActive(user.getIsActive());
            
            SettingResponse role = new SettingResponse();
            if (user.getRole() != null) {
                role.setName(user.getRole().getName());
            }
            res.setRole(role);
            return res;
        });
        return ResponseEntity.ok(responses);
    }

}
