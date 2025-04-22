package com.example.archlibrary.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.example.archlibrary.service.LibraryService;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

    @Autowired private LibraryService libraryService;

    @PostMapping("/return")
    public ResponseEntity<String> returnBook(@RequestParam int userId, @RequestParam int bookId) {
        return ResponseEntity.ok(libraryService.returnBook(userId, bookId));
    }

    @PostMapping("/borrow")
    public ResponseEntity<String> borrowBook(@RequestParam int userId, @RequestParam int bookId) {
        return ResponseEntity.ok(libraryService.borrowBook(userId, bookId));
    }
}

