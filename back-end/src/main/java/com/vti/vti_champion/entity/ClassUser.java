package com.vti.vti_champion.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "class_user")
@Data
@IdClass(ClassUserId.class)
public class ClassUser {
    @Id
    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @Id
    @ManyToOne
    @JoinColumn(name = "class_id")
    private Class classRoom;
}
