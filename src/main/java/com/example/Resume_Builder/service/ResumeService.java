package com.example.Resume_Builder.service;

import com.example.Resume_Builder.dto.AuthResponse;
import com.example.Resume_Builder.dto.CreateResumeRequest;
import com.example.Resume_Builder.entity.Resume;
import com.example.Resume_Builder.repository.ResumeRepository;
import jakarta.mail.Multipart;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class ResumeService {
    private final ResumeRepository resumeRepository;
    private final AuthService authService;

    public Resume createResume(CreateResumeRequest request, Object principleObject) {
        //Step 1: Create resume object
        Resume newResume = new Resume();

        //Step 2: Get the Current  profile
        AuthResponse response = authService.getProfile(principleObject);

        //Step 3: update the resume object
        newResume.setUserId(response.getId());
        newResume.setTitle(request.getTitle());

        //Step 4: Set default data for resume
        setDefaultResumeData(newResume);

        //Step 5: save the resume data
        Resume savedResume = resumeRepository.saveAndFlush(newResume);

        return resumeRepository.findById(savedResume.getId())
                .orElseThrow(() -> new RuntimeException("Resume not found"));
    }

    private void setDefaultResumeData(Resume newResume) {
        //newResume.setProfileInfo(new Resume.ProfileInfo());

        Resume.ProfileInfo profileInfo = new Resume.ProfileInfo();
        profileInfo.setFullName(" ");

        newResume.setProfileInfo(profileInfo);

        // newResume.setContactInfo(new Resume.ContactInfo());
        Resume.ContactInfo contactInfo = new Resume.ContactInfo();
        contactInfo.setEmail(" ");

        newResume.setContactInfo(contactInfo);

        //newResume.setTemplate(new Resume.Template());
        Resume.Template template = new Resume.Template();
        template.setColourPalette(new ArrayList<>());

        newResume.setTemplate(template);


        newResume.setWorkExperiences(new ArrayList<>());
        newResume.setEducations(new ArrayList<>());
        newResume.setSkills(new ArrayList<>());
        newResume.setProjects(new ArrayList<>());
        newResume.setCertification(new ArrayList<>());
        newResume.setLanguages(new ArrayList<>());
        newResume.setInterest(new ArrayList<>());


    }

    public List<Resume> getUserResumes(Object principal) {
        // Step 1: Get the current profile
        AuthResponse response = authService.getProfile(principal);

        // Step 2: call the repository finder method
        List<Resume> resume = resumeRepository.findByUserIdOrderByUpdatedAtDesc(response.getId());

        //Step 3: return response
        return resume;

    }

    public Resume getResumeById(String resumeId, Object principal) {
        //Step1: Get the Current Profile
        AuthResponse response = authService.getProfile(principal);

        //Step 2: Call the repo finder method
        Resume existingResume = resumeRepository.findByUserIdAndId(response.getId(), resumeId)
                .orElseThrow(() -> new RuntimeException("Resume not Found"));

        //Step 3: return result
        return existingResume;
    }

    public Resume updateResume(String resumeId, Resume updatedData, Object principal) {
        //Step 1: get the current profile
        AuthResponse response = authService.getProfile(principal);
        //Step 2: Call the Repository Finder Method
        Resume existingResume = resumeRepository.findByUserIdAndId(response.getId(), resumeId).orElseThrow(() -> new RuntimeException("Resume Not Found"));
        //Step 3: update the new data
        existingResume.setTitle(updatedData.getTitle());
        existingResume.setThumbnailLink(updatedData.getThumbnailLink());
        existingResume.setTemplate(updatedData.getTemplate());
        existingResume.setProfileInfo(updatedData.getProfileInfo());
        existingResume.setContactInfo(updatedData.getContactInfo());
        existingResume.setWorkExperiences(updatedData.getWorkExperiences());
        existingResume.setEducations(updatedData.getEducations());
        existingResume.setSkills(updatedData.getSkills());
        existingResume.setProjects(updatedData.getProjects());
        existingResume.setCertification(updatedData.getCertification());
        existingResume.setLanguages(updatedData.getLanguages());
        existingResume.setInterest(updatedData.getInterest());

        //Step 4: update the details into database
        resumeRepository.save(existingResume);
        // Step 5: return result
        return existingResume;
    }

    public void deleteResume(String resumeId, Object principal) {
        //Step 1:get the current profile
        AuthResponse response = authService.getProfile(principal);
        //Step 2: call the repo finder method
        Resume existingResume = resumeRepository.findByUserIdAndId(response.getId(), resumeId).orElseThrow(() -> new RuntimeException("Resume not found"));
        resumeRepository.delete(existingResume);
    }
}

