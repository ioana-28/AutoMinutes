package org.server.backend.dto;

import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Role;

public record UserResponseDto(Long id, String email, Role role, ActivityStatus activityStatus) {
}

