package org.server.backend.dto;

public record ActionItemResponseDto(
        Long id,
        String description,
        String assignee,
        Boolean hasPersonAssigned,
        String deadline,
        Boolean hasDeadline,
        Float assigneeConfidence,
        Float deadlineConfidence,
        Float statusConfidence,
        String status
) {
}

