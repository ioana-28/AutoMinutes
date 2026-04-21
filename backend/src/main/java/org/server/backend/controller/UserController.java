package org.server.backend.controller;

import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Role;
import org.server.backend.model.User;
import org.server.backend.service.UserService;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // Get all users
    @GetMapping
    public List<User> getAllUsers() {
        return Collections.emptyList();
    }

    // Get user by name (mock login)
    @GetMapping("/login")
    public User login(@RequestParam String name) {
        return new User(name, "pas123", Role.USER, ActivityStatus.ACTIVE, Collections.emptyList());
    }

    // Activate / deactivate user (admin)
    @PutMapping("/{id}/status")
    public User updateStatus(@PathVariable Long id, @RequestParam boolean active) {
        User placeholderUser = new User("placeholder@example.com", "", Role.USER,
                active ? ActivityStatus.ACTIVE : ActivityStatus.INACTIVE, new ArrayList<>());
        placeholderUser.setId(id);
        return placeholderUser;
    }
}