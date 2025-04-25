package com.example.archlibrary.service;

import com.example.archlibrary.dto.BorrowedBookDetailsDTO;
import com.example.archlibrary.model.Book;
import com.example.archlibrary.model.BorrowedBook;
import com.example.archlibrary.repository.BookRepository;
import com.example.archlibrary.repository.BorrowedBookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class BorrowedBookService {

    @Autowired
    private BorrowedBookRepository borrowedRepo;

    @Autowired
    private BookRepository bookRepo;

    public List<BorrowedBook> getAll() {
        return borrowedRepo.findAll();
    }

    public List<BorrowedBook> getByUserId(int userId) {
        return borrowedRepo.findByUserID(userId);
    }

    public List<BorrowedBook> getActiveByUserId(int userId) {
        return borrowedRepo.findByUserIDAndReturnDateIsNull(userId);
    }

    public List<BorrowedBook> getOverdueBooks() {
        return borrowedRepo.findByReturnDateIsNullAndDueDateBefore(LocalDate.now());
    }

    public List<BorrowedBookDetailsDTO> getBorrowedBooksWithDetails(int userId) {
        List<BorrowedBook> borrowedBooks = borrowedRepo.findByUserID(userId);

        return borrowedBooks.stream().map(borrowed -> {
            Book book = bookRepo.findById(borrowed.getBookID()).orElseThrow(); // ✅ Corrected here
            return new BorrowedBookDetailsDTO(
                borrowed.getBorrowedID(),
                book.getBookID(),
                book.getTitle(),
                book.getAuthor(),
                book.getGenre(),
                borrowed.getBorrowDate().toString(),
                borrowed.getDueDate().toString(),
                borrowed.getReturnDate() != null ? borrowed.getReturnDate().toString() : null
            );
        }).collect(Collectors.toList());
    }
}
