package com.example.Resume_Builder.controller;

import com.example.Resume_Builder.dto.AuthResponse;
import com.example.Resume_Builder.dto.RegisterRequestDTO;
import com.example.Resume_Builder.service.AuthService;
import com.example.Resume_Builder.service.FileUploadService;
import com.example.Resume_Builder.util.AppConstants;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.coyote.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

import static com.example.Resume_Builder.util.AppConstants.*;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping(AUTH_CONTROLLER)
public class AuthController {

    private final AuthService authService;

    private final FileUploadService fileUploadService;

    @PostMapping(REGISTER)
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequestDTO requestDTO) {
        log.info("Inside AuthController - register(): {}", requestDTO);
        AuthResponse response = authService.register(requestDTO);
        log.info("Response from service:{}", response);
        return ResponseEntity.status(HttpStatus.CREATED).body(response);

    }

    @GetMapping(VERIFY_EMAIL)
    public ResponseEntity<?> verifyEmail(@RequestParam String token) {
        log.info("Inside AuthController - verifyEmail(): {}", token);
        authService.verifyEmail(token);
        return ResponseEntity.status(HttpStatus.OK).body(Map.of("message", "Email Verified successfully"));
    }


    @PostMapping("/uplode-image")
    public ResponseEntity<?> uploadImage(@RequestPart("image") MultipartFile file) throws {
       Map<String ,String>response= fileUploadService.uploadSingleImage(file);
       return ResponseEntity.ok(response);
    }
}