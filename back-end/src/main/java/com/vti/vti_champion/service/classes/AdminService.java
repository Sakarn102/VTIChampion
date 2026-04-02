package com.vti.vti_champion.service.classes;

import com.vti.vti_champion.dto.request.*;
import com.vti.vti_champion.dto.response.AdminUserResponse;
import com.vti.vti_champion.dto.response.ClassResponse;
import com.vti.vti_champion.entity.Class;
import com.vti.vti_champion.entity.Setting;
import com.vti.vti_champion.entity.User;
import com.vti.vti_champion.repository.ClassRepository;
import com.vti.vti_champion.repository.SettingRepository;
import com.vti.vti_champion.repository.UserRepository;
import com.vti.vti_champion.service.interfaces.IAdminService;
import com.vti.vti_champion.specification.ClassSpecifications;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminService implements IAdminService {
    private final UserRepository userRepository;
    private final SettingRepository settingRepository;
    private final ModelMapper modelMapper;
    private final PasswordEncoder passwordEncoder;
    private final ClassRepository classRepository;

    private static final String DEFAULT_AVATAR = "https://i.pinimg.com/736x/21/91/6e/21916e491ef0d796398f5724c313bbe7.jpg";

    @Override
    @Transactional
    public void toggleUserStatus(Integer userId, boolean status) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setIsActive(status);
        userRepository.save(user);
    }

    @Override
    public Page<AdminUserResponse> getAllTeachers(Pageable pageable) {
        Page<User> teachers = userRepository.findByTeacher("TEACHER", pageable);

        return teachers.map(user -> {
            AdminUserResponse response = new AdminUserResponse();
            response.setId(user.getId());
            response.setUsername(user.getUsername());
            response.setFullname(user.getFullname());
            response.setEmail(user.getEmail());
            response.setRoleName(user.getRole().getName());
            response.setIsActive(user.getIsActive());
            response.setCreatedAt(user.getCreateDate());
            return response;
        });
    }

    @Override
    @Transactional
    public AdminUserResponse createTeacher(CreateTeacherRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }

        Setting teacherRole = settingRepository.findByNameIgnoreCaseAndType_Id("Teacher", 1)
                .orElseThrow(() -> new RuntimeException("Role TEACHER not found in Settings"));

        Setting department = null;
        if (request.getDepartmentId() != null) {
            department = settingRepository.findById(request.getDepartmentId())
                    .filter(s -> s.getType().getId() == 2)
                    .orElseThrow(() -> new RuntimeException("Department not found"));
        }

        User teacher = new User();
        teacher.setUsername(request.getUsername());
        teacher.setEmail(request.getEmail());
        teacher.setFullname(request.getFullName());
        teacher.setPassword(passwordEncoder.encode(request.getPassword()));
        teacher.setAvatarUrl(DEFAULT_AVATAR);
        teacher.setRole(teacherRole);
        teacher.setDepartment(department);
        teacher.setIsActive(true);
        teacher.setEnabled(true);

        User savedUser = userRepository.save(teacher);

        return modelMapper.map(savedUser,AdminUserResponse.class);
    }

    @Override
    public Page<ClassResponse> getAllClasses(ClassFilterRequest request, Pageable pageable) {
        Specification<Class> spec = Specification
                .where(ClassSpecifications.hasName(request.getName())
                        .and(ClassSpecifications.hasDepartment(request.getDepartmentId()))
                        .and(ClassSpecifications.hasTeacher(request.getTeacherId()))
                        .and(ClassSpecifications.isActive(request.getIsActive())));

        Page<Class> classes = classRepository.findAll(spec, pageable);

        return classes.map(clazz -> {
            ClassResponse response = modelMapper.map(clazz, ClassResponse.class);
            if (clazz.getDepartment() != null) {
                response.setDepartmentName(clazz.getDepartment().getName());
            }
            if (clazz.getTeacher() != null) {
                response.setTeacherName(clazz.getTeacher().getFullname());
            }
            return response;
        });
    }

    @Override
    @Transactional
    public ClassResponse createClass(CreateClassRequest request) {
        // 1. Kiểm tra Phòng ban (phải có type_id = 2 như trong ảnh database của bạn)
        Setting department = settingRepository.findById(request.getDepartmentId())
                .filter(s -> s.getType().getId() == 2)
                .orElseThrow(() -> new RuntimeException("Phòng ban không hợp lệ hoặc không tồn tại"));

        // 2. Kiểm tra Giảng viên (phải tồn tại trong bảng User)
        User teacher = userRepository.findById(request.getTeacherId())
                .orElseThrow(() -> new RuntimeException("Giảng viên không tồn tại"));

        // 3. Map dữ liệu vào Entity Class
        com.vti.vti_champion.entity.Class newClass = new com.vti.vti_champion.entity.Class();
        newClass.setName(request.getName());
        newClass.setThumbnailUrl(request.getThumbnailUrl());
        newClass.setDepartment(department);
        newClass.setTeacher(teacher);
        newClass.setIsActive(true);

        // 4. Lưu vào Database
        com.vti.vti_champion.entity.Class savedClass = classRepository.save(newClass);

        // 5. Trả về DTO (Dùng ModelMapper để tự động map các trường)
        return modelMapper.map(savedClass, ClassResponse.class);
    }

    @Override
    @Transactional
    public void addStudentsToClass(AddStudentsToClassRequest request) {
        // 1. Tìm lớp học
        Class clazz = classRepository.findById(request.getClassId())
                .orElseThrow(() -> new RuntimeException("Class not found"));

        // 2. Tìm danh sách học sinh từ list ID truyền lên
        List<User> newStudents = userRepository.findAllById(request.getStudentIds());

        // 3. Kiểm tra logic (Chỉ cho phép thêm những User có Role là STUDENT và đang Active)
        for (User student : newStudents) {
            if (!student.getRole().getName().equalsIgnoreCase("STUDENT")) {
                throw new RuntimeException("Người dùng " + student.getUsername() + " không phải là Học sinh");
            }

            if (!student.getIsActive()) {
                throw new RuntimeException("Học sinh "+ student.getUsername() + " đang bị khóa, không thể thêm vào lớp");
            }

            // Kiểm tra xem học sinh đã có trong lớp chưa để tránh trùng lặp
            if (!clazz.getStudents().contains(student)) {
                clazz.getStudents().add(student);
            }
        }
        classRepository.save(clazz);
    }

    @Override
    @Transactional
    public ClassResponse updateClass(Integer classId, UpdateClassRequest request) {
        Class clazz = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Class not found"));

        if (request.getName() != null && !request.getName().isBlank()) {
            clazz.setName(request.getName());
        }

        if (request.getThumbnailUrl() != null) {
            clazz.setThumbnailUrl(request.getThumbnailUrl());
        }

        if (request.getIsActive() != null) {
            clazz.setIsActive(request.getIsActive());
        }

        if (request.getDepartmentId() != null) {
            Setting department = settingRepository.findById(request.getDepartmentId())
                    .filter(s -> s.getType().getId() == 2)
                    .orElseThrow(() -> new RuntimeException("Phòng ban không hợp lệ"));
            clazz.setDepartment(department);
        }

        if (request.getTeacherId() != null) {
            User teacher = userRepository.findById(request.getTeacherId())
                    .orElseThrow(() -> new RuntimeException("Giảng viên không tồn tại"));

            if (Boolean.FALSE.equals(teacher.getIsActive())) {
                throw new RuntimeException("Giảng viên này đang bị khóa, không thể nhận lớp!");
            }
            clazz.setTeacher(teacher);
        }
        Class updatedClass = classRepository.save(clazz);
        return modelMapper.map(updatedClass, ClassResponse.class);
    }

    @Override
    @Transactional
    public void toggleClassStatus(Integer classId, Boolean status) {

        Class clazz = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy lớp học với ID: " + classId));

        if (status == null) {
            clazz.setIsActive(!clazz.getIsActive());
        } else {
            clazz.setIsActive(status);
        }

        classRepository.save(clazz);
    }
}
