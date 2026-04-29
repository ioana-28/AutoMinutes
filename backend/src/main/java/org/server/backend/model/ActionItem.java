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

    private Float assigneeConfidence;

    private Float deadlineConfidence;

    private Float statusConfidence;

    @JsonIgnore
    @ManyToOne(optional = false)
    @JoinColumn(name = "meeting_id", nullable = false)
    private Meeting meeting;


    public ActionItem() {}

    public ActionItem(String description, String assignee, String deadline, String status, Meeting meeting, Float assigneeConfidence, Float deadlineConfidence, Float statusConfidence) {
        this.description = description;
        this.assignee = assignee;
        this.deadline = deadline;
        this.status = status;
        this.meeting = meeting;
        this.assigneeConfidence = assigneeConfidence;
        this.deadlineConfidence = deadlineConfidence;
        this.statusConfidence = statusConfidence;
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

    public Float getAssigneeConfidence() {
        return assigneeConfidence;
    }

    public void setAssigneeConfidence(Float assigneeConfidence) {
        this.assigneeConfidence = assigneeConfidence;
    }

    public Float getDeadlineConfidence() {
        return deadlineConfidence;
    }

    public void setDeadlineConfidence(Float deadlineConfidence) {
        this.deadlineConfidence = deadlineConfidence;
    }

    public Float getStatusConfidence() {
        return statusConfidence;
    }

    public void setStatusConfidence(Float statusConfidence) {
        this.statusConfidence = statusConfidence;
    }
    public Meeting getMeeting() {
        return meeting;
    }

    public void setMeeting(Meeting meeting) {
        this.meeting = meeting;
    }
}
