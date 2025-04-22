package com.example.archlibrary.service;

import com.example.archlibrary.model.BorrowFineTransaction;
import com.example.archlibrary.repository.BorrowFineTransactionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BorrowFineTransactionService {

    @Autowired
    private BorrowFineTransactionRepository bftRepo;

    public BorrowFineTransaction createLink(BorrowFineTransaction link) {
        return bftRepo.save(link);
    }

    public List<BorrowFineTransaction> getAllLinks() {
        return bftRepo.findAll();
    }

    public BorrowFineTransaction getById(int id) {
        return bftRepo.findById(id).orElseThrow();
    }
}
