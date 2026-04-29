package org.server.backend.controller;

import org.server.backend.dto.MeetingRequestDto;
import org.server.backend.model.Meeting;
import org.server.backend.service.MeetingService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/meetings")
public class MeetingController {

    private final MeetingService meetingService;

    public MeetingController(MeetingService meetingService) {
        this.meetingService = meetingService;
    }

    @PostMapping
    public Meeting createMeeting(@RequestBody MeetingRequestDto request) {
        return meetingService.createMeeting(request);
    }

    @GetMapping("/{meetingId}")
    public Meeting getMeeting(@PathVariable Long meetingId) {
        return meetingService.getMeetingById(meetingId);
    }

    @DeleteMapping("/{meetingId}")
    public void deleteMeeting(@PathVariable Long meetingId, @RequestParam(name = "confirm") boolean confirm) {
        meetingService.deleteMeeting(meetingId, confirm);
    }

    @PutMapping("/{meetingId}/title")
    public Meeting updateMeetingTitle(
            @PathVariable Long meetingId,
            @RequestParam(name = "confirm") boolean confirm,
            @RequestBody MeetingRequestDto request) {
        return meetingService.updateMeetingTitle(meetingId, confirm, request);
    }
}
