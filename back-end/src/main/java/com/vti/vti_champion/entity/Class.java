package com.vti.vti_champion.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CurrentTimestamp;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "class")
@Data
public class Class {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "class_id")
    private Integer id;

    @Column(name = "name", length = 100, nullable = false)
    private String name;

    @CurrentTimestamp
    @Column(name = "create_date", updatable = false)
    private LocalDateTime createDate;

    @Column(name = "thumbnail_url", columnDefinition = "TEXT")
    private String thumbnailUrl;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @ManyToOne
    @JoinColumn(name = "department_id")
    private Setting department;

    @ManyToOne
    @JoinColumn(name = "teacher_id") // Giảng viên chủ nhiệm/người tạo lớp
    @JsonIgnore
    private User teacher;

    // Quan hệ với Exam: Một lớp có nhiều bài thi
    @OneToMany(mappedBy = "classRoom")
    @JsonIgnore
    private List<Exam> exams;

    @ManyToMany
    @JoinTable(
            name = "class_user",
            joinColumns = @JoinColumn(name = "class_id"),
            inverseJoinColumns = @JoinColumn(name = "student_id")
    )
    private List<User> students;
}
