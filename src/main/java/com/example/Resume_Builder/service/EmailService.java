package com.example.Resume_Builder.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class EmailService {

    @Value("${brevo.api.key}")
    private String brevoApiKey;

    @Value("${spring.mail.properties.mail.smtp.from}")
    private String fromEmail;

    private static final String BREVO_API_URL = "https://api.brevo.com/v3/smtp/email";

    private final RestTemplate restTemplate = new RestTemplate();

    public void sendHtmlEmail(String to, String subject, String htmlContent) throws Exception {
        log.info("Inside EmailService - sendHtmlEmail(): {}, {}", to, subject);

        Map<String, Object> payload = new HashMap<>();
        payload.put("sender", Map.of("email", fromEmail));
        payload.put("to", List.of(Map.of("email", to)));
        payload.put("subject", subject);
        payload.put("htmlContent", htmlContent);

        sendViaBrevoApi(payload);
    }

    public void sendEmailWithAttachment(String to, String subject, String body, byte[] attachment, String filename) {
        log.info("Inside EmailService - sendEmailWithAttachment(): {}, {}", to, subject);

        Map<String, Object> payload = new HashMap<>();
        payload.put("sender", Map.of("email", fromEmail));
        payload.put("to", List.of(Map.of("email", to)));
        payload.put("subject", subject);
        payload.put("htmlContent", body);
        payload.put("attachment", List.of(Map.of(
                "content", Base64.getEncoder().encodeToString(attachment),
                "name", filename
        )));

        sendViaBrevoApi(payload);
    }

    private void sendViaBrevoApi(Map<String, Object> payload) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("api-key", brevoApiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setAccept(List.of(MediaType.APPLICATION_JSON));

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        try {
            ResponseEntity<String> response = restTemplate.exchange(
                    BREVO_API_URL, HttpMethod.POST, request, String.class
            );
            log.info("Brevo API response: {} - {}", response.getStatusCode(), response.getBody());
        } catch (Exception e) {
            log.error("Failed to send email via Brevo API", e);
            throw new RuntimeException("Failed to send email: " + e.getMessage(), e);
        }
    }
}