package com.example.archlibrary.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

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
    @Autowired private TransactionRepository transactionRepo;
    @Autowired private FineRepository fineRepo;

    /**
     * Handles the process of returning a book.
     * Updates return date, available copies, calculates fines, and logs the transaction.
     * 
     * @param userId 
     * @param bookId
     * @return 
     */
    public String returnBook(int userId, int bookId) {
        // Fetch the borrowed book record
        BorrowedBook borrowed = borrowedRepo
            .findByUserIDAndBookIDAndReturnDateIsNull(userId, bookId)
            .orElseThrow(() -> new RuntimeException("No active borrow found"));

        // Set the return date for the book
        borrowed.setReturnDate(LocalDate.now());
        borrowedRepo.save(borrowed);

        // Fetch the book and increment available copies
        Book book = bookRepo.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found"));
        book.setAvailableCopies(book.getAvailableCopies() + 1);  // Increment available copies
        bookRepo.save(book);

        // If overdue, calculate and apply fine
        if (borrowed.getDueDate().isBefore(LocalDate.now())) {
            long daysLate = ChronoUnit.DAYS.between(borrowed.getDueDate(), LocalDate.now());
            double fineAmount = daysLate * 2.0;  // Fine rate: $2 per day overdue

            Fine fine = new Fine();
            fine.setUserID(userId);
            fine.setAmount(fineAmount);
            fine.setStatus("Unpaid");
            fine.setReason("Overdue by " + daysLate + " days");
            fineRepo.save(fine);
        }

        // Log the return transaction
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
     * Checks book availability, decreases available copies, and logs the transaction.
     * 
     * @param userId The ID of the user borrowing the book.
     * @param bookId The ID of the book being borrowed.
     * @return A success or failure message.
     */
    public String borrowBook(int userId, int bookId) {
        // Check if the user has already borrowed the book and hasn't returned it
        if (hasUnreturnedBorrow(userId, bookId)) {
            throw new IllegalStateException("You have already borrowed this book and haven't returned it yet.");
        }

        // Fetch the book and check if there are available copies
        Book book = bookRepo.findById(bookId)
            .orElseThrow(() -> new RuntimeException("Book not found"));
    
        if (book.getAvailableCopies() <= 0) {
            throw new IllegalStateException("No available copies for this book.");
        }

        // Decrease available copies
        book.setAvailableCopies(book.getAvailableCopies() - 1);
        bookRepo.save(book);
    
        // Create a borrowed book record
        BorrowedBook borrowed = new BorrowedBook();
        borrowed.setUserID(userId);
        borrowed.setBookID(bookId);
        borrowed.setBorrowDate(LocalDate.now());
        borrowed.setDueDate(LocalDate.now().plusWeeks(2));  // 2-week borrowing period
        borrowedRepo.save(borrowed);
    
        // Log the borrow transaction
        Transaction txn = new Transaction();
        txn.setUserID(userId);
        txn.setBookID(bookId);
        txn.setTransactionType("Borrow");
        txn.setTimestamp(LocalDateTime.now());
        transactionRepo.save(txn);
    
        return "Book borrowed successfully.";
    }

    /**
     * Helper method to check if the user has already borrowed the book and not returned it.
     *
     * @param userId The user ID.
     * @param bookId The book ID.
     * @return True if the user has borrowed the book and hasn't returned it yet.
     */
    private boolean hasUnreturnedBorrow(int userId, int bookId) {
        // Check if there is a borrow transaction without a corresponding return
        Transaction txn = transactionRepo.findTopByUserIDAndBookIDAndTransactionTypeOrderByTimestampDesc(userId, bookId, "Borrow")
            .orElse(null);

        return txn != null && txn.getReturnDate() == null;
    }
}
