package com.vti.vti_champion.controller;

import com.vti.vti_champion.configuration.CustomUserDetails;
import com.vti.vti_champion.dto.request.UpdateUserRequest;
import com.vti.vti_champion.dto.response.SettingResponse;
import com.vti.vti_champion.dto.response.StudentResponse;
import com.vti.vti_champion.dto.response.UserResponse;
import com.vti.vti_champion.entity.User;
import com.vti.vti_champion.service.classes.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/v1/users")
@CrossOrigin("http://localhost:3000")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final com.vti.vti_champion.repository.ClassUserRepository classUserRepository;

    @GetMapping("/me")
    public ResponseEntity<?> getMe(Authentication authentication) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        User user = userService.findById(userDetails.getId());

        UserResponse userResponse = new UserResponse();
        userResponse.setId(userDetails.getId());
        userResponse.setUsername(userDetails.getUsername());
        userResponse.setFullname(userDetails.getFullName());
        userResponse.setEmail(userDetails.getEmail());
        userResponse.setAvatarUrl(userDetails.getAvatarUrl());

        SettingResponse settingResponse = new SettingResponse();
        settingResponse.setName(user.getRole().getName().toString());
        userResponse.setRole(settingResponse);

        // Kiểm tra xem học viên đã thuộc lớp nào chưa (case-insensitive)
        String roleName = user.getRole().getName().trim().toUpperCase();
        if ("STUDENT".equals(roleName)) {
            boolean hasClass = classUserRepository.existsByStudentId(userDetails.getId());
            userResponse.setHasClass(hasClass);
        } else {
            userResponse.setHasClass(true); // Admin, Teacher luôn có quyền truy cập
        }

        return  ResponseEntity.ok(Map.of(
                "message", "Get thông tin user thành công",
                "data", userResponse));
    }

    @PutMapping(value = "/me", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateMe(
            Authentication authentication,
            @Valid @RequestPart(value = "data", required = false) UpdateUserRequest request,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar) {
        if (authentication == null || !authentication.isAuthenticated()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Integer userId = userDetails.getId();

        User updatedUser = userService.updateMe(userId, request, avatar);

        return ResponseEntity.ok(Map.of(
                "message", "Updated Successfully!",
                "data", updatedUser));
    }

    @PutMapping(value = "/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> updateUser(
            @PathVariable Integer id,
            @Valid @RequestPart(value = "data", required = false) UpdateUserRequest request,
            @RequestPart(value = "avatar", required = false) MultipartFile avatar) {

        User updatedUser = userService.updateMe(id, request, avatar);

        return ResponseEntity.ok(Map.of(
                "message", "Cập nhật người dùng thành công",
                "data", updatedUser));
    }

    @GetMapping
    public ResponseEntity<Page<UserResponse>> getAllUsers(Pageable pageable) {
        return ResponseEntity.ok(userService.getAllUsers(pageable));
    }

    // Lấy danh sách học viên
    @GetMapping("/teacher/my-students")
    public ResponseEntity<List<StudentResponse>> getStudentsByTeacher(Authentication authentication) {
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();
        Integer teacherId = userDetails.getId();

        List<StudentResponse> students = userService.getStudentsByTeacher(teacherId);

        if (students.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }

        return new ResponseEntity<>(students, HttpStatus.OK);
    }

    @DeleteMapping("/{id}")
    //@PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteUser(@PathVariable Integer id) {
        userService.deleteUser(id);
        return ResponseEntity.ok(Map.of("message", "Xóa người dùng thành công!"));
    }

}
