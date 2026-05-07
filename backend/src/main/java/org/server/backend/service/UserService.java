package org.server.backend.service;

import org.server.backend.dto.UserCreateRequestDto;
import org.server.backend.dto.UserResponseDto;
import org.server.backend.dto.UserUpdateRequestDto;
import org.server.backend.exception.BadRequestException;
import org.server.backend.exception.ResourceNotFoundException;
import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Role;
import org.server.backend.model.User;
import org.server.backend.repository.UserRepository;
import org.server.backend.repository.MeetingRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final MeetingRepository meetingRepository;

    public UserService(UserRepository userRepository, MeetingRepository meetingRepository) {
        this.userRepository = userRepository;
        this.meetingRepository = meetingRepository;
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
        if (request == null || (request.firstName() == null
                && request.lastName() == null
                && request.activityStatus() == null
                && request.role() == null)) {
            throw new BadRequestException("At least one field must be provided for update");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

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
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (meetingRepository.existsByCreatedBy_Id(userId)) {
            throw new BadRequestException("User is the creator of one or more meetings. Delete or reassign meetings first.");
        }
        if (meetingRepository.existsByParticipants_Id(userId)) {
            throw new BadRequestException("User is a participant in one or more meetings. Remove the user from meetings first.");
        }

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
