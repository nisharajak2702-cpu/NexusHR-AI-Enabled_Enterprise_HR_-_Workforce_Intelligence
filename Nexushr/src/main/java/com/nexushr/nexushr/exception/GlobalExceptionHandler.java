package com.nexushr.nexushr.exception;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import jakarta.servlet.http.HttpServletRequest;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /*
     * ============================================
     * Resource Not Found
     * ============================================
     */

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ApiError> handleResourceNotFound(

            ResourceNotFoundException ex,

            HttpServletRequest request) {

        ApiError error = new ApiError();

        error.setTimestamp(LocalDateTime.now());

        error.setStatus(HttpStatus.NOT_FOUND.value());

        error.setError("Resource Not Found");

        error.setMessage(ex.getMessage());

        error.setPath(request.getRequestURI());

        return new ResponseEntity<>(

                error,

                HttpStatus.NOT_FOUND);

    }

    /*
     * ============================================
     * Duplicate Resource
     * ============================================
     */

    @ExceptionHandler(DuplicateResourceException.class)
    public ResponseEntity<ApiError> handleDuplicate(

            DuplicateResourceException ex,

            HttpServletRequest request) {

        ApiError error = new ApiError();

        error.setTimestamp(LocalDateTime.now());

        error.setStatus(HttpStatus.CONFLICT.value());

        error.setError("Duplicate Resource");

        error.setMessage(ex.getMessage());

        error.setPath(request.getRequestURI());

        return new ResponseEntity<>(

                error,

                HttpStatus.CONFLICT);

    }

    /*
     * ============================================
     * Bad Request
     * ============================================
     */

    @ExceptionHandler(BadRequestException.class)
    public ResponseEntity<ApiError> handleBadRequest(

            BadRequestException ex,

            HttpServletRequest request) {

        ApiError error = new ApiError();

        error.setTimestamp(LocalDateTime.now());

        error.setStatus(HttpStatus.BAD_REQUEST.value());

        error.setError("Bad Request");

        error.setMessage(ex.getMessage());

        error.setPath(request.getRequestURI());

        return new ResponseEntity<>(

                error,

                HttpStatus.BAD_REQUEST);

    }

    /*
     * ============================================
     * Validation Errors
     * ============================================
     */

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidation(

            MethodArgumentNotValidException ex) {

        Map<String, String> errors = new HashMap<>();

        ex.getBindingResult()

                .getAllErrors()

                .forEach(error -> {

                    String field =
                            ((FieldError) error).getField();

                    String message =
                            error.getDefaultMessage();

                    errors.put(field, message);

                });

        return new ResponseEntity<>(

                errors,

                HttpStatus.BAD_REQUEST);

    }

    /*
     * ============================================
     * Unknown Exception
     * ============================================
     */

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleException(

            Exception ex,

            HttpServletRequest request) {

        ApiError error = new ApiError();

        error.setTimestamp(LocalDateTime.now());

        error.setStatus(HttpStatus.INTERNAL_SERVER_ERROR.value());

        error.setError("Internal Server Error");

        error.setMessage(ex.getMessage());

        error.setPath(request.getRequestURI());

        return new ResponseEntity<>(

                error,

                HttpStatus.INTERNAL_SERVER_ERROR);

    }

}