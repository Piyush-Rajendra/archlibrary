package com.example.archlibrary.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class BorrowedBookDetailsDTO {
    private int borrowedID;
    private int bookID;
    private String title;
    private String author;
    private String genre;
    private String borrowDate;
    private String dueDate;
    private String returnDate; // Nullable
}
