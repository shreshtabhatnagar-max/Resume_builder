package com.example.Resume_Builder.service;

//package com.example.Resume_Builder.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    private final RestTemplate restTemplate = new RestTemplate();

    private String buildUrl() {
        return "https://generativelanguage.googleapis.com/v1beta/models/"
                + model + ":generateContent?key=" + apiKey;
    }

    /**
     * Generates interview questions based on extracted resume text.
     */
    public String generateQuestions(String resumeText, String roleTitle) {
        String prompt = String.format(
                "You are an interview coach. Based on this resume, generate exactly 5 interview questions " +
                        "(mix of technical and behavioral) for a %s position. " +
                        "Return ONLY a numbered list of questions, no extra commentary.\n\nResume:\n%s",
                roleTitle, resumeText
        );

        Map<String, Object> payload = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        return callGemini(payload);
    }

    /**
     * Evaluates a transcribed answer against the question asked.
     */
    public String evaluateAnswer(String questionText, String answerTranscript) {
        String prompt = String.format(
                "You are an interview evaluator. Question asked: \"%s\"\n" +
                        "Candidate's answer: \"%s\"\n\n" +
                        "Give a score out of 100 and 2-3 lines of constructive feedback. " +
                        "Respond in this exact format:\nScore: X/100\nFeedback: <your feedback>",
                questionText, answerTranscript
        );
        // ... rest stays the same


        Map<String, Object> payload = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        return callGemini(payload);
    }

    private String callGemini(Map<String, Object> payload) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(payload, headers);

        int maxRetries = 3;
        int attempt = 0;

        while (attempt < maxRetries) {
            try {
                ResponseEntity<Map> response = restTemplate.exchange(
                        buildUrl(), HttpMethod.POST, request, Map.class
                );
                return extractText(response.getBody());
            } catch (Exception e) {
                attempt++;
                log.warn("Gemini API call failed (attempt {}/{}): {}", attempt, maxRetries, e.getMessage());
                if (attempt >= maxRetries) {
                    throw new RuntimeException("Failed to get response from Gemini after " + maxRetries + " attempts: " + e.getMessage(), e);
                }
                try {
                    Thread.sleep(2000L * attempt); // 2s, 4s, 6s backoff
                } catch (InterruptedException ie) {
                    Thread.currentThread().interrupt();
                }
            }
        }
        throw new RuntimeException("Unreachable");
    }

    @SuppressWarnings("unchecked")
    private String extractText(Map<String, Object> responseBody) {
        try {
            List<Map<String, Object>> candidates = (List<Map<String, Object>>) responseBody.get("candidates");
            Map<String, Object> content = (Map<String, Object>) candidates.get(0).get("content");
            List<Map<String, Object>> parts = (List<Map<String, Object>>) content.get("parts");
            return (String) parts.get(0).get("text");
        } catch (Exception e) {
            log.error("Failed to parse Gemini response: {}", responseBody, e);
            throw new RuntimeException("Unexpected Gemini response format");
        }
    }
    public String evaluateAudioAnswer(String questionText, byte[] audioBytes, String mimeType) {
        String prompt = String.format(
                "You are an interview evaluator. The candidate was asked: \"%s\"\n" +
                        "Listen to their spoken answer in the attached audio. " +
                        "First transcribe what they said, then give a score out of 100 and 2-3 lines of constructive feedback. " +
                        "Respond in this exact format:\nTranscript: <what they said>\nScore: X/100\nFeedback: <your feedback>",
                questionText
        );

        String base64Audio = java.util.Base64.getEncoder().encodeToString(audioBytes);

        Map<String, Object> payload = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(
                                Map.of("text", prompt),
                                Map.of("inline_data", Map.of(
                                        "mime_type", mimeType,
                                        "data", base64Audio
                                ))
                        ))
                )
        );

        return callGemini(payload);
    }
    public String generateOverallReport(List<String> questionsAndAnswers) {
        StringBuilder transcript = new StringBuilder();
        for (String qa : questionsAndAnswers) {
            transcript.append(qa).append("\n\n");
        }

        String prompt = String.format(
                "You are a senior interview coach reviewing a complete mock interview transcript below. " +
                        "Based on all the questions and answers, provide:\n" +
                        "1. An overall score out of 100\n" +
                        "2. Key strengths (2-3 bullet points)\n" +
                        "3. Key areas for improvement (2-3 bullet points)\n" +
                        "4. A short closing summary (2-3 sentences)\n\n" +
                        "Respond in this exact format:\nOverallScore: X/100\nStrengths: <bullet points>\nImprovements: <bullet points>\nSummary: <closing summary>\n\n" +
                        "Transcript:\n%s",
                transcript.toString()
        );

        Map<String, Object> payload = Map.of(
                "contents", List.of(
                        Map.of("parts", List.of(Map.of("text", prompt)))
                )
        );

        return callGemini(payload);
    }
}