package com.vti.vti_champion.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class CreateClassRequest {
    @NotBlank(message = "Tên lớp không được để trống")
    private String name;

    private String thumbnailUrl;

    @NotNull(message = "Phòng ban không được để trống")
    private Integer departmentId;

    @NotNull(message = "Giảng viên không được để trống")
    private Integer teacherId;
}
