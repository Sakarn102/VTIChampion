package com.vti.vti_champion.specification;

import com.vti.vti_champion.dto.request.FilterQuestionRequest;
import com.vti.vti_champion.entity.Question;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.List;

public class QuestionSpecification {
    public static Specification<Question> filter(FilterQuestionRequest request) {
        return ((root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            if (request.getContent() != null) {
                predicates.add(cb.like(root.get("content"), "%" + request.getContent() + "%" ));
            }

            if (request.getDifficultyLevel() != null) {
                predicates.add(cb.equal(root.get("difficultyLevel"), request.getDifficultyLevel().toString()));
            }

            // 1. So sánh LỚN HƠN HOẶC BẰNG (Từ ngày...)
            if (request.getFromDate() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("createDate"), request.getFromDate()));
            }

            // 2. So sánh NHỎ HƠN HOẶC BẰNG (...đến ngày)
            if (request.getToDate() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("createDate"), request.getToDate()));
            }

            // 3. Nếu bạn muốn dùng BETWEEN (phải có cả 2 đầu ngày)
            if (request.getFromDate() != null && request.getToDate() != null) {
                predicates.add(cb.between(root.get("createDate"), request.getFromDate(), request.getToDate()));
            }
            return cb.and(predicates.toArray(new Predicate[0]));
        });
    }
}
