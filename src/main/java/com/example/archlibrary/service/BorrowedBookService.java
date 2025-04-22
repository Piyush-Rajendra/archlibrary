package com.example.archlibrary.service;

import com.example.archlibrary.model.BorrowedBook;
import com.example.archlibrary.repository.BorrowedBookRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class BorrowedBookService {

    @Autowired
    private BorrowedBookRepository borrowedRepo;

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
}
