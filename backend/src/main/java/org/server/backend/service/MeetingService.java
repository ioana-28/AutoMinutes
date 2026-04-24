package org.server.backend.service;

import org.server.backend.dto.MeetingRequestDto;
import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Meeting;
import org.server.backend.model.Role;
import org.server.backend.model.Transcript;
import org.server.backend.model.User;
import org.springframework.stereotype.Service;

@Service
public class MeetingService {

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
}
