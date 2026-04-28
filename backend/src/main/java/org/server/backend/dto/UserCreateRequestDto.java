package org.server.backend.dto;

import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Role;

public record UserCreateRequestDto(String email,
                                   String password,
                                   String hashedPassword,
                                   String firstName,
                                   String lastName,
                                   Role role,
                                   ActivityStatus activityStatus) {
}

