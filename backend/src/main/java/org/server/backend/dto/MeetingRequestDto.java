package org.server.backend.dto;

import java.time.LocalDate;

public record MeetingRequestDto(String title, Long createdByUserId, LocalDate meetingDate) {
}

