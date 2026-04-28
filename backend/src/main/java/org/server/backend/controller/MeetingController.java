package org.server.backend.controller;

import org.server.backend.dto.MeetingParticipantRequestDto;
import org.server.backend.dto.MeetingRequestDto;
import org.server.backend.dto.MeetingResponseDto;
import org.server.backend.dto.UserResponseDto;
import org.server.backend.model.Meeting;
import org.server.backend.model.User;
import org.server.backend.service.MeetingService;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {

    private final MeetingService meetingService;

    public MeetingController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    @PostMapping
    public MeetingResponseDto createMeeting(@RequestBody MeetingRequestDto request) {
        return toMeetingResponse(meetingService.createMeeting(request));
    }

    @PostMapping("/{meetingId}/participants")
    public MeetingResponseDto addParticipant(@PathVariable Long meetingId, @RequestBody MeetingParticipantRequestDto request) {
        return toMeetingResponse(meetingService.addParticipant(meetingId, request.userId()));
    }

    @GetMapping("/{meetingId}/participants")
    public List<UserResponseDto> getParticipants(@PathVariable Long meetingId) {
        return meetingService.getParticipants(meetingId);
    }

    @DeleteMapping("/{meetingId}/participants/{userId}")
    public MeetingResponseDto removeParticipant(@PathVariable Long meetingId, @PathVariable Long userId) {
        return toMeetingResponse(meetingService.removeParticipant(meetingId, userId));
    }

    private MeetingResponseDto toMeetingResponse(Meeting meeting) {
        List<UserResponseDto> participants = meeting.getParticipants().stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());

        return new MeetingResponseDto(
                meeting.getId(),
                meeting.getTitle(),
                meeting.getDescription(),
                toUserResponse(meeting.getCreatedBy()),
                participants
        );
    }

    private UserResponseDto toUserResponse(User user) {
        return new UserResponseDto(user.getId(), user.getEmail(), user.getRole(), user.getActivityStatus());
    }
}
