package com.nexushr.nexushr.entity;

import jakarta.persistence.*;
import com.nexushr.nexushr.enums.UserRole;
//import lombok.AllArgsConstructor;
//import lombok.Data;
//import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;
    private String password;
    
    @Enumerated(EnumType.STRING)
    private UserRole role;

    // Getters and Setters — REQUIRED for Jackson
    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public UserRole getRole() {
        return role;
    }

    public void setRole(UserRole role) {
        this.role = role;
    }
}
    // @Data from Lombok automatically generates:
    // - All getters (getUsername, getPassword, getRole, getId)
    // - All setters (setUsername, setPassword, setRole, setId)
    // - equals(), hashCode(), toString()
    // - No need for manual implementations!
