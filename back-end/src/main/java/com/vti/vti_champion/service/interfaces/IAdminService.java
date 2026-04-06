package com.vti.vti_champion.service.interfaces;

import com.vti.vti_champion.dto.request.*;
import com.vti.vti_champion.dto.response.AdminUserResponse;
import com.vti.vti_champion.dto.response.ClassResponse;
import com.vti.vti_champion.dto.response.SettingResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface IAdminService {
    void toggleUserStatus(Integer userId, boolean status);
    Page<AdminUserResponse> getAllTeachers(Pageable pageable);
    AdminUserResponse createTeacher(CreateTeacherRequest request);
    AdminUserResponse createAccount(CreateUserRequest request);

    Page<ClassResponse> getAllClasses(ClassFilterRequest request, Pageable pageable);

    ClassResponse createClass(CreateClassRequest request);

    void addStudentsToClass(AddStudentsToClassRequest request);

    ClassResponse updateClass(Integer classId, UpdateClassRequest request);

    void toggleClassStatus(Integer classId, Boolean status);

    void deleteClass(Integer id);
    
    List<AdminUserResponse> getUnassignedStudents();

    List<SettingResponse> getSettingsByType(Integer typeId);
}
