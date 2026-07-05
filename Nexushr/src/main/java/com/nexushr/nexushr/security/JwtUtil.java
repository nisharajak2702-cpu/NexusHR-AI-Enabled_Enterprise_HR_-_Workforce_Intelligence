package com.nexushr.nexushr.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.nexushr.nexushr.enums.UserRole;

import java.security.Key;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${app.jwt.secret}")
    private String secret;

    @Value("${app.jwt.expiration:86400000}")
    private long expiration;

    /**
     * Generate signing key
     */
    private Key getKey() {
        return Keys.hmacShaKeyFor(secret.getBytes());
    }

    /**
     * Generate JWT with Username + Role
     */
    public String generateToken(String username, UserRole role) {

        Map<String, Object> claims = new HashMap<>();

        claims.put("role", role.name());

        return Jwts.builder()

                .setClaims(claims)

                .setSubject(username)

                .setIssuedAt(new Date())

                .setExpiration(
                        new Date(System.currentTimeMillis() + expiration))

                .signWith(getKey(), SignatureAlgorithm.HS256)

                .compact();
    }

    /**
     * Parse all claims
     */
    private Claims getClaims(String token) {

        return Jwts.parserBuilder()

                .setSigningKey(getKey())

                .build()

                .parseClaimsJws(token)

                .getBody();
    }

    /**
     * Extract username
     */
    public String extractUsername(String token) {

        return getClaims(token).getSubject();

    }

    /**
     * Extract role
     */
    public String extractRole(String token) {

        Object role = getClaims(token).get("role");

        return role == null ? null : role.toString();

    }

    /**
     * Expiration
     */
    public Date extractExpiration(String token) {

        return getClaims(token).getExpiration();

    }

    /**
     * Check expiration
     */
    public boolean isTokenExpired(String token) {

        return extractExpiration(token).before(new Date());

    }

    /**
     * Validate Token
     */
    public boolean isTokenValid(String token) {

        try {

            Claims claims = getClaims(token);

            return claims.getSubject() != null
                    && !isTokenExpired(token);

        } catch (JwtException | IllegalArgumentException e) {

            return false;

        }

    }

}