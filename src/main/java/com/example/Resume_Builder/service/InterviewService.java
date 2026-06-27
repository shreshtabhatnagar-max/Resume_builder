package com.example.Resume_Builder.service;
import com.example.Resume_Builder.dto.AnswerResponse;
import com.example.Resume_Builder.dto.InterviewReportResponse;
import com.example.Resume_Builder.dto.InterviewSessionResponse;
import com.example.Resume_Builder.entity.InterviewQuestion;
import com.example.Resume_Builder.entity.InterviewSession;
import com.example.Resume_Builder.entity.User;
import com.example.Resume_Builder.repository.InterviewQuestionRepository;
import com.example.Resume_Builder.repository.InterviewSessionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class InterviewService {
    private final ResumeParserService resumeParserService;
    private final GeminiService geminiService;
    private final InterviewSessionRepository sessionRepository;
    private final InterviewQuestionRepository questionRepository;

    public InterviewSessionResponse startInterview(MultipartFile cvFile, String roleTitle, User user) throws Exception {
        String resumeText = resumeParserService.extractText(cvFile);
        String rawQuestions = geminiService.generateQuestions(resumeText, roleTitle);
        List<String> questionTexts = parseQuestionList(rawQuestions);

        InterviewSession session = new InterviewSession();
        session.setUser(user);
        session.setStatus("IN_PROGRESS");
        session.setCreatedAt(LocalDateTime.now());
        session = sessionRepository.save(session);

        List<InterviewQuestion> savedQuestions = new ArrayList<>();
        int order = 1;
        for (String qText : questionTexts) {
            InterviewQuestion question = new InterviewQuestion();
            question.setSession(session);
            question.setQuestionText(qText);
            question.setOrderIndex(order++);
            savedQuestions.add(questionRepository.save(question));
        }

        return toResponse(session, savedQuestions);
    }

    private InterviewSessionResponse toResponse(InterviewSession session, List<InterviewQuestion> questions) {
        InterviewSessionResponse response = new InterviewSessionResponse();
        response.setSessionId(session.getId());
        response.setStatus(session.getStatus());
        response.setCreatedAt(session.getCreatedAt());

        List<InterviewSessionResponse.QuestionResponse> questionResponses = new ArrayList<>();
        for (InterviewQuestion q : questions) {
            InterviewSessionResponse.QuestionResponse qr = new InterviewSessionResponse.QuestionResponse();
            qr.setQuestionId(q.getId());
            qr.setQuestionText(q.getQuestionText());
            qr.setOrderIndex(q.getOrderIndex());
            questionResponses.add(qr);
        }
        response.setQuestions(questionResponses);
        return response;
    }


    private List<String> parseQuestionList(String rawText) {
        List<String> result = new ArrayList<>();
        String[] lines = rawText.split("\n");
        for (String line : lines) {
            line = line.trim();
            if (line.isEmpty()) continue;
            // Remove leading numbering like "1.", "2)", etc.
            String cleaned = line.replaceFirst("^\\d+[\\.\\)]\\s*", "");
            if (!cleaned.isEmpty()) {
                result.add(cleaned);
            }
        }
        return result;
    }
    public AnswerResponse submitAnswer(Long sessionId, Long questionId, MultipartFile audioFile, User user) throws Exception {
        InterviewQuestion question = questionRepository.findById(questionId)
                .orElseThrow(() -> new RuntimeException("Question not found"));

        if (!question.getSession().getId().equals(sessionId)) {
            throw new RuntimeException("Question does not belong to this session");
        }
        if (!question.getSession().getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to this interview session");
        }

        byte[] audioBytes = audioFile.getBytes();
        String mimeType = audioFile.getContentType();
        String filename = audioFile.getOriginalFilename();

        if (mimeType == null) {
            mimeType = "audio/mpeg";
        } else if (mimeType.equals("video/mp4")) {
            mimeType = "audio/mp4";
            log.info("Corrected MIME type from video/mp4 to audio/mp4 for file: {}", filename);
        }

        String geminiResponse = geminiService.evaluateAudioAnswer(question.getQuestionText(), audioBytes, mimeType);

        String transcript = extractField(geminiResponse, "Transcript:");
        String scoreStr = extractField(geminiResponse, "Score:");
        String feedback = extractField(geminiResponse, "Feedback:");

        Integer score = null;
        if (scoreStr != null) {
            try {
                String beforeSlash = scoreStr.split("/")[0].trim();
                String digits = beforeSlash.replaceAll("[^0-9]", "");
                if (!digits.isEmpty()) {
                    score = Integer.parseInt(digits);
                }
            } catch (Exception e) {
                log.warn("Could not parse score from: {}", scoreStr);
            }
        }

        question.setAnswerTranscript(transcript);
        question.setScore(score);
        question.setFeedback(feedback);
        question = questionRepository.save(question);

        AnswerResponse response = new AnswerResponse();
        response.setQuestionId(question.getId());
        response.setQuestionText(question.getQuestionText());
        response.setAnswerTranscript(question.getAnswerTranscript());
        response.setScore(question.getScore());
        response.setFeedback(question.getFeedback());
        return response;
    }

    private String extractField(String text, String label) {
        int start = text.indexOf(label);
        if (start == -1) return null;
        start += label.length();
        int end = text.length();
        String[] nextLabels = {"Transcript:", "Score:", "Feedback:", "OverallScore:", "Strengths:", "Improvements:", "Summary:"};
        for (String nl : nextLabels) {
            int idx = text.indexOf(nl, start);
            if (idx != -1 && idx < end && idx > start) {
                end = idx;
            }
        }
        return text.substring(start, end).trim();
    }

    public InterviewReportResponse generateReport(Long sessionId, User user) {
        InterviewSession session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new RuntimeException("Session not found"));

        if (!session.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to this interview session");
        }

        List<InterviewQuestion> questions = session.getQuestions();

        List<String> qaList = new ArrayList<>();
        for (InterviewQuestion q : questions) {
            qaList.add("Q: " + q.getQuestionText() + "\nA: " +
                    (q.getAnswerTranscript() != null ? q.getAnswerTranscript() : "[Not answered]"));
        }

        String rawReport = geminiService.generateOverallReport(qaList);

        String overallScoreStr = extractField(rawReport, "OverallScore:");
        String strengths = extractField(rawReport, "Strengths:");
        String improvements = extractField(rawReport, "Improvements:");
        String summary = extractField(rawReport, "Summary:");

        Integer overallScore = null;
        if (overallScoreStr != null) {
            try {
                String beforeSlash = overallScoreStr.split("/")[0].trim();
                overallScore = Integer.parseInt(beforeSlash.replaceAll("[^0-9]", ""));
            } catch (Exception e) {
                log.warn("Could not parse overall score from: {}", overallScoreStr);
            }
        }

        session.setStatus("COMPLETED");
        sessionRepository.save(session);

        InterviewReportResponse response = new InterviewReportResponse();
        response.setSessionId(session.getId());
        response.setStatus(session.getStatus());
        response.setOverallScore(overallScore);
        response.setStrengths(strengths);
        response.setImprovements(improvements);
        response.setSummary(summary);

        List<InterviewReportResponse.QuestionDetail> details = new ArrayList<>();
        for (InterviewQuestion q : questions) {
            InterviewReportResponse.QuestionDetail d = new InterviewReportResponse.QuestionDetail();
            d.setQuestionText(q.getQuestionText());
            d.setAnswerTranscript(q.getAnswerTranscript());
            d.setScore(q.getScore());
            d.setFeedback(q.getFeedback());
            details.add(d);
        }
        response.setQuestions(details);

        return response;
    }
}

