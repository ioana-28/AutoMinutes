package org.server.backend.dto;

public record ActionItemRequestDto(
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

