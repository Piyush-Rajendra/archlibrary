package com.example.archlibrary.service;

import com.example.archlibrary.dto.LoginRequest;
import com.example.archlibrary.model.User;
import com.example.archlibrary.jwt.JwtUtil;
import com.example.archlibrary.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired 
    private LoginAttemptService attemptService;

    public User register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public String login(LoginRequest request) {
        String email = request.getEmail().toLowerCase(); // Normalize for consistent key
    
        if (attemptService.isBlocked(email)) {
            return "Account temporarily locked due to too many failed login attempts.";
        }
    
        Optional<User> userOpt = userRepository.findByEmail(email);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (encoder.matches(request.getPassword(), user.getPassword())) {
                attemptService.loginSucceeded(email); 
                return jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getId());
            }
        }
    
        attemptService.loginFailed(email); 
        int remaining = attemptService.getRemainingAttempts(email);
        return "Invalid credentials. Remaining attempts: " + remaining;
    }
    
    
}