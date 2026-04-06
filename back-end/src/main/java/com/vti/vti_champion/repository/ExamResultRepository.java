package com.vti.vti_champion.repository;

import com.vti.vti_champion.entity.ExamResult;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExamResultRepository extends JpaRepository<ExamResult, Integer> {

    // Lấy lịch sử chỉ bài đã hoàn thành (loại trừ IN_PROGRESS)
    @Query("select er from ExamResult er join fetch er.exam where er.student.id = :userId and er.status <> 'IN_PROGRESS' order by er.startTime desc")
    List<ExamResult> findByUserId(@Param("userId") Integer userId);

    // Tìm bài đang làm dở dang của học sinh với đề thi cụ thể
    @Query("select er from ExamResult er where er.student.id = :userId and er.exam.id = :examId and er.status = 'IN_PROGRESS'")
    Optional<ExamResult> findInProgressByUserIdAndExamId(@Param("userId") Integer userId, @Param("examId") Integer examId);

    // 1. Lọc theo học viên (User)
    List<ExamResult> findByStudent_Id(Integer userId);

    // 2. Lọc theo đề thi (Exam)
    List<ExamResult> findByExam_Id(Integer examId);

    // 3. Lấy danh sách điểm theo lop
    @Query("SELECT r FROM ExamResult r WHERE r.exam.classRoom.id = :classId")
    List<ExamResult> findResultsByClassId(@Param("classId") Integer classId);

    // 4. Đếm số lần thi đã hoàn thành (không tính IN_PROGRESS)
    @Query("SELECT COUNT(er) FROM ExamResult er WHERE er.student.id = :studentId AND er.exam.id = :examId AND er.status <> 'IN_PROGRESS'")
    long countCompletedAttempts(@Param("studentId") Integer studentId, @Param("examId") Integer examId);
}
