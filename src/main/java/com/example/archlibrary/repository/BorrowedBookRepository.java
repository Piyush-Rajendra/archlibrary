package com.example.archlibrary.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import com.example.archlibrary.model.BorrowedBook;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BorrowedBookRepository extends JpaRepository<BorrowedBook, Integer> {
    Optional<BorrowedBook> findByUserIDAndBookIDAndReturnDateIsNull(int userId, int bookId);
    List<BorrowedBook> findByUserID(int userId);
    List<BorrowedBook> findByUserIDAndReturnDateIsNull(int userId);
    List<BorrowedBook> findByReturnDateIsNullAndDueDateBefore(LocalDate date);
    
}
