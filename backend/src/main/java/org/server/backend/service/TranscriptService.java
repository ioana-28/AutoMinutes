package org.server.backend.service;

import org.server.backend.dto.TranscriptRequestDto;
import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Meeting;
import org.server.backend.model.Role;
import org.server.backend.model.Transcript;
import org.server.backend.model.User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class TranscriptService {

	public Transcript createTranscript(TranscriptRequestDto request) {
		User uploadedBy = new User("placeholder@example.com", "", Role.USER, ActivityStatus.ACTIVE);
		if (request.uploadedByUserId() != null) {
			uploadedBy.setId(request.uploadedByUserId());
		}

		Meeting meeting = new Meeting("Mock meeting", "Meeting not implemented yet.", uploadedBy);
		Transcript transcript = new Transcript(request.content(), uploadedBy, meeting);
		meeting.setTranscript(transcript);
		return transcript;
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
