package org.server.backend.controller;

import org.jspecify.annotations.Nullable;
import org.server.backend.dto.AIRequestDto;
import org.server.backend.dto.AIResponseDto;
import org.server.backend.model.AIResponseFormat.TranscriptSummary;
import org.server.backend.service.AIService;
import org.server.backend.service.MeetingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;
    private final MeetingService meetingService;

    public AIController(AIService aiService, MeetingService meetingService) {
        this.aiService = aiService;
        this.meetingService = meetingService;
    }

    @PostMapping("/process/transcript/{transcriptId}")
    public AIResponseDto process(@PathVariable Long transcriptId) {
        return aiService.processTranscript(transcriptId);
    }

    @GetMapping("/generate")
    public @Nullable TranscriptSummary generate(@RequestBody AIRequestDto aiRequestDto) {
        return aiService.askAi(aiRequestDto.message());
    }

    @PostMapping("/process/meeting/{meetingId}")
    public ResponseEntity<String> triggerAiProcessing(@PathVariable Long meetingId) {
        meetingService.processExistingTranscript(meetingId);
        return ResponseEntity.accepted().body("AI processing initiated.");
    }
}