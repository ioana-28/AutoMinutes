package org.server.backend.service;

import org.server.backend.dto.UserCreateRequestDto;
import org.server.backend.dto.UserResponseDto;
import org.server.backend.dto.UserUpdateRequestDto;
import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Role;
import org.server.backend.model.User;
import org.server.backend.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserResponseDto createUser(UserCreateRequestDto request) {
        String storedPassword = request.hashedPassword() != null ? request.hashedPassword() : request.password();
        if (storedPassword == null) {
            storedPassword = "";
        }

        User user = new User(request.email(), storedPassword, request.role(), request.activityStatus());
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());

        return toUserResponse(userRepository.save(user));
    }

    public List<UserResponseDto> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    public UserResponseDto updateUser(Long userId, UserUpdateRequestDto request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));

        if (request.firstName() != null) {
            user.setFirstName(request.firstName());
        }
        if (request.lastName() != null) {
            user.setLastName(request.lastName());
        }
        if (request.activityStatus() != null) {
            user.setActivityStatus(request.activityStatus());
        }
        if (request.role() != null) {
            user.setRole(request.role());
        }

        return toUserResponse(userRepository.save(user));
    }

    public UserResponseDto deleteUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found: " + userId));
        userRepository.delete(user);
        return toUserResponse(user);
    }

    public User getOrCreateUser(String name) {
        return new User(name, "", Role.USER, ActivityStatus.ACTIVE);
    }

    private UserResponseDto toUserResponse(User user) {
        return new UserResponseDto(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getActivityStatus());
    }
}
