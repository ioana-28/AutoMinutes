package org.server.backend.controller;

import org.server.backend.model.Transcript;
import org.server.backend.service.TranscriptService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/transcripts")
public class TranscriptController {

    private final TranscriptService transcriptService;

    public TranscriptController(TranscriptService transcriptService) {
        this.transcriptService = transcriptService;
    }

    // Upload transcript
    @PostMapping
    public Transcript createTranscript(@RequestBody TranscriptRequest request) {
        return transcriptService.createTranscript(request);
    }

    // Get all transcripts
    @GetMapping
    public List<Transcript> getAll() {
        return transcriptService.getAll();
    }

    // Get by ID
    @GetMapping("/{id}")
    public Transcript getById(@PathVariable Long id) {
        return transcriptService.getById(id);
    }

    // Delete
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        transcriptService.delete(id);
    }
}