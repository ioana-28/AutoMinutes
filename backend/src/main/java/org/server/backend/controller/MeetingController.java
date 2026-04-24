package org.server.backend.controller;

import org.server.backend.dto.MeetingRequestDto;
import org.server.backend.model.Meeting;
import org.server.backend.service.MeetingService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
}

