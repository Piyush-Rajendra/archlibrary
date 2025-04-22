package com.example.archlibrary.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BorrowedBook {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int borrowedID;

    private int userID;
    private int bookID;

    private LocalDate borrowDate;   
    private LocalDate dueDate;      
    private LocalDate returnDate;  
}
