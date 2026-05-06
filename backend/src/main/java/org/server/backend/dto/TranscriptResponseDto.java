package org.server.backend.dto;

public record TranscriptResponseDto(
        Long id,
        String content,
        String fileName,
        String filePath,
        Long meetingId,
        UserResponseDto uploadedBy
) {
}

