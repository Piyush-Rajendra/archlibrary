package com.example.archlibrary.repository;

import com.example.archlibrary.model.BorrowFineTransaction;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BorrowFineTransactionRepository extends JpaRepository<BorrowFineTransaction, Integer> {
}
