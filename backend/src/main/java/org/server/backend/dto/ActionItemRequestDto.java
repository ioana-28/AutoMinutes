package org.server.backend.dto;

import java.time.LocalDate;

public record ActionItemRequestDto(
        String description,
        String assignee,
        Long assigneeUserId,
        Boolean hasPersonAssigned,
        LocalDate deadline,
        Boolean hasDeadline,
        Float assigneeConfidence,
        Float deadlineConfidence,
        Float statusConfidence,
        String status
) {
}
