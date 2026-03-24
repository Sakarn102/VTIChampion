package com.vti.vti_champion.service.interfaces;

import com.vti.vti_champion.dto.request.CreateQuestionRequest;
import com.vti.vti_champion.dto.request.UpdateQuestionRequest;
import com.vti.vti_champion.dto.response.QuestionResponse;
import com.vti.vti_champion.entity.Question;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface IQuestionService {
    Page<QuestionResponse> getQuestionsByTeacher(Integer teacherId, Pageable pageable);
    QuestionResponse createQuestionByTeacher(Integer teacherId, CreateQuestionRequest request);
    Question updateQuestionByTeacher(Integer questionId, Integer currentTeacherId, UpdateQuestionRequest request);
    void deleteQuestionByTeacher(Integer questionId, Integer currentTeacherId);
}
