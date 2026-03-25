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
    // Lấy danh sách học viên duy nhất (DISTINCT) thuộc các lớp của một giáo viên cụ thể
    @Query("SELECT DISTINCT cu.student FROM ClassUser cu " +
            "WHERE cu.classRoom.teacher.id = :teacherId")
    List<User> findAllStudentsByTeacherId(@Param("teacherId") Integer teacherId);
}
