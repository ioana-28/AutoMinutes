package org.server.backend.dto;

import org.server.backend.model.ActivityStatus;

public record UpdateParticipantRequestDto(String firstName, String lastName, ActivityStatus activityStatus) {
}

