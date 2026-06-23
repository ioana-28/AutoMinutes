package org.server.backend.controller;

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



    @PostMapping("/process/meeting/{meetingId}")
    public ResponseEntity<String> triggerAiProcessing(@PathVariable Long meetingId, @RequestParam(required = false) String target) {
        meetingService.processExistingTranscript(meetingId, target);
        return ResponseEntity.ok().body("AI processing completed");
    }
}