package com.trackIt.api.exception;

import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {



    @ExceptionHandler(DuplicatedUserInfoException.class)
    public ResponseEntity<Map<String, String>> userAlreadyExistException(DuplicatedUserInfoException exception) {
        return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of("error", exception.getMessage(),
                "errorCode", "1001"));
    }


    @ExceptionHandler(TaskNameAlreadyFoundException.class)
    public ResponseEntity<?> taskNameAlreadyFoundException(TaskNameAlreadyFoundException ex,
                                                                           HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message",ex.getMessage()));    }

    @ExceptionHandler(TaskNotFoundException.class)
    public ResponseEntity<?> taskNotFoundException(TaskNotFoundException ex, HttpServletRequest request) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message",ex.getMessage()));
    }


    @ExceptionHandler(CustomServiceException.class)
    public ResponseEntity<?> handleCustomServiceException(CustomServiceException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of("message",ex.getMessage()));
    }



}
