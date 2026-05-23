package org.server.backend.dto;

import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Role;

public record UserResponseDto(
        Long id,
        String email,
        String firstName,
        String lastName,
        Role role,
        ActivityStatus activityStatus) {
}
