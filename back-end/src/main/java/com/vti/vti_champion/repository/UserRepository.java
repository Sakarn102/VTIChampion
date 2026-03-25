package com.vti.vti_champion.repository;

import com.vti.vti_champion.dto.response.UserResponse;
import com.vti.vti_champion.entity.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByUsernameOrEmail(String username, String email);
    Optional<User> findByEmail(String email);
    Optional<User> findByUsername(String username);
    Optional<User> findByFullname(String fullname);
    Page<User> findAll(Pageable pageable);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);

}
