package com.example.Resume_Builder.dto;

import lombok.Data;

@Data
public class AnswerResponse {
    private Long questionId;
    private String questionText;
    private String answerTranscript;
    private Integer score;
    private String feedback;
}
