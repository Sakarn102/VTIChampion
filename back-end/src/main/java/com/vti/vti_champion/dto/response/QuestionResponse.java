package com.vti.vti_champion.dto.response;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class QuestionResponse {
    private Integer id;
    private String content;
    private String difficultyLevel;
    private String categoryName;
    private String creatorFullName; // Kết hợp firstName + lastName

    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createDate;

    private List<AnswerResponse> answers;
}
