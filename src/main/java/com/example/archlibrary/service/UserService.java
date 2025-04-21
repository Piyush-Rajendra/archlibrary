package com.example.archlibrary.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.archlibrary.model.User;
import com.example.archlibrary.repository.UserRepository;

@Service
public class UserService {

    @Autowired private UserRepository userRepo;

    public User updateUser(int id, User updatedUser) {
        User user = userRepo.findById(id).orElseThrow();
        user.setName(updatedUser.getName());
        user.setEmail(updatedUser.getEmail());
        user.setRole(updatedUser.getRole());
        return userRepo.save(user);
    }

    public void deleteUser(int id) {
        userRepo.deleteById(id);
    }
}