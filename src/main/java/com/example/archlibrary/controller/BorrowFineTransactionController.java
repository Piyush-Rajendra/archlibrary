package com.example.archlibrary.controller;

import com.example.archlibrary.model.BorrowFineTransaction;
import com.example.archlibrary.service.BorrowFineTransactionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bft")
public class BorrowFineTransactionController {

    @Autowired
    private BorrowFineTransactionService bftService;

    @PostMapping
    public ResponseEntity<BorrowFineTransaction> createLink(@RequestBody BorrowFineTransaction link) {
        return ResponseEntity.ok(bftService.createLink(link));
    }

    @GetMapping
    public List<BorrowFineTransaction> getAll() {
        return bftService.getAllLinks();
    }

    @GetMapping("/{id}")
    public ResponseEntity<BorrowFineTransaction> getById(@PathVariable int id) {
        return ResponseEntity.ok(bftService.getById(id));
    }
}
