package com.vti.vti_champion.service.Impl;

import com.vti.vti_champion.dto.response.QuestionResponse;
import com.vti.vti_champion.entity.Question;
import com.vti.vti_champion.exception.AppException;
import com.vti.vti_champion.exception.ErrorCode;
import com.vti.vti_champion.repository.QuestionRepository;
import com.vti.vti_champion.service.IQuestionService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class QuestionService implements IQuestionService {

    private final QuestionRepository questionRepository;

    private final ModelMapper modelMapper;

    @Override
    public Page<QuestionResponse> findAllQuestion(Integer instructorId, Pageable pageable) {
        questionRepository.findById(instructorId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_FOUND));

        // 1. Lấy dữ từ database
        Page<Question> questionPage = questionRepository.findByUserId(instructorId, pageable);

        // 2. Chuyển đổi sang Response DTO để trả về cho Frontend
        return questionPage.map(question -> {
            QuestionResponse response = modelMapper.map(question, QuestionResponse.class);

            // Map thủ công tên Category và tên đầy đủ Instructor
            if (question.getCategoryQuestion() != null) {
                response.setCategoryName(question.getCategoryQuestion().getName());
            }

            if (question.getUser() != null) {
                String fullName = String.format("%s %s",
                        question.getUser().getFirstName(),
                        question.getUser().getLastName());
                response.setCreatorFullName(fullName.trim());
            }
            return response;
        });
    }
}
