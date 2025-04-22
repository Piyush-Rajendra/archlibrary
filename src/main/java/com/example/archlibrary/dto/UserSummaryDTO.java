package com.example.archlibrary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserSummaryDTO {
    private String name;
    private String email;
    private String role;
}
