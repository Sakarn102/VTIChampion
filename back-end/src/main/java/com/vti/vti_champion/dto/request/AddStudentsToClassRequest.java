package com.vti.vti_champion.dto.request;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.util.List;

@Data
public class AddStudentsToClassRequest {
    @NotNull(message = "ID lớp không được để trống")
    private Integer classId;

    @NotEmpty(message = "Danh sách ID học sinh không được để trống")
    private List<Integer> studentIds;
}
