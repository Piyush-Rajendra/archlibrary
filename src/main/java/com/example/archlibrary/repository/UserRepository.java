package com.example.archlibrary.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import com.example.archlibrary.dto.UserSummaryDTO;
import com.example.archlibrary.model.User;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findByEmail(String email);

        @Query("SELECT new com.example.archlibrary.dto.UserSummaryDTO(u.name, u.email, u.role) FROM User u")
    List<UserSummaryDTO> findAllUsersWithSummary();

    @Query("SELECT new com.example.archlibrary.dto.UserSummaryDTO(u.name, u.email, u.role) FROM User u WHERE LOWER(u.name) LIKE LOWER(CONCAT('%', :name, '%'))")
    List<UserSummaryDTO> searchUsersByName(String name);
}
