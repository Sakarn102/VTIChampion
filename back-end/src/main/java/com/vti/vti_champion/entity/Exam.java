package com.vti.vti_champion.entity;

import com.vti.vti_champion.constant.Type;
import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "exam")
@Data
public class Exam {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exam_id")
    private Integer id;

    @Column(name = "code", length = 20, unique = true, nullable = false)
    private String code;

    @Column(name = "title", length = 200, nullable = false)
    private String title;

    @Column(name = "duration", nullable = false)
    private Integer duration;

    @CreationTimestamp
    @Column(name = "create_date", updatable = false)
    private LocalDateTime createDate;

    @Column(name = "type", nullable = false)
    @Enumerated(EnumType.STRING)
    private Type type;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "teacher_id")
    private User teacher;

    @ManyToOne
    @JoinColumn(name = "class_id")
    private Class classRoom;

    @OneToMany(mappedBy = "exam", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Question> questions; // Cascade ALL ở đây để khi xóa Question thì mới mất Answer
}
