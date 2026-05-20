package com.example.Resume_Builder.service;

import com.example.Resume_Builder.dto.AuthResponse;
import com.example.Resume_Builder.dto.CreateResumeRequest;
import com.example.Resume_Builder.entity.Resume;
import com.example.Resume_Builder.repository.ResumeRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

import java.util.ArrayList;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {
    private final ResumeRepository resumeRepository;
    private final AuthService authService;
    public Resume createResume(CreateResumeRequest request, Object principleObject){
        //Step 1: Create resume object
        Resume newResume =new Resume();

        //Step 2: Get the Current  profile
        AuthResponse response=authService.getProfile(principleObject);

        //Step 3: update the resume object
        newResume.setUserId(response.getId());
        newResume.setTitle(request.getTitle());

        //Step 4: Set default data for resume
        setDefaultResumeData(newResume);

        //Step 5: save the resume data
         return resumeRepository.save(newResume);
    }
    private void setDefaultResumeData(Resume newResume){
        newResume.setProfileInfo(new Resume.ProfileInfo());
        newResume.setContactInfo(new Resume.ContactInfo());
        newResume.setWorkExperiences(new ArrayList<>());
        newResume.setEducations(new ArrayList<>());
        newResume.setSkills(new ArrayList<>());
        newResume.setProjects(new ArrayList<>());
        newResume.setCertification(new ArrayList<>());
        newResume.setLanguages(new ArrayList<>());
        newResume.setInterest(new ArrayList<>());

    }
}
