package org.server.backend.model;

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

    @ManyToOne
    @JoinColumn(name = "transcript_id", nullable = false)
    private Transcript transcript;

    public ActionItem() {}

    public ActionItem(String description, String assignee, String deadline, String status, Transcript transcript) {
        this.description = description;
        this.assignee = assignee;
        this.deadline = deadline;
        this.status = status;
        this.transcript = transcript;
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

    public Transcript getTranscript() {
        return transcript;
    }

    public void setTranscript(Transcript transcript) {
        this.transcript = transcript;
    }
}
