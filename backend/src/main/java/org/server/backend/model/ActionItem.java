package org.server.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class ActionItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String assignee;

    private String deadline;

    private String status;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "meeting_id", nullable = false)
    private Meeting meeting;

    public ActionItem() {}

    public ActionItem(String description, String assignee, String deadline, String status, Meeting meeting) {
        this.description = description;
        this.assignee = assignee;
        this.deadline = deadline;
        this.status = status;
        this.meeting = meeting;
    }

    public Long getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getAssignee() {
        return assignee;
    }

    public void setAssignee(String assignee) {
        this.assignee = assignee;
    }

    public String getDeadline() {
        return deadline;
    }

    public void setDeadline(String deadline) {
        this.deadline = deadline;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Meeting getMeeting() {
        return meeting;
    }

    public void setMeeting(Meeting meeting) {
        this.meeting = meeting;
    }
}
