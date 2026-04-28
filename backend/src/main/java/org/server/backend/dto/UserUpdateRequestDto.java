package org.server.backend.dto;

import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Role;

public record UserUpdateRequestDto(String firstName,
                                   String lastName,
                                   ActivityStatus activityStatus,
                                   Role role) {
}

