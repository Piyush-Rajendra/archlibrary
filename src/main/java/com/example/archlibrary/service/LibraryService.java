package com.example.archlibrary.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.archlibrary.model.Book;
import com.example.archlibrary.model.BorrowedBook;
import com.example.archlibrary.model.Fine;
import com.example.archlibrary.model.Transaction;
import com.example.archlibrary.repository.BookRepository;
import com.example.archlibrary.repository.BorrowedBookRepository;
import com.example.archlibrary.repository.FineRepository;
import com.example.archlibrary.repository.TransactionRepository;

@Service
public class LibraryService {

    @Autowired private BookRepository bookRepo;
    @Autowired private BorrowedBookRepository borrowedRepo;
    @Autowired private FineRepository fineRepo;
    @Autowired private TransactionRepository transactionRepo;

    /**
     * Handles the process of returning a book.
     */
    public String returnBook(int userId, int bookId) {
        // Fetch active borrowed book
        BorrowedBook borrowed = borrowedRepo.findByUserIDAndBookIDAndReturnDateIsNull(userId, bookId)
            .orElseThrow(() -> new RuntimeException("No active borrow found for this book."));

        // Set return date
        borrowed.setReturnDate(LocalDate.now());
        borrowedRepo.save(borrowed);

        // Increment available copies
        Book book = bookRepo.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found."));
        book.setAvailableCopies(book.getAvailableCopies() + 1);
        bookRepo.save(book);

        // Check overdue and apply fine if needed
        if (borrowed.getDueDate().isBefore(LocalDate.now())) {
            long daysLate = ChronoUnit.DAYS.between(borrowed.getDueDate(), LocalDate.now());
            double fineAmount = daysLate * 2.0; // $2 per day fine

            Fine fine = new Fine();
            fine.setUserID(userId);
            fine.setAmount(fineAmount);
            fine.setStatus("Unpaid");
            fine.setReason("Overdue by " + daysLate + " days");
            fineRepo.save(fine);
        }

        // Log Return Transaction
        Transaction txn = new Transaction();
        txn.setUserID(userId);
        txn.setBookID(bookId);
        txn.setTransactionType("Return");
        txn.setTimestamp(LocalDateTime.now());
        transactionRepo.save(txn);

        return "Book returned successfully.";
    }

    /**
     * Handles the process of borrowing a book.
     */
    public String borrowBook(int userId, int bookId) {
        // Check if user has an active unreturned borrow
        if (hasUnreturnedBorrow(userId, bookId)) {
            throw new IllegalStateException("You have already borrowed this book and haven't returned it yet.");
        }

        // Fetch book
        Book book = bookRepo.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found."));

        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No available copies available for borrowing.");
        }

        // Decrease available copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepo.save(book);

        // Create new borrow record
        BorrowedBook borrowed = new BorrowedBook();
        borrowed.setUserID(userId);
        borrowed.setBookID(bookId);
        borrowed.setBorrowDate(LocalDate.now());
        borrowed.setDueDate(LocalDate.now().plusWeeks(2)); // 2-week borrow
        borrowedRepo.save(borrowed);

        // Log Borrow Transaction
        Transaction txn = new Transaction();
        txn.setUserID(userId);
        txn.setBookID(bookId);
        txn.setTransactionType("Borrow");
        txn.setTimestamp(LocalDateTime.now());
        transactionRepo.save(txn);

        return "Book borrowed successfully.";
    }

    /**
     * Check if user already has an unreturned borrow for the given book.
     */
    private boolean hasUnreturnedBorrow(int userId, int bookId) {
        Optional<BorrowedBook> borrowed = borrowedRepo.findByUserIDAndBookIDAndReturnDateIsNull(userId, bookId);
        return borrowed.isPresent();
    }
}
