package org.server.backend.controller;

import org.server.backend.dto.UserCreateRequestDto;
import org.server.backend.dto.UserResponseDto;
import org.server.backend.dto.UserUpdateRequestDto;
import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Role;
import org.server.backend.model.User;
import org.server.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Create user (admin)
    @PostMapping
    public UserResponseDto createUser(@RequestBody UserCreateRequestDto request) {
        return userService.createUser(request);
    }

    // Get all users
    @GetMapping
    public List<UserResponseDto> getAllUsers() {
        return userService.getAllUsers();
    }

    // Get user by name (mock login)
    @GetMapping("/login")
    public UserResponseDto login(@RequestParam String name) {
        User user = new User(name, "pas123", Role.USER, ActivityStatus.ACTIVE);
        return new UserResponseDto(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getActivityStatus());
    }

    // Update safe fields (admin)
    @PutMapping("/{userId}")
    public UserResponseDto updateUser(@PathVariable Long userId, @RequestBody UserUpdateRequestDto request) {
        return userService.updateUser(userId, request);
    }

    // Delete user (admin)
    @DeleteMapping("/{userId}")
    public UserResponseDto deleteUser(@PathVariable Long userId) {
        return userService.deleteUser(userId);
    }

    // Activate / deactivate user (admin)
    @PutMapping("/{id}/status")
    public UserResponseDto updateStatus(@PathVariable Long id, @RequestParam boolean active) {
        UserUpdateRequestDto request = new UserUpdateRequestDto(null, null,
                active ? ActivityStatus.ACTIVE : ActivityStatus.INACTIVE, null);
        return userService.updateUser(id, request);
    }
}