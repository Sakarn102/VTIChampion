package com.vti.vti_champion.specification;

import com.vti.vti_champion.entity.Exam;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;

public class ExamSpecification {

    // 1. Tìm kiếm theo từ khóa (Code hoặc Title)
    public static Specification<Exam> hasKeyword(String keyword) {
        return (root, query, cb) -> {
            if (keyword == null || keyword.isBlank()) {
                return null;
            }
            String lowerKeyword = "%" + keyword.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("code")), lowerKeyword),
                    cb.like(cb.lower(root.get("title")), lowerKeyword)
            );
        };
    }

    // 2. Lọc theo Class ID (Join bảng)
    public static Specification<Exam> hasClassId(Integer classId) {
        return (root, query, cb) -> {
            if (classId == null) return null;
            return cb.equal(root.get("classRoom").get("id"), classId);
        };
    }

    // 3. Lọc theo Creator ID
    public static Specification<Exam> hasCreatorId(Integer creatorId) {
        return (root, query, cb) -> {
            if (creatorId == null) return null;
            return cb.equal(root.get("teacher").get("id"), creatorId);
        };
    }

    // 4. Lọc theo khoảng thời gian
    public static Specification<Exam> createdBeetween(LocalDateTime startDate, LocalDateTime endDate) {
        return (root, query, cb) -> {
            if (startDate == null && endDate == null) return null;

            if (startDate != null && endDate != null) {
                return cb.between(root.get("createDate"), startDate, endDate);
            }

            if (startDate != null) {
                return cb.greaterThanOrEqualTo(root.get("createDate"), startDate);
            }

            return cb.greaterThanOrEqualTo(root.get("createDate"), endDate);
        };
    }
}
