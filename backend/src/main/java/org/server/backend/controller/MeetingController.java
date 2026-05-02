package org.server.backend.controller;

import org.server.backend.dto.ActionItemResponseDto;
import org.server.backend.dto.MeetingParticipantRequestDto;
import org.server.backend.dto.MeetingRequestDto;
import org.server.backend.dto.MeetingResponseDto;
import org.server.backend.dto.UpdateParticipantRequestDto;
import org.server.backend.dto.UserResponseDto;
import org.server.backend.dto.MeetingIdRequestDto;
import org.server.backend.dto.UpdateMeetingTitleRequestDto;
import org.server.backend.model.Meeting;
import org.server.backend.model.User;
import org.server.backend.service.MeetingService;
import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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

    @PutMapping("/{meetingId}/participants/{userId}")
    public UserResponseDto updateParticipant(@PathVariable Long meetingId,
                                             @PathVariable Long userId,
                                             @RequestBody UpdateParticipantRequestDto request) {
        return meetingService.updateParticipant(meetingId, userId, request);
    }

    private MeetingResponseDto toMeetingResponse(Meeting meeting) {
        List<UserResponseDto> participants = meeting.getParticipants().stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());

        List<ActionItemResponseDto> actionItems = meeting.getActionItems().stream()
                .map(item -> new ActionItemResponseDto(
                        item.getId(),
                        item.getDescription(),
                        item.getAssignee(),
                        item.isHasPersonAssigned(),
                        item.getDeadline(),
                        item.isHasDeadline(),
                        item.getAssigneeConfidence(),
                        item.getDeadlineConfidence(),
                        item.getStatusConfidence(),
                        item.getStatus()
                ))
                .collect(Collectors.toList());

        return new MeetingResponseDto(
                meeting.getId(),
                meeting.getTitle(),
                meeting.getDescription(),
                toUserResponse(meeting.getCreatedBy()),
                participants,
                actionItems
        );
    }

    private UserResponseDto toUserResponse(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getActivityStatus());
    }
    @GetMapping("/{meetingId}")
    public MeetingResponseDto getMeeting(@PathVariable Long meetingId) {
        return toMeetingResponse(meetingService.getMeetingById(new MeetingIdRequestDto(meetingId)));
    }

    @DeleteMapping("/{meetingId}")
    public void deleteMeeting(@PathVariable Long meetingId) {
        meetingService.deleteMeeting(new MeetingIdRequestDto(meetingId));
    }

    @PutMapping("/{meetingId}/title")
    public MeetingResponseDto updateMeetingTitle(
            @PathVariable Long meetingId,
            @RequestBody MeetingRequestDto request) {
        UpdateMeetingTitleRequestDto updateRequest = new UpdateMeetingTitleRequestDto(meetingId, request == null ? null : request.title());
        return toMeetingResponse(meetingService.updateMeetingTitle(updateRequest));
    }

    @PostMapping(value = "/create-with-transcript", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public MeetingResponseDto createWithTranscript(
            @RequestParam("title") String title,
            @RequestParam("userId") Long userId,
            @RequestParam("file") MultipartFile file) {

        // 1. Create the meeting
        MeetingRequestDto request = new MeetingRequestDto(title, userId);
        Meeting meeting = meetingService.createMeeting(request);

        // 2. Attach the transcript file to storage and DB
        meetingService.attachTranscript(meeting.getId(), file, userId);

        return toMeetingResponse(meeting);
    }
}
