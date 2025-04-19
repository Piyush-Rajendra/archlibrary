package com.example.archlibrary.dto;

import lombok.*;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    private String email;
    private String password;
}