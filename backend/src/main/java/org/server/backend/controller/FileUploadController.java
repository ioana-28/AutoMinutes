package org.server.backend.controller;

import org.server.backend.dto.FileTextResponseDto;
import org.server.backend.service.FileProcessingService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/api/files")
public class FileUploadController {

    private final FileProcessingService fileProcessingService;

    public FileUploadController(FileProcessingService fileProcessingService) {
        this.fileProcessingService = fileProcessingService;
    }

    @PostMapping(value = "/upload", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public FileTextResponseDto uploadFile(@RequestParam("file") MultipartFile file) {
        String text = fileProcessingService.extractText(file);
        return new FileTextResponseDto(file.getOriginalFilename(), file.getContentType(), text);
    }
}

