package com.vti.vti_champion.controller;

import com.vti.vti_champion.dto.request.*;
import com.vti.vti_champion.dto.response.AdminUserResponse;
import com.vti.vti_champion.dto.response.ClassResponse;
import com.vti.vti_champion.service.classes.AdminService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/v1/admin")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
public class AdminController {
    private final AdminService adminService;

    @PatchMapping("/status/{id}") // cập nhật một phần object
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> toogleUserStatus(@PathVariable Integer id, @RequestParam boolean active) {
        adminService.toggleUserStatus(id, active);
        return ResponseEntity.ok("Cập nhật trạng thái thành công");
    }

    @GetMapping("/get-all-teacher")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getAllTeacher(Pageable pageable) {
        Page<AdminUserResponse> users = adminService.getAllTeachers(pageable);
        return ResponseEntity.ok(users);
    }

    @PostMapping("/create-teacher")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> createTeacher(@RequestBody CreateTeacherRequest request) {
        AdminUserResponse result = adminService.createTeacher(request);
        return ResponseEntity.ok(result);
    }

    @GetMapping("/get-all-class")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Page<ClassResponse>> getAllClasses(ClassFilterRequest request, Pageable pageable) {
        Page<ClassResponse> classes = adminService.getAllClasses(request, pageable);

        return ResponseEntity.ok(classes);
    }

    @PostMapping("/create-class")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassResponse> createClass(@Valid @RequestBody CreateClassRequest request) {
        return ResponseEntity.ok(adminService.createClass(request));
    }

    @PostMapping("/add-students-to-class")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> addStudents(@Valid @RequestBody AddStudentsToClassRequest request) {
        adminService.addStudentsToClass(request);
        return ResponseEntity.ok("Đã thêm học sinh vào lớp thành công");
    }

    @PutMapping("update-class/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ClassResponse> updateClass(
            @PathVariable Integer id,
            @RequestBody UpdateClassRequest request) {
        return ResponseEntity.ok(adminService.updateClass(id, request));
    }

    @PatchMapping("/toggle-class/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> toggleStatus(
            @PathVariable Integer id,
            @RequestParam(required = false) Boolean status) {

        adminService.toggleClassStatus(id, status);

        String message = (status != null && status) ? "Đã mở khóa lớp học" : "Đã khóa lớp học";
        if (status == null)
            message = "Đã thay đổi trạng thái lớp học";

        return ResponseEntity.ok(message);
    }

    @GetMapping("/settings/type/{typeId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getSettingsByType(@PathVariable Integer typeId) {
        return ResponseEntity.ok(adminService.getSettingsByType(typeId));
    }

    @DeleteMapping("/delete-class/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteClass(@PathVariable Integer id) {
        adminService.deleteClass(id);
        return ResponseEntity.ok(java.util.Map.of("message", "Xóa lớp học thành công!"));
    }

    @GetMapping("/unassigned-students")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> getUnassignedStudents() {
        return ResponseEntity.ok(adminService.getUnassignedStudents());
    }
}
