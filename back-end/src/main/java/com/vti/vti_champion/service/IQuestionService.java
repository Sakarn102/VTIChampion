package com.vti.vti_champion.service;

import com.vti.vti_champion.dto.response.QuestionResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IQuestionService {
    Page<QuestionResponse> findAllQuestion(Integer instructorId, Pageable pageable);
}
