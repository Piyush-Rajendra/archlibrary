package com.example.archlibrary.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data // ✅ Lombok will generate getters/setters automatically
@NoArgsConstructor
@AllArgsConstructor
public class Fine {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int fineID;

    private int userID;

    private double amount;

    private String reason;

    private String status;
}
