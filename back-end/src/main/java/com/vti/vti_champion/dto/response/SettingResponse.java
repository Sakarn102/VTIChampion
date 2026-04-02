package com.vti.vti_champion.dto.response;

import com.vti.vti_champion.entity.Setting;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class SettingResponse {
    private Integer id;
    private String name;
}
