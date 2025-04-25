package com.example.archlibrary.model;

import jakarta.persistence.*;
import lombok.*;


@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Book {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int bookID;

    private String title;
    private String author;
    private String isbn;
    private String genre;
    @Column(name = "total_copies", nullable = false)
    private Integer totalCopies = 0;
    @Column(name = "available_copies", nullable = false)
    private Integer availableCopies = 0;
}