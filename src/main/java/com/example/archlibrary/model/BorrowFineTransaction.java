package com.example.archlibrary.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Data
@NoArgsConstructor
@Table(name = "BorrowFineTransaction") 
@AllArgsConstructor
public class BorrowFineTransaction {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;

    private int borrowId;
    private int fineId;
    private int transactionId;
}
