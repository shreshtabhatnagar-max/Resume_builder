package com.example.Resume_Builder.controller;

import com.example.Resume_Builder.dto.AuthResponse;
import com.example.Resume_Builder.dto.RegisterRequestDTO;
import com.example.Resume_Builder.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO requestDTO) {

        AuthResponse response = authService.register(requestDTO);
        log.info("Response from service:{}",response);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    @GetMapping("/verify-email")
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        authService.verifyEmail(token);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message","Email Verified successfully"));
    }
}
