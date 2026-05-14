package org.server.backend.dto;

import java.time.LocalDate;
import java.util.List;

public record MeetingResponseDto(Long id, String title, String description, UserResponseDto createdBy,
                                 List<UserResponseDto> participants,
                                 List<ActionItemResponseDto> actionItems,
                                 LocalDate meetingDate) {
}

