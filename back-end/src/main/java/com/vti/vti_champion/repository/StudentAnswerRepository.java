package com.vti.vti_champion.repository;

import com.vti.vti_champion.entity.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Integer> {

    Optional<StudentAnswer> findByExamResultIdAndQuestionId(Integer examResultId, Integer questionId);
    List<StudentAnswer> findByExamResultId(Integer examResultId);
}
