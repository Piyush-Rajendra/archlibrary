package com.example.archlibrary.service;

import org.springframework.stereotype.Service;

import java.util.concurrent.ConcurrentHashMap;

@Service
public class LoginAttemptService {

    private final int MAX_ATTEMPTS = 5;
    private final ConcurrentHashMap<String, Integer> attemptsCache = new ConcurrentHashMap<>();

    public void loginFailed(String email) {
        email = email.toLowerCase(); 
        int attempts = attemptsCache.getOrDefault(email, 0);
        attempts++;
        attemptsCache.put(email, attempts);
        System.out.println("Failed login for: " + email + " | Attempts: " + attempts);
    }
    

    public void loginSucceeded(String email) {
        attemptsCache.remove(email);
    }

    public boolean isBlocked(String email) {
        return attemptsCache.getOrDefault(email, 0) >= MAX_ATTEMPTS;
    }

    public int getRemainingAttempts(String email) {
        return MAX_ATTEMPTS - attemptsCache.getOrDefault(email, 0);
    }
}
