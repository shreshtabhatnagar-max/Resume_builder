package com.example.Resume_Builder.service;

import com.example.Resume_Builder.dto.AuthResponse;
import com.example.Resume_Builder.dto.LoginRequest;
import com.example.Resume_Builder.dto.RegisterRequestDTO;
import com.example.Resume_Builder.entity.User;
import com.example.Resume_Builder.exception.ResourceExistException;
import com.example.Resume_Builder.repository.UserRepository;
import com.example.Resume_Builder.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class AuthService {


    private final UserRepository userRepository;

    private final EmailService emailService;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;


    @Value("${app.base.url:http://localhost:8080}")
    private String appBaseUrl;

    public AuthResponse register(RegisterRequestDTO requestDTO) {
        log.info("Inside AuthService: register()", requestDTO);

        if (userRepository.existsByEmail(requestDTO.getEmail())) {
            throw new ResourceExistException("User Already Exists with this email");
        }
        User newUser = toDocument(requestDTO);

        userRepository.save(newUser);

        sendVerificationEmail(newUser);
        //Auth Response
        return toResponse(newUser);
    }

    private void sendVerificationEmail(User newUser) {
        log.info("Inside AuthService-sendVerificationEmail(): {}", newUser);
        try {
            String link = appBaseUrl + "/api/auth/verify-email?token=" + newUser.getVerificationToken();
            log.info("Base URL: {}", appBaseUrl);
            String html = "<div style='font-family:sans-serif'>" +
                    "<h2>Verify your email</h2>" +
                    "<p>Hi" + newUser.getName() + ",please confirm your email to activate your account </p>"
                    + "<p><a href='" + link +
                    "'style='display:inline-block;padding:10px 16px;background:#6366f1;color:#fff;border-radius:6px;text-decoration:none'>Verify Email</a></p>"
                    + "<p>Or copy this link: <a href='" + link + "'>" + link + "</a></p>" +
                    "<p> This link expires in 24 hours.</p>" +
                    "</div>";
            emailService.sendHtmlEmail(newUser.getEmail(), "Verify your email", html);

        } catch (Exception e) {
            log.error("Exception occured at sendVerificationEmail(): {}", e.getMessage());
            throw new RuntimeException("Failed to send verification email" + e.getMessage());
        }
    }

    private AuthResponse toResponse(User newUser) {
        return AuthResponse.builder()
                .id(String.valueOf(newUser.getId())).
                name(newUser.getName())
                .email(newUser.getEmail()).
                profileImageUrl(newUser.getProfileImageUrl())
                .emailVerified(newUser.isEmailVerified()).
                token(newUser.getVerificationToken())
                .subscription(newUser.getSubscriptionPlan())
                .createdAt(newUser.getCreatedAt())
                .updatedAt(newUser.getUpdateAt())
                .build();
    }

    private User toDocument(RegisterRequestDTO requestDTO) {
        return User.builder().
                name(requestDTO.getName()).
                email(requestDTO.getEmail()).
                password(passwordEncoder.encode(requestDTO.getPassword())).
                profileImageUrl(requestDTO.getProfileImageUrl()).
                subscriptionPlan("Basic").
                emailVerified(false).
                verificationToken(UUID.randomUUID().toString()).
                verificationExpires(LocalDateTime.now().plusHours(24)).
                createdAt(LocalDateTime.now()).
                updateAt(LocalDateTime.now())
                .build();
    }

    public void verifyEmail(String token) {
        log.info("Inside AuthService: verifyEmail(): {}", token);
        User user = userRepository.findByVerificationToken(token).orElseThrow(() -> new RuntimeException("Invalid or Expired Verification Token"));

        if (user.getVerificationExpires() != null &&
                user.getVerificationExpires().isBefore(LocalDateTime.now())) {
            throw new RuntimeException("Verification token has Expired .Please request new one");
        }

        user.setEmailVerified(true);
        user.setVerificationToken(null);
        user.setVerificationExpires(null);

        userRepository.save(user);
    }

    public AuthResponse login(LoginRequest request) {
        User existingUser = userRepository.findByEmail(request.getEmail()).orElseThrow(() -> new UsernameNotFoundException("Invalid Email And Password"));

        if (!passwordEncoder.matches(request.getPassword(), existingUser.getPassword())) {
            throw new UsernameNotFoundException("Please verify your  email before logging in.");
        }
        if (!existingUser.isEmailVerified()) {
            throw new RuntimeException("Please Verify Your email before logging in.");
        }
        String token = jwtUtil.generateToken((existingUser.getId().toString()));

        AuthResponse response = toResponse(existingUser);
        response.setToken(token);
        return response;
    }

    public void resendVerification(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not Found"));

        if (user.isEmailVerified()) {
            throw new RuntimeException("Email is Already Verified");
        }
        user.setVerificationToken(UUID.randomUUID().toString());
        user.setVerificationExpires(LocalDateTime.now().plusHours(24));

        userRepository.save(user);

        sendVerificationEmail(user);

    }
    public AuthResponse getProfile(Object principalObject){
        User existingUser= (User)principalObject;
        return toResponse(existingUser);
    }
}
