package com.example.archlibrary.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int userID;

    private String name;
    private String email;
    private String password;
    private String role;
}
