package com.example.archlibrary.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Transaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int transactionID;

    private int userID;
    private int bookID;

    private String transactionType; // "Borrow" or "Return"
    private LocalDateTime timestamp;
}
