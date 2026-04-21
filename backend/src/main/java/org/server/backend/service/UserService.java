package org.server.backend.service;

import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Role;
import org.server.backend.model.User;
import org.springframework.stereotype.Service;

import java.util.Collections;
import java.util.List;

@Service
public class UserService {

    public List<User> getAllUsers() {
        return Collections.emptyList();
    }

    public User getOrCreateUser(String name) {
        return new User(name, "", Role.USER, ActivityStatus.ACTIVE, Collections.emptyList());
    }

    public User updateStatus(Long id, boolean active) {
        User placeholderUser = new User("placeholder@example.com", "", Role.USER,
                active ? ActivityStatus.ACTIVE : ActivityStatus.INACTIVE,  Collections.emptyList());
        placeholderUser.setId(id);
        return placeholderUser;
    }
}
