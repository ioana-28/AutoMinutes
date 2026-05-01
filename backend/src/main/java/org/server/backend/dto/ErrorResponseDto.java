package org.server.backend.dto;

import java.time.LocalDateTime;

public record ErrorResponseDto(
        int status,
        String error,
        String message,
        LocalDateTime timestamp
) {
}

