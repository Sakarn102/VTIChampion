package com.vti.vti_champion.dto.request;

import jakarta.validation.constraints.*;
import lombok.Data;

import java.util.List;

@Data
public class UpdateExamRequest {
    @NotNull(message = "Code không được để trống")
    private String code;

    @NotBlank(message = "Title không được để trống") //@NotBlank chỉ dùng cho String
    @Size(max = 200)
    private String title;

    @NotNull(message = "Duration không được để trống")
    @Min(value = 1, message = "Thời gian tối thiểu là 1 phút")
    @Max(value = 500, message = "Thời gian quá dài")
    private Integer duration;

    @NotNull(message = "ID lớp học (class_id) không được để trống")
    private Integer classId;

    @NotEmpty(message = "Vui lòng chọn ít nhất 1 câu hỏi trong ngân hàng đề thi")
    private List<Integer> questionIds;
}
