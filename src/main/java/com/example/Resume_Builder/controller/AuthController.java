package com.example.Resume_Builder.controller;

import com.example.Resume_Builder.dto.AuthResponse;
import com.example.Resume_Builder.dto.RegisterRequestDTO;
import com.example.Resume_Builder.service.AuthService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/auth")
public class AuthController {
    private final AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO requestDTO) {
        
            AuthResponse response = authService.Register(requestDTO);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }
}
