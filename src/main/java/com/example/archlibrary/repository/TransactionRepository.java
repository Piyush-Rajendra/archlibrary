package com.example.archlibrary.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.example.archlibrary.model.Transaction;

public interface TransactionRepository extends JpaRepository<Transaction, Integer> {
}
