package org.server.backend.model;

import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String hashedPassword;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Role role;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ActivityStatus activityStatus;

    private String firstName;

    private String lastName;

    public User () {}

    public User(String email, String hashedPassword, Role role, ActivityStatus activityStatus) {
        this.email = email;
        this.hashedPassword = hashedPassword;
        this.role = role;
        this.activityStatus = activityStatus;
    }

    public Long getId () {
        return id;
    }

    public void setId (Long id) {
        this.id = id;
    }

    public String getEmail () {
        return email;
    }

    public void setEmail (String email) {
        this.email = email;
    }

    public String getHashedPassword () {
        return hashedPassword;
    }

    public void setHashedPassword (String hashedPassword) {
        this.hashedPassword = hashedPassword;
    }

    public Role getRole () {
        return role;
    }

    public void setRole (Role role) {
        this.role = role;
    }

    public ActivityStatus getActivityStatus () {
        return activityStatus;
    }

    public void setActivityStatus (ActivityStatus activityStatus) {
        this.activityStatus = activityStatus;
    }

    public String getFirstName() {
        return firstName;
    }

    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    public String getLastName() {
        return lastName;
    }

    public void setLastName(String lastName) {
        this.lastName = lastName;
    }

}
