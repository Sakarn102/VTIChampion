package com.vti.vti_champion.repository;

import com.vti.vti_champion.entity.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Integer> {

    @Query("select er from ExamResult er join fetch er.exam where er.student.id = :userId order by  er.startTime desc ")
    List<ExamResult> findByUserId(@Param(("userId")) Integer userId);

    // 1. Lọc theo học viên (User)
    List<ExamResult> findByStudent_Id(Integer userId);

    // 2. Lọc theo đề thi (Exam)
    List<ExamResult> findByExam_Id(Integer examId);

    // 3. Lấy danh sách điểm theo lop
    @Query("SELECT r FROM ExamResult r WHERE r.exam.classRoom.id = :classId")
    List<ExamResult> findResultsByClassId(@Param("classId") Integer classId);
}
