package com.vti.vti_champion.controller;

import com.vti.vti_champion.dto.response.ClassResponse;
import com.vti.vti_champion.dto.response.StudentResponse;
import com.vti.vti_champion.entity.Class;
import com.vti.vti_champion.entity.User;
import com.vti.vti_champion.repository.ClassRepository;
import com.vti.vti_champion.repository.ClassUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/v1/classes")
@CrossOrigin("http://localhost:3000")
@RequiredArgsConstructor
public class ClassController {
    private final ClassRepository classRepository;
    private final ClassUserRepository classUserRepository;

    // GET /api/v1/classes
    @GetMapping("")
    public ResponseEntity<List<ClassResponse>> getAllClasses() {
        List<ClassResponse> result = classRepository.findAll()
                .stream()
                .map(cls -> {
                    ClassResponse dto = new ClassResponse();
                    dto.setId(cls.getId());
                    dto.setName(cls.getName());
                    dto.setCreateDate(cls.getCreateDate());
                    dto.setThumbnailUrl(cls.getThumbnailUrl());
                    dto.setIsActive(cls.getIsActive());
                    dto.setDepartmentName(cls.getDepartment() != null ? cls.getDepartment().getName() : null);
                    dto.setTeacherName(cls.getTeacher() != null ? cls.getTeacher().getFullname() : "Chưa phân công");
                    return dto;
                })
                .collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // PUT /api/v1/classes/{id}/toggle-status
    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleClassStatus(@PathVariable Integer id) {
        Class clazz = classRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Lớp học không tồn tại"));

        clazz.setIsActive(!clazz.getIsActive());
        classRepository.save(clazz);

        return ResponseEntity.ok(Map.of(
                "message", "Cập nhật trạng thái thành công!",
                "isActive", clazz.getIsActive()));
    }

    // GET /api/v1/classes/student-counts
    @GetMapping("/student-counts")
    public ResponseEntity<Map<Integer, Long>> getStudentCounts() {
        Map<Integer, Long> counts = new HashMap<>();
        classRepository.findAll().forEach(cls -> counts.put(cls.getId(), classUserRepository.countByClassRoom(cls)));
        return ResponseEntity.ok(counts);
    }

    // GET /api/v1/classes/{id}/students
    @GetMapping("/{id}/students")
    public ResponseEntity<List<StudentResponse>> getStudentsByClass(@PathVariable Integer id) {
        List<User> students = classUserRepository.findStudentsByClassId(id);
        List<StudentResponse> result = students.stream().map(u -> {
            StudentResponse dto = new StudentResponse();
            dto.setId(u.getId());
            dto.setFullname(u.getFullname());
            dto.setUsername(u.getUsername());
            dto.setEmail(u.getEmail());
            dto.setAvatarUrl(u.getAvatarUrl());
            dto.setDepartmentName(u.getDepartment() != null ? u.getDepartment().getName() : null);
            dto.setCreateDate(u.getCreateDate());
            return dto;
        }).collect(Collectors.toList());
        return ResponseEntity.ok(result);
    }

    // DELETE /api/v1/classes/{id}/students/{studentId}
    @DeleteMapping("/{id}/students/{studentId}")
    public ResponseEntity<?> removeStudentFromClass(@PathVariable Integer id, @PathVariable Integer studentId) {
        classUserRepository.deleteByClassIdAndStudentId(id, studentId);
        return ResponseEntity.ok(Map.of("message", "Đã xóa học viên khỏi lớp"));
    }
}
