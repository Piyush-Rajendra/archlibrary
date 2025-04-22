package com.example.archlibrary.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

import org.springframework.beans.factory.annotation.Autowired;
import com.example.archlibrary.model.Transaction;
import com.example.archlibrary.repository.TransactionRepository;
import org.springframework.stereotype.Service;

import com.example.archlibrary.model.Book;
import com.example.archlibrary.model.BorrowedBook;
import com.example.archlibrary.model.Fine;
import com.example.archlibrary.repository.BookRepository;
import com.example.archlibrary.repository.BorrowedBookRepository;
import com.example.archlibrary.repository.FineRepository;
@Service
public class LibraryService {

    @Autowired private BookRepository bookRepo;
    @Autowired private BorrowedBookRepository borrowedRepo;
    @Autowired private TransactionRepository transactionRepo;
    @Autowired private FineRepository fineRepo;

    public String returnBook(int userId, int bookId) {
        BorrowedBook borrowed = borrowedRepo
            .findByUserIDAndBookIDAndReturnDateIsNull(userId, bookId)
            .orElseThrow(() -> new RuntimeException("No active borrow found"));

        borrowed.setReturnDate(LocalDate.now());
        borrowedRepo.save(borrowed);

        Book book = bookRepo.findById(bookId).orElseThrow();
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepo.save(book);

        if (borrowed.getDueDate().isBefore(LocalDate.now())) {
            long daysLate = ChronoUnit.DAYS.between(borrowed.getDueDate(), LocalDate.now());
            double fineAmount = daysLate * 2.0;

            Fine fine = new Fine();
            fine.setUserID(userId);
            fine.setAmount(fineAmount);
            fine.setStatus("Unpaid");
            fine.setReason("Overdue by " + daysLate + " days");
            fineRepo.save(fine);
        }

        Transaction txn = new Transaction();
        txn.setUserID(userId);
        txn.setBookID(bookId);
        txn.setTransactionType("Return");
        txn.setTimestamp(LocalDateTime.now());
        transactionRepo.save(txn);

        return "Book returned successfully.";
    }

    public String borrowBook(int userId, int bookId) {
        Book book = bookRepo.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found"));
    
        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No available copies.");
        }
    
        // 1. Decrease availability
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepo.save(book);
    
        // 2. Create borrow entry
        BorrowedBook borrowed = new BorrowedBook();
        borrowed.setUserID(userId);
        borrowed.setBookID(bookId);
        borrowed.setBorrowDate(LocalDate.now());
        borrowed.setDueDate(LocalDate.now().plusWeeks(2));
        borrowedRepo.save(borrowed);
    
        // 3. Log transaction
        Transaction txn = new Transaction();
        txn.setUserID(userId);
        txn.setBookID(bookId);
        txn.setTransactionType("Borrow");
        txn.setTimestamp(LocalDateTime.now());
        transactionRepo.save(txn);
    
        return "Book borrowed successfully.";
    }
}
