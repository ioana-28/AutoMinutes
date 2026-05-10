package org.server.backend.dto;

import org.server.backend.model.ProcessingStatus;

import java.time.LocalDate;
import java.util.List;

public record MeetingDetailsResponseDto(
        Long id,
        String title,
        String description,
        UserResponseDto createdBy,
        List<UserResponseDto> participants,
        List<ActionItemResponseDto> actionItems,
        TranscriptResponseDto transcript,
        ProcessingStatus aiStatus,
        LocalDate meetingDate
) {
}
