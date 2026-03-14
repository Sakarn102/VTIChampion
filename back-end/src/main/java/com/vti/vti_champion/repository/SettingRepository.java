package com.vti.vti_champion.repository;

import com.vti.vti_champion.entity.Setting;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface SettingRepository extends JpaRepository<Setting,Integer> {
    Optional<Setting> findByName(String name);
}
