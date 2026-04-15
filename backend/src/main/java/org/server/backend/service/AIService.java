package org.server.backend.service;

import org.server.backend.dto.AIResponseDto;
import org.springframework.stereotype.Service;

@Service
public class AIService {

	public AIResponseDto processTranscript(Long transcriptId) {
		return new AIResponseDto("Processing not implemented yet.");
	}
}
