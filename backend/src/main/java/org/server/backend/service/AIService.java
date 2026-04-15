package org.server.backend.service;

import org.server.backend.controller.AIResponse;
import org.springframework.stereotype.Service;

@Service
public class AIService {

	public AIResponse processTranscript(Long transcriptId) {
		return new AIResponse("Processing not implemented yet.");
	}
}
