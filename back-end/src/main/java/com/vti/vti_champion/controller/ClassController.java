package com.vti.vti_champion.controller;

import com.vti.vti_champion.dto.response.ClassResponse;
import com.vti.vti_champion.entity.Class;
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

    // GET /api/v1/classes — trả về danh sách lớp với teacherName
    @GetMapping
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

    // GET /api/v1/classes/student-counts — trả về Map<classId, studentCount> từ bảng class_user
    @GetMapping("/student-counts")
    public ResponseEntity<Map<Integer, Long>> getStudentCounts() {
        Map<Integer, Long> counts = new HashMap<>();
        classRepository.findAll().forEach(cls ->
            counts.put(cls.getId(), classUserRepository.countByClassRoom(cls))
        );
        return ResponseEntity.ok(counts);
    }
}
