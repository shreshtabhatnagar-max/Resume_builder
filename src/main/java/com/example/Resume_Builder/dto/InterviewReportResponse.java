package com.example.Resume_Builder.dto;

import lombok.Data;
import java.util.List;

@Data
public class InterviewReportResponse {
    private Long sessionId;
    private String status;
    private Integer overallScore;
    private String strengths;
    private String improvements;
    private String summary;
    private List<QuestionDetail> questions;

    @Data
    public static class QuestionDetail {
        private String questionText;
        private String answerTranscript;
        private Integer score;
        private String feedback;
    }
}