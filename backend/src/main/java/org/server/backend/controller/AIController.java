package org.server.backend.controller;

import org.jspecify.annotations.Nullable;
import org.server.backend.dto.AIRequestDto;
import org.server.backend.dto.AIResponseDto;
import org.server.backend.dto.TranscriptSummary;
import org.server.backend.service.AIService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/process/{transcriptId}")
    public AIResponseDto process(@PathVariable Long transcriptId) {
        return aiService.processTranscript(transcriptId);
    }

    @GetMapping("/generate")
    public @Nullable TranscriptSummary generate(@RequestBody AIRequestDto aiRequestDto) {
        return aiService.askAi(aiRequestDto.message());
    }
}