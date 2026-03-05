package com.vti.vti_champion.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "category_question")
public class CategoryQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, unique = true)
    private String name;
}
