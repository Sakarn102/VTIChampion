package com.vti.vti_champion.repository;

import com.vti.vti_champion.entity.Answer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AnswerRepository extends JpaRepository<Answer,Integer> {
    void deleteByQuestionId(Integer questionId);
}
