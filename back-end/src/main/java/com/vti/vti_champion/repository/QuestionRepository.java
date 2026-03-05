package com.vti.vti_champion.repository;

import com.vti.vti_champion.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

@Repository
public interface QuestionRepository extends JpaRepository<Question,Integer>, JpaSpecificationExecutor<Question> {
    Page<Question> findByUserId(Integer userId, Pageable pageable);
}
