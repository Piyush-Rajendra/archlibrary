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

    public User register(User user) {
        user.setPassword(encoder.encode(user.getPassword()));
        return userRepository.save(user);
    }

    public String login(LoginRequest request) {
        Optional<User> optionalUser = userRepository.findByEmail(request.getEmail());
        if (optionalUser.isPresent()) {
            User user = optionalUser.get();
            if (encoder.matches(request.getPassword(), user.getPassword())) {
                return jwtUtil.generateToken(user.getEmail());
            }
        }
        return null; 
    }
    
}