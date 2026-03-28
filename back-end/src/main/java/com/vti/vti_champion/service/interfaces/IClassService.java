package com.vti.vti_champion.service.interfaces;

import com.vti.vti_champion.dto.response.ClassResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;

public interface IClassService {
    Page<ClassResponse> getAllClasses(Pageable pageable);
}
