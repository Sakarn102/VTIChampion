package com.vti.vti_champion.specification;

import com.vti.vti_champion.entity.Class;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

public class ClassSpecifications {
    // Lọc theo tên lớp
    public static Specification<Class> hasName(String name) {
        return (root, query, cb) -> {
            if (StringUtils.isEmpty(name)) return null;
            return cb.like(root.get("name"), "%" + name + "%");
        };
    }

    // 2. Lọc theo Phòng ban (Department ID)
    public static Specification<Class> hasDepartment(Integer departmentId) {
        return (root, query, cb) -> {
            if (departmentId == null) return null;
            return cb.equal(root.get("department").get("id"), departmentId);
        };
    }

    // 3. Lọc theo Giảng viên (Teacher ID)
    public static Specification<Class> hasTeacher(Integer teacherId) {
        return (root, query, cb) -> {
            if (teacherId == null) return null;
            return cb.equal(root.get("teacher").get("id"), teacherId);
        };
    }

    // 4. Lọc theo trạng thái Hoạt động
    public static Specification<Class> isActive(Boolean isActive) {
        return (root, query, cb) -> {
            if (isActive == null) return null;
            return cb.equal(root.get("isActive"), isActive);
        };
    }
}
