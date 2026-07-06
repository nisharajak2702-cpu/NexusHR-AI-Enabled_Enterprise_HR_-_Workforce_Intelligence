package com.nexushr.nexushr.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;

import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import com.nexushr.nexushr.security.JwtFilter;
import com.nexushr.nexushr.security.JwtUtil;

import java.util.List;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    @Bean
    public JwtFilter jwtFilter(JwtUtil jwtUtil) {

        JwtFilter filter = new JwtFilter();

        filter.setJwtUtil(jwtUtil);

        return filter;

    }

    @Bean
    BCryptPasswordEncoder passwordEncoder() {

        return new BCryptPasswordEncoder();

    }
    
    @Bean
    CorsConfigurationSource corsConfigurationSource() {

        CorsConfiguration configuration = new CorsConfiguration();

        configuration.setAllowedOriginPatterns(
                List.of(
                        "http://localhost:*",
                        "http://127.0.0.1:*",
                        "https://nexushr-ai-enabled-enterprise-hr-9whf.onrender.com"
                ));

        configuration.setAllowedMethods(
                List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "HEAD"));

        configuration.setAllowedHeaders(List.of("*"));

        configuration.setAllowCredentials(true);

        configuration.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(
                "/**",
                configuration);

        return source;

    }

    @Bean
    SecurityFilterChain securityFilterChain(
            HttpSecurity http,
            JwtFilter jwtFilter)
            throws Exception {

        http

                .csrf(csrf -> csrf.disable())

                .cors(cors -> cors.configurationSource(corsConfigurationSource()))

                .sessionManagement(session ->

                        session.sessionCreationPolicy(

                                SessionCreationPolicy.STATELESS))

                .authorizeHttpRequests(auth -> auth
                		
                		.requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

                        .requestMatchers(

                                "/auth/**",

                                "/swagger-ui/**",

                                "/swagger-ui.html",

                                "/v3/api-docs/**",

                                "/api-docs/**"

                        ).permitAll()

                        .requestMatchers(
                                HttpMethod.POST,
                                "/users")
                        .permitAll()

                        .anyRequest()
                        .authenticated()

                )

                .addFilterBefore(

                        jwtFilter,

                        UsernamePasswordAuthenticationFilter.class

                )

                .httpBasic(httpBasic -> httpBasic.disable())

                .formLogin(form -> form.disable())

                .logout(logout -> logout.disable());

        return http.build();

    }

}