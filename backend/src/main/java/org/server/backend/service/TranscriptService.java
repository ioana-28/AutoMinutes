package org.server.backend.service;

import org.server.backend.controller.TranscriptRequest;
import org.server.backend.model.Transcript;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class TranscriptService {

	public Transcript createTranscript(TranscriptRequest request) {
		return new Transcript();
	}

	public List<Transcript> getAll() {
		return Collections.emptyList();
	}

	public Transcript getById(Long id) {
		return null;
	}

	public void delete(Long id) {
		// Placeholder for future deletion logic.
	}
}
