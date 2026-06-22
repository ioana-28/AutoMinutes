package org.server.backend.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.server.backend.dto.UserCreateRequestDto;
import org.server.backend.dto.UserResponseDto;
import org.server.backend.dto.UserUpdateRequestDto;
import org.server.backend.exception.BadRequestException;
import org.server.backend.exception.ResourceNotFoundException;
import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Role;
import org.server.backend.model.User;
import org.server.backend.repository.MeetingRepository;
import org.server.backend.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private MeetingRepository meetingRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Test
    void createUser_hashesPasswordAndSavesUser() {
        UserCreateRequestDto request = new UserCreateRequestDto(
                "john@example.com", "secret", null, "John", "Doe", Role.USER, ActivityStatus.ACTIVE
        );

        when(passwordEncoder.encode("secret")).thenReturn("hashedSecret");

        User savedUser = new User("john@example.com", "hashedSecret", Role.USER, ActivityStatus.ACTIVE);
        savedUser.setId(1L);
        savedUser.setFirstName("John");
        savedUser.setLastName("Doe");

        when(userRepository.save(any(User.class))).thenReturn(savedUser);

        UserResponseDto response = userService.createUser(request);

        assertNotNull(response);
        assertEquals(1L, response.id());
        assertEquals("john@example.com", response.email());
        assertEquals("John", response.firstName());

        verify(passwordEncoder).encode("secret");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void getAllUsers_returnsMappedList() {
        User user1 = new User("user1@test.com", "hash", Role.USER, ActivityStatus.ACTIVE);
        user1.setId(1L);
        User user2 = new User("user2@test.com", "hash", Role.ADMIN, ActivityStatus.INACTIVE);
        user2.setId(2L);

        when(userRepository.findAll()).thenReturn(List.of(user1, user2));

        List<UserResponseDto> result = userService.getAllUsers();

        assertEquals(2, result.size());
        assertEquals(1L, result.get(0).id());
        assertEquals(Role.ADMIN, result.get(1).role());
        verify(userRepository).findAll();
    }

    @Test
    void updateUser_updatesFieldsAndSaves() {
        Long userId = 1L;
        User existingUser = new User("john@example.com", "hash", Role.USER, ActivityStatus.ACTIVE);
        existingUser.setId(userId);
        existingUser.setFirstName("John");
        existingUser.setLastName("Doe");

        UserUpdateRequestDto request = new UserUpdateRequestDto(
                "Johnny", null, ActivityStatus.INACTIVE, Role.ADMIN
        );

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> invocation.getArgument(0));

        UserResponseDto response = userService.updateUser(userId, request);

        assertEquals("Johnny", response.firstName()); // Updated
        assertEquals("Doe", response.lastName());     // Left unchanged
        assertEquals(ActivityStatus.INACTIVE, response.activityStatus()); // Updated
        assertEquals(Role.ADMIN, response.role()); // Updated

        verify(userRepository).save(existingUser);
    }

    @Test
    void updateUser_throwsBadRequestIfAllFieldsNull() {
        Long userId = 1L;
        UserUpdateRequestDto emptyRequest = new UserUpdateRequestDto(null, null, null, null);

        assertThrows(BadRequestException.class, () -> userService.updateUser(userId, emptyRequest));
        verify(userRepository, never()).save(any());
    }

    @Test
    void updateUser_throwsNotFoundIfUserDoesNotExist() {
        Long userId = 99L;
        UserUpdateRequestDto request = new UserUpdateRequestDto("Name", null, null, null);
        when(userRepository.findById(userId)).thenReturn(Optional.empty());

        assertThrows(ResourceNotFoundException.class, () -> userService.updateUser(userId, request));
    }

    @Test
    void deleteUser_deletesIfNoMeetingsAttached() {
        Long userId = 1L;
        User existingUser = new User("john@example.com", "hash", Role.USER, ActivityStatus.ACTIVE);
        existingUser.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(meetingRepository.existsByCreatedBy_Id(userId)).thenReturn(false);
        when(meetingRepository.existsByParticipants_Id(userId)).thenReturn(false);

        UserResponseDto response = userService.deleteUser(userId);

        assertEquals(userId, response.id());
        verify(userRepository).delete(existingUser);
    }

    @Test
    void deleteUser_throwsBadRequestIfUserIsMeetingCreator() {
        Long userId = 1L;
        User existingUser = new User("john@example.com", "hash", Role.USER, ActivityStatus.ACTIVE);
        existingUser.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(meetingRepository.existsByCreatedBy_Id(userId)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> userService.deleteUser(userId));
        verify(userRepository, never()).delete(any());
    }

    @Test
    void deleteUser_throwsBadRequestIfUserIsMeetingParticipant() {
        Long userId = 1L;
        User existingUser = new User("john@example.com", "hash", Role.USER, ActivityStatus.ACTIVE);
        existingUser.setId(userId);

        when(userRepository.findById(userId)).thenReturn(Optional.of(existingUser));
        when(meetingRepository.existsByCreatedBy_Id(userId)).thenReturn(false);
        when(meetingRepository.existsByParticipants_Id(userId)).thenReturn(true);

        assertThrows(BadRequestException.class, () -> userService.deleteUser(userId));
        verify(userRepository, never()).delete(any());
    }

    @Test
    void getOrCreateUser_createsBasicUserInstance() {
        User user = userService.getOrCreateUser("TestUser");

        assertEquals("TestUser", user.getEmail()); // Based on your current implementation mapping name to email
        assertEquals(Role.USER, user.getRole());
    }
}