package org.server.backend.service;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.poi.xwpf.extractor.XWPFWordExtractor;
import org.apache.poi.xwpf.usermodel.XWPFDocument;
import org.server.backend.dto.FileTextResponseDto;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.IOException;
import java.util.Locale;

@Service
public class FileProcessingService {

    private static final Logger LOGGER = LoggerFactory.getLogger(FileProcessingService.class);
    private static final int MIN_TEXT_LENGTH = 20;
    private static final long MAX_FILE_BYTES = 10L * 1024 * 1024;

    public FileTextResponseDto extractText(MultipartFile file) {
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "File is required.");
        }
        if (file.getSize() > MAX_FILE_BYTES) {
            throw new ResponseStatusException(HttpStatus.PAYLOAD_TOO_LARGE, "File too large.");
        }

        String fileName = file.getOriginalFilename();
        String contentType = file.getContentType();
        String normalizedName = fileName == null ? "" : fileName.toLowerCase(Locale.ROOT);

        LOGGER.info("Processing file: {} ({})", fileName, contentType);

        boolean isPdf = normalizedName.endsWith(".pdf");
        boolean isDocx = normalizedName.endsWith(".docx");


        if (!isPdf && !isDocx) {
            throw new ResponseStatusException(
                    HttpStatus.UNSUPPORTED_MEDIA_TYPE,
                    "Only PDF and DOCX files are supported."
            );
        }
            String text;
            if (isPdf) {
                text = extractFromPdf(file);
            } else {
                text = extractFromDocx(file);
            }

        return new FileTextResponseDto(file.getOriginalFilename(), file.getContentType(), text);


    }

    private String extractFromPdf(MultipartFile file) {
        try (PDDocument document = PDDocument.load(file.getInputStream())) {
            PDFTextStripper stripper = new PDFTextStripper();
            stripper.setSortByPosition(true);
            String text = stripper.getText(document);
            if (text == null || text.trim().length() < MIN_TEXT_LENGTH) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "PDF contains no readable text.");
            }
            return normalize(text);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to read PDF file.", ex);
        }
    }

    private String extractFromDocx(MultipartFile file) {
        try (XWPFDocument document = new XWPFDocument(file.getInputStream());
             XWPFWordExtractor extractor = new XWPFWordExtractor(document)) {
            String text = extractor.getText();
            if (text == null || text.trim().isEmpty()) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "DOCX contains no readable text.");
            }
            return normalize(text);
        } catch (IOException ex) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Failed to read DOCX file.", ex);
        }
    }

    private String normalize(String text) {
        return text
                .replaceAll("[\\r\\n]+", "\n")
                .replaceAll("\\s{2,}", " ")
                .trim();
    }
}
