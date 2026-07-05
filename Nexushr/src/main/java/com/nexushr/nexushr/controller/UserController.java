package com.nexushr.nexushr.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.nexushr.nexushr.entity.User;
import com.nexushr.nexushr.repository.UserRepository;

@RestController
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserRepository repo;
    
    @Autowired
    private org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder encoder;


    @PostMapping
    public User addUser(@RequestBody User user) {
        user.setPassword(encoder.encode(user.getPassword())); // 🔥 encrypt password
        return repo.save(user);
    }

    @GetMapping
    public java.util.List<User> getAll() {
        return repo.findAll();
    }
}