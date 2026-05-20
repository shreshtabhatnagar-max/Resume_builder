package com.example.Resume_Builder.entity;

import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;
import java.util.List;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder

@Entity
@Table(name = "resume")
public class Resume {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    @JsonProperty("_id")
    private String id;

    private String userId;

    private String title;
    @ElementCollection
    private List<WorkExperience> workExperiences;

    private String thumbnailLink;

    private ProfileInfo profileInfo;

    private ContactInfo contactInfo;
    private Template template;
    @ElementCollection
    private List<Education> educations;
    @ElementCollection
    private List<Skill> skills;
    @ElementCollection
    private List<Project> projects;
    @ElementCollection
    private List<Certification> certification;
    @ElementCollection
    private List<Language> languages;
    private List<String> interest;
    @CreatedDate
    private LocalDateTime createdAt;
    @LastModifiedDate
    private LocalDateTime updatedAt;



    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Embeddable
    private static class Template {
        private String theme;
        private List<String> colourPalette;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Embeddable
    public static class ProfileInfo {
        private String profilePreviewUrl;
        private String fullName;
        private String designation;
        private String summary;

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Embeddable
    public static class ContactInfo {
        private String email;
        private String phone;
        private String location;
        private String linkedin;
        private String github;
        private String website;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Embeddable
    public static class WorkExperience {
        private String company;
        private String role;
        private String startDate;
        private String endDate;
        private String description;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Embeddable
    public static class Education {
        private String degree;
        private String institution;
        private String startDate;
        private String endDate;

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Embeddable
    public static class Skill {
        private String name;
        private Integer progress;

    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Embeddable
    public static class Project {
        private String title;
        private String description;
        private String github;
        private String liveDemo;
    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Embeddable
    public static class Certification {
        private String title;
        private String issuer;
        private String year;


    }

    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    @Builder
    @Embeddable
    public static class Language {
        private String name;
        private Integer progress;
    }


}
