package org.server.backend.service;

import org.server.backend.dto.TranscriptRequestDto;
import org.server.backend.dto.TranscriptResponseDto;
import org.server.backend.dto.UserResponseDto;
import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Meeting;
import org.server.backend.model.Role;
import org.server.backend.model.Transcript;
import org.server.backend.model.User;
import org.server.backend.repository.TranscriptRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class TranscriptService {

    private TranscriptRepository transcriptRepository;


    public TranscriptService(TranscriptRepository transcriptRepository) {
        this.transcriptRepository = transcriptRepository;
    }

    public TranscriptResponseDto createTranscript(TranscriptRequestDto request) {
        User uploadedBy = new User("placeholder@example.com", "", Role.USER, ActivityStatus.ACTIVE);
        if (request.uploadedByUserId() != null) {
            uploadedBy.setId(request.uploadedByUserId());
        }

        Meeting meeting = new Meeting("Mock meeting", "Meeting not implemented yet.", uploadedBy);
        Transcript transcript = new Transcript(request.content(), uploadedBy, meeting);
        meeting.setTranscript(transcript);
        return toResponse(transcript);
    }

    public List<TranscriptResponseDto> getAll() {
        return transcriptRepository.findAll().stream()
                .map(this::toResponse)
                .toList();
    }

    public Optional<TranscriptResponseDto> getByMeetingId(Long id) {
        return transcriptRepository.findByMeetingId(id).map(this::toResponse);
    }

    public void delete(Long id) {
        // Placeholder for future deletion logic.
    }

    private TranscriptResponseDto toResponse(Transcript transcript) {
        if (transcript == null) {
            return null;
        }

        User uploadedBy = transcript.getUploadedBy();
        UserResponseDto uploadedByResponse = uploadedBy == null ? null : new UserResponseDto(
                uploadedBy.getId(),
                uploadedBy.getEmail(),
                uploadedBy.getFirstName(),
                uploadedBy.getLastName(),
                uploadedBy.getRole(),
                uploadedBy.getActivityStatus()
        );

        Long meetingId = transcript.getMeeting() == null ? null : transcript.getMeeting().getId();

        return new TranscriptResponseDto(
                transcript.getId(),
                transcript.getContent(),
                transcript.getFileName(),
                transcript.getFilePath(),
                meetingId,
                uploadedByResponse
        );
    }
}
