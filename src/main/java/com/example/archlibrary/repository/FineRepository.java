package com.example.archlibrary.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.archlibrary.model.Fine;

public interface FineRepository extends JpaRepository<Fine, Integer> {
    List<Fine> findByUserID(int userId);
    List<Fine> findByUserIDAndStatus(int userId, String status); // "Unpaid", "Paid"
    List<Fine> findByStatus(String status);
    

}
