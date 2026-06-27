package com.example.Resume_Builder.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class InterviewQuestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "session_id")
    private InterviewSession session;

    @Column(columnDefinition = "TEXT")
    private String questionText;

    @Column(columnDefinition = "TEXT")
    private String answerTranscript;

    private Integer score;

    @Column(columnDefinition = "TEXT")
    private String feedback;

    private Integer orderIndex;
}