package com.vti.vti_champion.entity;

import jakarta.persistence.*;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "`user`")
@Data
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer id;

    @Column(name = "email", length = 100, unique = true, nullable = false)
    private String email;

    @Column(name = "username", length = 50, unique = true, nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "fullname", length = 50, nullable = false)
    private String fullname;

    @Column(name = "avatar_url", columnDefinition = "TEXT")
    private String avatarUrl;

    @Column(name = "is_active")
    private Boolean isActive = true;

    @Column(name = "create_date", updatable = false)
    @CreationTimestamp // lấy thời gian hiện tại
    private LocalDateTime createDate;

    @ManyToOne()
    @JoinColumn(name = "role_id", nullable = false)
    private Setting role;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Setting department;

    @Column(name = "enabled", nullable = false)
    private boolean enabled = false; //

}
