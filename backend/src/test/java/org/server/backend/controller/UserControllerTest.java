package org.server.backend.controller;

import org.junit.jupiter.api.Test;
import org.server.backend.dto.UserCreateRequestDto;
import org.server.backend.dto.UserResponseDto;
import org.server.backend.dto.UserUpdateRequestDto;
import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Role;
import org.server.backend.service.UserService;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class UserControllerTest {

    @Test
    void createUser_returnsUserResponse() {
        StubUserService stubUserService = new StubUserService();
        UserResponseDto expected = sampleUserResponse(Role.USER, ActivityStatus.ACTIVE);
        stubUserService.nextCreateResponse = expected;
        UserController controller = new UserController(stubUserService);

        UserCreateRequestDto request = new UserCreateRequestDto(
                "ana@example.com",
                "pass123",
                null,
                "Ana",
                "Pop",
                Role.USER,
                ActivityStatus.ACTIVE
        );

        UserResponseDto result = controller.createUser(request);

        assertNotNull(result);
        assertEquals(expected, result);
        assertEquals(request, stubUserService.lastCreateRequest);
    }

    @Test
    void getAllUsers_returnsUserResponseList() {
        StubUserService stubUserService = new StubUserService();
        List<UserResponseDto> expected = List.of(sampleUserResponse(Role.USER, ActivityStatus.ACTIVE));
        stubUserService.nextAllUsers = expected;
        UserController controller = new UserController(stubUserService);

        List<UserResponseDto> result = controller.getAllUsers();

        assertNotNull(result);
        assertEquals(expected, result);
    }

    @Test
    void updateUser_returnsUserResponse() {
        StubUserService stubUserService = new StubUserService();
        UserResponseDto expected = sampleUserResponse(Role.USER, ActivityStatus.ACTIVE);
        stubUserService.nextUpdateResponse = expected;
        UserController controller = new UserController(stubUserService);

        UserUpdateRequestDto request = new UserUpdateRequestDto(
                "Ana",
                "Pop",
                ActivityStatus.ACTIVE,
                Role.USER
        );

        UserResponseDto result = controller.updateUser(1L, request);

        assertNotNull(result);
        assertEquals(expected, result);
        assertEquals(1L, stubUserService.lastUpdateUserId);
        assertEquals(request, stubUserService.lastUpdateRequest);
    }

    @Test
    void deleteUser_returnsUserResponse() {
        StubUserService stubUserService = new StubUserService();
        UserResponseDto expected = sampleUserResponse(Role.USER, ActivityStatus.ACTIVE);
        stubUserService.nextDeleteResponse = expected;
        UserController controller = new UserController(stubUserService);

        UserResponseDto result = controller.deleteUser(1L);

        assertNotNull(result);
        assertEquals(expected, result);
        assertEquals(1L, stubUserService.lastDeleteUserId);
    }

    @Test
    void updateUser_allowsRoleChangeToAdmin() {
        StubUserService stubUserService = new StubUserService();
        UserResponseDto expected = sampleUserResponse(Role.ADMIN, ActivityStatus.ACTIVE);
        stubUserService.nextUpdateResponse = expected;
        UserController controller = new UserController(stubUserService);

        UserUpdateRequestDto request = new UserUpdateRequestDto(
                "Ana",
                "Pop",
                ActivityStatus.ACTIVE,
                Role.ADMIN
        );

        UserResponseDto result = controller.updateUser(2L, request);

        assertNotNull(result);
        assertEquals(expected, result);
        assertEquals(Role.ADMIN, stubUserService.lastUpdateRequest.role());
    }

    @Test
    void updateUser_allowsActivityStatusInactive() {
        StubUserService stubUserService = new StubUserService();
        UserResponseDto expected = sampleUserResponse(Role.USER, ActivityStatus.INACTIVE);
        stubUserService.nextUpdateResponse = expected;
        UserController controller = new UserController(stubUserService);

        UserUpdateRequestDto request = new UserUpdateRequestDto(
                "Ana",
                "Pop",
                ActivityStatus.INACTIVE,
                Role.USER
        );

        UserResponseDto result = controller.updateUser(3L, request);

        assertNotNull(result);
        assertEquals(expected, result);
        assertEquals(ActivityStatus.INACTIVE, stubUserService.lastUpdateRequest.activityStatus());
    }

    private static UserResponseDto sampleUserResponse(Role role, ActivityStatus status) {
        return new UserResponseDto(
                1L,
                "ana@example.com",
                "Ana",
                "Pop",
                role,
                status
        );
    }

    static class StubUserService extends UserService {
        private UserCreateRequestDto lastCreateRequest;
        private Long lastUpdateUserId;
        private UserUpdateRequestDto lastUpdateRequest;
        private Long lastDeleteUserId;

        private UserResponseDto nextCreateResponse;
        private List<UserResponseDto> nextAllUsers;
        private UserResponseDto nextUpdateResponse;
        private UserResponseDto nextDeleteResponse;

        StubUserService() {
            super(null);
        }

        @Override
        public UserResponseDto createUser(UserCreateRequestDto request) {
            this.lastCreateRequest = request;
            return nextCreateResponse;
        }

        @Override
        public List<UserResponseDto> getAllUsers() {
            return nextAllUsers;
        }

        @Override
        public UserResponseDto updateUser(Long userId, UserUpdateRequestDto request) {
            this.lastUpdateUserId = userId;
            this.lastUpdateRequest = request;
            return nextUpdateResponse;
        }

        @Override
        public UserResponseDto deleteUser(Long userId) {
            this.lastDeleteUserId = userId;
            return nextDeleteResponse;
        }
    }
}
