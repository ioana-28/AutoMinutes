package org.server.backend.service;

import org.server.backend.dto.MeetingRequestDto;
import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Meeting;
import org.server.backend.model.Role;
import org.server.backend.model.Transcript;
import org.server.backend.model.User;
import org.server.backend.repository.MeetingRepository;
import org.server.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;

    public MeetingService(MeetingRepository meetingRepository, UserRepository userRepository) {
        this.meetingRepository = meetingRepository;
        this.userRepository = userRepository;
    }

    public Meeting createMeeting(MeetingRequestDto request) {
        User createdBy = new User("placeholder@example.com", "", Role.USER, ActivityStatus.ACTIVE);
        if (request.createdByUserId() != null) {
            createdBy.setId(request.createdByUserId());
        }

        String title = request.title() == null || request.title().isBlank() ? "Untitled meeting" : request.title();
        Meeting meeting = new Meeting(title, "Meeting not implemented yet.", createdBy);
        meeting.setTranscript(new Transcript("Transcript not implemented yet.", createdBy, meeting));
        return meeting;
    }

    public Meeting addParticipant(Long meetingId, Long userId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new IllegalArgumentException("Meeting not found: " + meetingId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        if (meeting.getParticipants().stream().noneMatch(participant -> participant.getId().equals(userId))) {
            meeting.getParticipants().add(user);
            meeting = meetingRepository.save(meeting);
        }

        return meeting;
    }
}
