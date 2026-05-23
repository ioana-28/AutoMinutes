package org.server.backend.dto;

public record TranscriptRequestDto(String content, Long uploadedByUserId, Long meetingId) {
}

