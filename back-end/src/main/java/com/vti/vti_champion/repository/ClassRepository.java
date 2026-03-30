package com.vti.vti_champion.repository;

import com.vti.vti_champion.entity.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.stereotype.Repository;

@Repository
public interface ClassRepository extends JpaRepository<Class,Integer>, JpaSpecificationExecutor<Class> {
}
