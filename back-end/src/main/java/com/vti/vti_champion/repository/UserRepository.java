package com.vti.vti_champion.repository;

import com.vti.vti_champion.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    Optional<User> findByFullname(String fullname);

    boolean existsByUsername(String username);

    boolean existsByEmail(String email);
}
