package org.server.backend.dto;

public record FileTextResponseDto(String fileName, String contentType, String text) {
}

