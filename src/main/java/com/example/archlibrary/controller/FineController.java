package com.example.archlibrary.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.archlibrary.model.Fine;
import com.example.archlibrary.service.FineService;

@RestController
@RequestMapping("/api/fines")
public class FineController {

    @Autowired private FineService fineService;

    @GetMapping("/user/{userId}")
    public List<Fine> getFines(@PathVariable int userId) {
        return fineService.getAllFinesForUser(userId);
    }

    @GetMapping("/user/{userId}/unpaid")
    public List<Fine> getUnpaidFines(@PathVariable int userId) {
        return fineService.getUnpaidFinesForUser(userId);
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @PutMapping("/{fineId}/pay")
    public ResponseEntity<String> payFine(@PathVariable int fineId) {
        return ResponseEntity.ok(fineService.payFine(fineId));
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @GetMapping
    public List<Fine> getAllFines() {
        return fineService.getAllFines();
    }

    @PreAuthorize("hasRole('LIBRARIAN')")
    @GetMapping("/unpaid")
    public List<Fine> getAllUnpaidFines() {
        return fineService.getAllUnpaidFines();
    }

}

