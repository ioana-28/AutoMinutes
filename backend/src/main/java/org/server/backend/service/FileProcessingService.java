package org.server.backend.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.server.backend.dto.FileTextResponseDto;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Locale;

@Service
public class FileProcessingService {

    private static final int MIN_TEXT_LENGTH = 50;
    private static final String EMPTY_TRANSCRIPT_MSG = "Transcript has no readable text.";

    public FileTextResponseDto extractText(MultipartFile file) {
        // Guard Clause: Check if the multipart file itself is physically empty
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, EMPTY_TRANSCRIPT_MSG);
        }

        try {
            String text = extractTextFromStream(file.getInputStream(), file.getOriginalFilename());
            return new FileTextResponseDto(file.getOriginalFilename(), file.getContentType(), text);
        } catch (IOException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to read upload", e);
        }
    }

    public String extractTextFromStream(java.io.InputStream inputStream, String fileName) {
        String normalizedName = fileName == null ? "" : fileName.toLowerCase(Locale.ROOT);
        boolean isPdf = normalizedName.endsWith(".pdf");
        boolean isDocx = normalizedName.endsWith(".docx");

        if (!isPdf && !isDocx) {
            throw new ResponseStatusException(HttpStatus.UNSUPPORTED_MEDIA_TYPE, "Unsupported file type.");
        }

        return isPdf ? extractFromPdf(inputStream) : extractFromDocx(inputStream);
    }

    private String extractFromPdf(java.io.InputStream inputStream) {
        try (PDDocument document = PDDocument.load(inputStream)) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            
            String text = stripper.getText(document);
            String normalized = normalize(text);
            
            if (normalized.isEmpty() || normalized.length() < MIN_TEXT_LENGTH) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, EMPTY_TRANSCRIPT_MSG);
            }
            return normalized;
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to read PDF.", ex);
        }
    }

    private String extractFromDocx(java.io.InputStream inputStream) {
        try (XWPFDocument document = new XWPFDocument(inputStream);
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            
            String text = extractor.getText();
            String normalized = normalize(text);
            
            if (normalized.isEmpty() || normalized.length() < MIN_TEXT_LENGTH) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, EMPTY_TRANSCRIPT_MSG);
            }
            return normalized;
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to read DOCX.", ex);
        }
    }

    private String normalize(String text) {
        // Handle physical null values or Apache POI literal "null" text dumps safely
        if (text == null || "null".equalsIgnoreCase(text.trim())) {
            return "";
        }
        
        // Strip out literal "null" fragments that POI generates for empty paragraphs/tables
        String cleaned = text.replaceAll("(?i)\\bnull\\b", "").trim();

        return cleaned
                .replaceAll("[\\r\\n]+", "\n")
                .replaceAll("\\s{2,}", " ")
                .trim();
    }
}