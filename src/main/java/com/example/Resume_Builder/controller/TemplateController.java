package com.example.Resume_Builder.controller;

import com.example.Resume_Builder.service.TemplateService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import javax.xml.transform.Templates;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/templates")
@Slf4j
public class TemplateController {
    private final TemplateService templateService;

    @GetMapping
    public ResponseEntity<?> getTemplate(Authentication authentication) {
        //Step 1: Call the Service Methods
        Map<String, Object> response = templateService.getTemplate(authentication.getPrincipal());
        //Step 2: Return the response
        return ResponseEntity.ok(response);
    }
}
