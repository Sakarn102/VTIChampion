package com.vti.vti_champion.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class CreateExamRequest {

    @NotNull(message = "Code cannot be null!")
    private String code;

    @NotBlank(message = "Title cannot be null!") //@NotBlank chỉ dùng cho String
    @Size(max = 200)
    private String title;

    @NotNull(message = "Duration cannot be null!")
    @Min(value = 1, message = "Minimal time is one one minute!")
    @Max(value = 500, message = "Minimal duration is to long!")
    private Integer duration;

    @NotNull(message = "Class ID (class_id) cannot be null!")
    private Integer classId;

    @NotNull(message = "ID ngươì tạo (creator_id) cannot be null!")
    private Integer creatorId;

    @NotEmpty(message = "Vui lòng chọn ít nhất 1 câu hỏi trong ngân hàng đề thi") // Xác thực dữ liệu đầu vào
    private List<Integer> questionIds;
}
