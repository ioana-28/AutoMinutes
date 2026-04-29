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

    private boolean hasPersonAssigned;

    private boolean hasDeadline;

    private float assigneeConfidence;

    private float deadlineConfidence;

    private float statusConfidence;

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

    public boolean isHasDeadline() {
        return hasDeadline;
    }

    public void setHasDeadline(boolean hasDeadline) {
        this.hasDeadline = hasDeadline;
    }

    public boolean isHasPersonAssigned() {
        return hasPersonAssigned;
    }

    public void setHasPersonAssigned(boolean hasPersonAssigned) {
        this.hasPersonAssigned = hasPersonAssigned;
    }

    public float getAssigneeConfidence() {
        return assigneeConfidence;
    }

    public void setAssigneeConfidence(float assigneeConfidence) {
        this.assigneeConfidence = assigneeConfidence;
    }

    public float getDeadlineConfidence() {
        return deadlineConfidence;
    }

    public void setDeadlineConfidence(float deadlineConfidence) {
        this.deadlineConfidence = deadlineConfidence;
    }

    public float getStatusConfidence() {
        return statusConfidence;
    }

    public void setStatusConfidence(float statusConfidence) {
        this.statusConfidence = statusConfidence;
    }

    public Meeting getMeeting() {
        return meeting;
    }

    public void setMeeting(Meeting meeting) {
        this.meeting = meeting;
    }
}
