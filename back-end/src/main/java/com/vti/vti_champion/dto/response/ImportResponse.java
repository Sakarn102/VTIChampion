package com.vti.vti_champion.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ImportResponse {
    private int total;
    private int success;
    private int failed;
    private List<String> errors;
}
