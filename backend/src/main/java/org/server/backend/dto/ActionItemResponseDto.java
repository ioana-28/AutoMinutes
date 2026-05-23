package org.server.backend.dto;

import org.server.backend.model.ActionItemStatus;
import java.time.LocalDate;

public record ActionItemResponseDto(
        Long id,
        String description,
        String assignee,
        Long assigneeUserId,
        Boolean hasPersonAssigned,
        LocalDate deadline,
        Boolean hasDeadline,
        Float assigneeConfidence,
        Float deadlineConfidence,
        Float statusConfidence,
        ActionItemStatus status,
        ActionItemStatus previousStatus
) {
}
