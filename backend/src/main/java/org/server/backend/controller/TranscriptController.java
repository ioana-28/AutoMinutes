package org.server.backend.controller;

import org.server.backend.dto.TranscriptRequestDto;
import org.server.backend.dto.TranscriptResponseDto;
import org.server.backend.service.MinioService;
import org.server.backend.service.TranscriptService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transcripts")
public class TranscriptController {

    private final TranscriptService transcriptService;
    private final MinioService minioService;

    public TranscriptController(TranscriptService transcriptService,  MinioService minioService) {

        this.transcriptService = transcriptService;
        this.minioService = minioService;
    }

    @PostMapping
    public TranscriptResponseDto createTranscript(@RequestBody TranscriptRequestDto request) {
        return transcriptService.createTranscript(request);
    }

    @GetMapping
    public List<TranscriptResponseDto> getAll() {
        return transcriptService.getAll();
    }

    @GetMapping("/{meetingId}")
    public Optional<TranscriptResponseDto> getByMeetingId(@PathVariable Long meetingId) {
        return transcriptService.getByMeetingId(meetingId);
    }

    @GetMapping("/{meetingId}/file")
    public ResponseEntity<byte[]> getFileByMeetingId(@PathVariable Long meetingId) {
        // 1. Get the transcript metadata to find the filePath
        TranscriptResponseDto transcript = transcriptService.getByMeetingId(meetingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));

        // 2. Use MinioService to get the actual bytes
        byte[] fileBytes = minioService.getFileBytes(transcript.filePath());

        // 3. Return the bytes with the correct headers for the browser preview
        return ResponseEntity.ok()
                .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + transcript.fileName() + "\"")
                .contentType(MediaType.APPLICATION_PDF) // You can dynamically detect this if needed
                .body(fileBytes);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        transcriptService.delete(id);
    }
}