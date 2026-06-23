package org.server.backend.dto;

public record AuthDto(
        String token,
        String tokenType,
        long expiresIn,
        UserResponseDto user
) {}