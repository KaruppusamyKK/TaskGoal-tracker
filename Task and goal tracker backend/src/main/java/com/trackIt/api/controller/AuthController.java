package com.trackIt.api.controller;
import com.trackIt.api.dto.request.LoginRequest;
import com.trackIt.api.dto.request.RegisterRequest;
import com.trackIt.api.dto.response.RegisterServiceResponse;
import com.trackIt.api.security.jwt.JwtService;
import com.trackIt.api.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;
@RestController
@Slf4j
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {
    private final UserService userService;
    private final AuthenticationManager authManager;
    private final JwtService jwtService;


    /***
     * @param request
     * Username & password are given and as response JWT token is responded to UI
     */

    @PostMapping("/authenticate")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        try {
            logger.info("Login attempt by user: {}", request.username());
            Authentication authentication = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.username(), "{noop}" + request.password())
            );
            String token = jwtService.generateAccessToken(request.username());
            logger.info(!token.isEmpty() ? "Token generation success" : "Token generation failure");
            return ResponseEntity.ok(token);
        } catch (AuthenticationException e) {
            logger.warn("Invalid credentials for user: {}", request.username());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Invalid assigner or password.");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<String> register(@RequestBody RegisterRequest request) {
        logger.info("Signup request for username {} , and Request Object {} ", request.username(),request);
        RegisterServiceResponse registerServiceResponse = userService.registerUser(request);
        return ResponseEntity.status(HttpStatus.OK).body(registerServiceResponse.message());
    }


}
