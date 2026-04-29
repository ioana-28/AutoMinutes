package org.server.backend.service;

import org.server.backend.dto.MeetingRequestDto;
import org.server.backend.model.Meeting;
import org.server.backend.model.User;
import org.server.backend.repository.MeetingRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class MeetingService {

    private final MeetingRepository meetingRepository;

    public MeetingService(MeetingRepository meetingRepository) {
        this.meetingRepository = meetingRepository;
    }

    public Meeting createMeeting(MeetingRequestDto request) {
        User createdBy = new User();
        if (request.createdByUserId() != null) {
            createdBy.setId(request.createdByUserId());
        }

        String title = request.title() == null || request.title().isBlank() ? "Untitled meeting" : request.title();
        Meeting meeting = new Meeting();
        meeting.setTitle(title);
        meeting.setCreatedBy(createdBy);
        meeting.setDescription(null);
        meeting.setTranscript(null);
        meeting.setParticipants(null);
        meeting.setActionItems(null);
        return meetingRepository.save(meeting);
    }

    public Meeting getMeetingById(Long meetingId) {
        return meetingRepository.findById(meetingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found."));
    }

    public void deleteMeeting(Long meetingId, boolean confirm) {
        if (!confirm) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Confirmation required to delete meeting.");
        }

        if (!meetingRepository.existsById(meetingId)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found.");
        }

        meetingRepository.deleteById(meetingId);
    }

    public Meeting updateMeetingTitle(Long meetingId, boolean confirm, MeetingRequestDto request) {
        if (!confirm) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Confirmation required to update meeting title.");
        }

        String title = request.title();
        if (title == null || title.isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Title is required.");
        }

        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found."));

        meeting.setTitle(title);
        return meetingRepository.save(meeting);
    }
}
