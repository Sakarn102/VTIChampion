package com.vti.vti_champion.repository;

import com.vti.vti_champion.dto.response.QuestionResponse;
import com.vti.vti_champion.entity.Question;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository extends JpaRepository<Question,Integer> {
    List<Question> findByExamId(Integer examId);
}
