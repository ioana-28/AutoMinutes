package org.server.backend.controller;

import org.server.backend.dto.AIResponseDto;
import org.server.backend.service.AIService;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}