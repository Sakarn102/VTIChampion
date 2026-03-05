package com.vti.vti_champion.specification;

import com.vti.vti_champion.dto.request.QuestionFilterRequest;
import com.vti.vti_champion.entity.Question;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalTime;
import java.util.ArrayList;
import java.util.List;

public class QuestionSpecification {

    public static Specification<Question> buildSpec(Integer instructorId, QuestionFilterRequest filter) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            // 1. Lọc theo ID người tạo
            if (instructorId != null) {
                predicates.add(cb.equal(root.get("user").get("id"), instructorId));
            }

            // 2. Lọc theo từ khóa tìm kiếm (Nội dung câu hỏi)
            if (filter != null & filter.getSearch() != null &&  !filter.getSearch().isEmpty()) {
                String search = "%" + filter.getSearch().trim() + "%";
                predicates.add(cb.like(root.get("content"), search));
            }

            // 3. Lọc theo khoảng thời gian tạo
            if (filter != null) {
                if (filter.getFrom() != null) {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("createDate"), filter.getFrom().atStartOfDay()));
                }
                if (filter.getTo() != null) {
                    predicates.add(cb.lessThanOrEqualTo(root.get("createDate"), filter.getTo().atTime(LocalTime.MAX)));
                }
            }

            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}
