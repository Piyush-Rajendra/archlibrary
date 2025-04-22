package com.example.archlibrary.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.archlibrary.model.Fine;
import com.example.archlibrary.repository.FineRepository;

@Service
public class FineService {

    @Autowired private FineRepository fineRepo;

    public List<Fine> getAllFinesForUser(int userId) {
        return fineRepo.findByUserID(userId);
    }

    public List<Fine> getUnpaidFinesForUser(int userId) {
        return fineRepo.findByUserIDAndStatus(userId, "Unpaid");
    }

    public String payFine(int fineId) {
        Fine fine = fineRepo.findById(fineId).orElseThrow();
        fine.setStatus("Paid");
        fineRepo.save(fine);
        return "Fine marked as paid.";
    }
}

