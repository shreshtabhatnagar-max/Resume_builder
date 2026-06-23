package com.example.Resume_Builder.controller;

import com.example.Resume_Builder.dto.AuthResponse;
import com.example.Resume_Builder.dto.LoginRequest;
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
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;
import java.util.Objects;

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


    @PostMapping(UPLOAD_PROFILE)
    public ResponseEntity<?> uploadImage(@RequestPart("image") MultipartFile file) throws IOException {
        log.info("Inside Auth_Controller - uploadImage()");
        Map<String, String> response = fileUploadService.uploadSingleImage(file);
        return ResponseEntity.ok(response);
    }

//    @PostMapping(LOGIN)
//    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
//        AuthResponse response = authService.login(request);
//        return ResponseEntity.ok(response);
//
//    }
@PostMapping(LOGIN)
public ResponseEntity<?> login(@Valid @RequestBody LoginRequest request) {
    try {
        AuthResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    } catch (Exception e) {
        e.printStackTrace(); // prints full stack trace to your IntelliJ console
        return ResponseEntity.status(500).body("Login failed: " + e.getMessage());
    }
}
//    @GetMapping("/validate")
//    public String testValidationToken(){
//        return "Token Validation is Working";
 //   }
    @PostMapping(RESEND_VERIFICATION)
    public ResponseEntity<?> resendVerification(@RequestBody Map<String, String> body){
        String email= body.get("email");
        if(Objects.isNull(email)){
            return ResponseEntity.badRequest().body(Map.of("message","Email is required"));
        }
        authService.resendVerification(email);
        return ResponseEntity.ok(Map.of("success", true,"message","Verification email sent"));
    }
    @GetMapping(PROFILE)
    public ResponseEntity<?> getProfile(Authentication authentication){
        //Step1:Get the principle Object
        Object principalObject= authentication.getPrincipal();

        //Step2: call th service method
        AuthResponse currentProfile=authService.getProfile(principalObject);

        //Step3: return the response
        return ResponseEntity.ok(currentProfile);
    }
}