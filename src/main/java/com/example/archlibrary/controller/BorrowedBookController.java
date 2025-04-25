package com.example.archlibrary.controller;

import com.example.archlibrary.dto.BorrowedBookDetailsDTO;
import com.example.archlibrary.model.BorrowedBook;
import com.example.archlibrary.service.BorrowedBookService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/borrowed")
public class BorrowedBookController {

    @Autowired
    private BorrowedBookService borrowedBookService;

    @GetMapping
    public List<BorrowedBook> getAll() {
        return borrowedBookService.getAll();
    }

    @GetMapping("/user/{userId}")
    public List<BorrowedBook> getByUser(@PathVariable int userId) {
        return borrowedBookService.getByUserId(userId);
    }

    @GetMapping("/user/{userId}/active")
    public List<BorrowedBook> getActiveByUser(@PathVariable int userId) {
        return borrowedBookService.getActiveByUserId(userId);
    }

    @GetMapping("/overdue")
    public List<BorrowedBook> getOverdueBooks() {
        return borrowedBookService.getOverdueBooks();
    }

    @GetMapping("/user/{userId}/details")
    public List<BorrowedBookDetailsDTO> getBorrowedBooksWithDetails(@PathVariable int userId) {
        return borrowedBookService.getBorrowedBooksWithDetails(userId);
    }
}
