package com.example.Resume_Builder.controller;

import com.example.Resume_Builder.dto.InterviewSessionResponse;
import com.example.Resume_Builder.entity.InterviewSession;
import com.example.Resume_Builder.entity.User;
import com.example.Resume_Builder.service.GeminiService;
import com.example.Resume_Builder.service.InterviewService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/interview")
@RequiredArgsConstructor
@Slf4j
public class InterviewController {

    private final InterviewService interviewService;
    private final GeminiService geminiService;
    @PostMapping("/start")
    public ResponseEntity<?> startInterview(
            @RequestParam("cv") MultipartFile cvFile,
            @RequestParam("roleTitle") String roleTitle,
            Authentication authentication
    ) {
        try {
            Object principalObject = authentication.getPrincipal();
            User existingUser = (User) principalObject;
            InterviewSessionResponse session = interviewService.startInterview(cvFile, roleTitle, existingUser);
            return ResponseEntity.ok(session);
        } catch (Exception e) {
            log.error("Failed to start interview", e);
            return ResponseEntity.badRequest().body("Failed to start interview: " + e.getMessage());
        }
    }
    @PostMapping("/{sessionId}/answer/{questionId}")
    public ResponseEntity<?> submitAnswer(
            @PathVariable Long sessionId,
            @PathVariable Long questionId,
            @RequestParam("audio") MultipartFile audioFile,
            Authentication authentication
    ) {
        try {
            log.info("DEBUG - Original filename: {}", audioFile.getOriginalFilename());
            log.info("DEBUG - Content type: {}", audioFile.getContentType());
            log.info("DEBUG - File size: {}", audioFile.getSize());
            Object principalObject = authentication.getPrincipal();
            User existingUser = (User) principalObject;
            var result = interviewService.submitAnswer(sessionId, questionId, audioFile, existingUser);
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            log.error("Failed to submit answer", e);
            return ResponseEntity.badRequest().body("Failed to submit answer: " + e.getMessage());
        }
    }
    @GetMapping("/question-audio")
    public ResponseEntity<byte[]> getQuestionAudio(@RequestParam("text") String text) {
        try {
            byte[] wavBytes = geminiService.generateSpeech(text);
            return ResponseEntity.ok()
                    .contentType(MediaType.parseMediaType("audio/wav"))
                    .body(wavBytes);
        } catch (Exception e) {
            log.error("Failed to generate question audio", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    @GetMapping("/{sessionId}/report")
    public ResponseEntity<?> getReport(
            @PathVariable Long sessionId,
            Authentication authentication
    ) {
        try {
            Object principalObject = authentication.getPrincipal();
            User existingUser = (User) principalObject;
            var report = interviewService.generateReport(sessionId, existingUser);
            return ResponseEntity.ok(report);
        } catch (Exception e) {
            log.error("Failed to generate report", e);
            return ResponseEntity.badRequest().body("Failed to generate report: " + e.getMessage());
        }
    }

}