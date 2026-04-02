package com.vti.vti_champion.repository;

import com.vti.vti_champion.entity.ClassUser;
import com.vti.vti_champion.entity.ClassUserId;
import com.vti.vti_champion.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ClassUserRepository extends JpaRepository<ClassUser, ClassUserId> {
    // Lấy danh sách học viên duy nhất (DISTINCT) thuộc các lớp của một giáo viên cụ
    // thể
    @Query("SELECT DISTINCT cu.student FROM ClassUser cu " +
            "WHERE cu.classRoom.teacher.id = :teacherId")
    List<User> findAllStudentsByTeacherId(@Param("teacherId") Integer teacherId);

    // Đếm số học viên trong 1 lớp từ bảng class_user
    long countByClassRoom(com.vti.vti_champion.entity.Class classRoom);

    @Query("SELECT cu.student FROM ClassUser cu WHERE cu.classRoom.id = :classId")
    List<User> findStudentsByClassId(@Param("classId") Integer classId);

    @org.springframework.transaction.annotation.Transactional
    @org.springframework.data.jpa.repository.Modifying
    @Query("DELETE FROM ClassUser cu WHERE cu.classRoom.id = :classId AND cu.student.id = :studentId")
    void deleteByClassIdAndStudentId(@Param("classId") Integer classId, @Param("studentId") Integer studentId);
}
