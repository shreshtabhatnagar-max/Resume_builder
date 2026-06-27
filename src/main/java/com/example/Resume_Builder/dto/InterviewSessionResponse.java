package com.example.Resume_Builder.dto;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class InterviewSessionResponse {
    private Long sessionId;
    private String status;
    private LocalDateTime createdAt;
    private List<QuestionResponse> questions;

    @Data
    public static class QuestionResponse {
        private Long questionId;
        private String questionText;
        private Integer orderIndex;
    }
}