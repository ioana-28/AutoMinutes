package org.server.backend.service;

import org.server.backend.dto.MeetingIdRequestDto;
import org.server.backend.dto.MeetingRequestDto;
import org.server.backend.dto.UpdateParticipantRequestDto;
import org.server.backend.dto.UpdateMeetingTitleRequestDto;
import org.server.backend.dto.UserResponseDto;
import org.server.backend.exception.BadRequestException;
import org.server.backend.exception.ResourceNotFoundException;
import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Meeting;
import org.server.backend.model.User;
import org.server.backend.repository.MeetingRepository;
import org.server.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;

    public MeetingService(MeetingRepository meetingRepository, UserRepository userRepository) {
        this.meetingRepository = meetingRepository;
        this.userRepository = userRepository;
    }

    public Meeting createMeeting(MeetingRequestDto request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Meeting request is required.");
        }
        if (request.createdByUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CreatedByUserId is required.");
        }

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
        meeting.setParticipants(new java.util.ArrayList<>());
        meeting.setActionItems(null);
        return meetingRepository.save(meeting);
    }

    public Meeting getMeetingById(MeetingIdRequestDto request) {
        if (request == null || request.meetingId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Meeting id is required.");
        }

        return meetingRepository.findById(request.meetingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found."));
    }

    public void deleteMeeting(MeetingIdRequestDto request) {
        if (request == null || request.meetingId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Meeting id is required.");
        }

        if (!meetingRepository.existsById(request.meetingId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found.");
        }

        meetingRepository.deleteById(request.meetingId());
    }

    public Meeting updateMeetingTitle(UpdateMeetingTitleRequestDto request) {
        if (request == null || request.meetingId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Meeting id is required.");
        }

        Meeting meeting = meetingRepository.findById(request.meetingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found."));

        if (request.title() == null || request.title().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Meeting title is required.");
        }

        meeting.setTitle(request.title().trim());
        return meetingRepository.save(meeting);
    }

    public Meeting addParticipant(Long meetingId, Long userId) {
        if (userId == null) {
            throw new BadRequestException("User id is required");
        }
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting not found: " + meetingId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (meeting.getParticipants().stream().noneMatch(participant -> participant.getId().equals(userId))) {
            meeting.getParticipants().add(user);
            meeting = meetingRepository.save(meeting);
        }

        return meeting;
    }

    public List<UserResponseDto> getParticipants(Long meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting not found: " + meetingId));

        return meeting.getParticipants().stream()
                .map(user -> new UserResponseDto(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getRole(),
                        user.getActivityStatus()))
                .collect(Collectors.toList());
    }

    public Meeting removeParticipant(Long meetingId, Long userId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting not found: " + meetingId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        meeting.getParticipants().removeIf(participant -> participant.getId().equals(user.getId()));
        return meetingRepository.save(meeting);
    }

    public UserResponseDto updateParticipant(Long meetingId, Long userId, UpdateParticipantRequestDto request) {
        if (request == null || (request.firstName() == null
                && request.lastName() == null
                && request.activityStatus() == null)) {
            throw new BadRequestException("At least one field must be provided for update");
        }
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting not found: " + meetingId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        boolean isParticipant = meeting.getParticipants().stream()
                .anyMatch(participant -> participant.getId().equals(userId));
        if (!isParticipant) {
            throw new ResourceNotFoundException("User is not a participant in meeting: " + meetingId);
        }

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setActivityStatus(request.activityStatus());
        user = userRepository.save(user);

        return new UserResponseDto(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getActivityStatus());
    }
}
