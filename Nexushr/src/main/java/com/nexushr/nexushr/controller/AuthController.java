package com.nexushr.nexushr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import com.nexushr.nexushr.dto.LoginResponse;
import com.nexushr.nexushr.entity.User;
import com.nexushr.nexushr.repository.UserRepository;
import com.nexushr.nexushr.security.JwtUtil;

import io.swagger.v3.oas.annotations.tags.Tag;

@Tag(
        name = "Authentication",
        description = "Authentication APIs"
)
@RestController
@RequestMapping("/auth")
public class AuthController {

    @Autowired
    private UserRepository repo;

    @Autowired
    private BCryptPasswordEncoder encoder;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody User user) {

        User dbUser = repo.findByUsername(user.getUsername())
                .orElseThrow(() ->
                        new com.nexushr.nexushr.exception.ResourceNotFoundException("User not found"));

        if (!encoder.matches(user.getPassword(), dbUser.getPassword())) {
            throw new com.nexushr.nexushr.exception.BadRequestException("Invalid password");
        }

        String token = jwtUtil.generateToken(
                dbUser.getUsername(),
                dbUser.getRole());

        LoginResponse response = new LoginResponse(
                token,
                dbUser.getUsername(),
                dbUser.getRole().name(),
                "Login Successful");

        return new ResponseEntity<>(response, HttpStatus.OK);
    }
}