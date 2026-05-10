package org.server.backend.dto;

import java.time.LocalDate;

public record UpdateMeetingDateRequestDto(Long meetingId, LocalDate meetingDate) {
}
