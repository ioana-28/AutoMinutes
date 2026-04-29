package org.server.backend.dto;

import java.util.List;

public record MeetingResponseDto(Long id, String title, String description, UserResponseDto createdBy,
                                 List<UserResponseDto> participants) {
}

