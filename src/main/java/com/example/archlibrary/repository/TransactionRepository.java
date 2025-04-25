package com.example.archlibrary.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.archlibrary.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
    // Find the most recent transaction for a given user and book
    Optional<Transaction> findTopByUserIDAndBookIDAndTransactionTypeOrderByTimestampDesc(int userID, int bookID, String transactionType);

    // Get all transactions of type "Borrow"
    List<Transaction> findByUserIDAndBookIDAndTransactionType(int userID, int bookID, String transactionType);
}
