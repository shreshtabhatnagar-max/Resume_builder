package com.example.Resume_Builder.service;
import org.apache.pdfbox.Loader;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.io.InputStream;
@Service
public class ResumeParserService {

    public String extractText(MultipartFile file) throws IOException {
        String filename = file.getOriginalFilename();
        if (filename == null) {
            throw new IllegalArgumentException("File name is missing");
        }

        if (filename.toLowerCase().endsWith(".pdf")) {
            return extractFromPdf(file);
        } else if (filename.toLowerCase().endsWith(".docx")) {
            return extractFromDocx(file);
        } else {
            throw new IllegalArgumentException("Unsupported file type. Please upload PDF or DOCX.");
        }
    }

    private String extractFromPdf(MultipartFile file) throws IOException {
        try (var document = Loader.loadPDF(file.getBytes())) {
            PDFTextStripper stripper = new PDFTextStripper();
            return stripper.getText(document);
        }
    }

    private String extractFromDocx(MultipartFile file) throws IOException {
        try (InputStream is = file.getInputStream();
             XWPFDocument document = new XWPFDocument(is);
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            return extractor.getText();
        }
    }
}

