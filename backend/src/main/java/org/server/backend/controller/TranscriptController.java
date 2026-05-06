package org.server.backend.controller;

import org.server.backend.dto.TranscriptRequestDto;
import org.server.backend.dto.TranscriptResponseDto;
import org.server.backend.service.TranscriptService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/transcripts")
public class TranscriptController {

    private final TranscriptService transcriptService;

    public TranscriptController(TranscriptService transcriptService) {
        this.transcriptService = transcriptService;
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

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        transcriptService.delete(id);
    }
}