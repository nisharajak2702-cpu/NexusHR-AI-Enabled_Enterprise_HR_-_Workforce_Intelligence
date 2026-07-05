package com.nexushr.nexushr.security;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.*;

import org.springframework.stereotype.Service;

import com.nexushr.nexushr.entity.User;
import com.nexushr.nexushr.repository.UserRepository;

@Service
public class CustomUserDetailsService
        implements UserDetailsService {

    @Autowired
    private UserRepository repository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        User user =
                repository.findByUsername(username)
                        .orElseThrow(() ->
                                new UsernameNotFoundException(
                                        "User not found"));

        return new CustomUserDetails(user);

    }

}