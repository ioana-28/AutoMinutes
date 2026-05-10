package org.server.backend.model;

import jakarta.persistence.*;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "meetings")
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "meeting_date")
    private LocalDate meetingDate;

    @ManyToOne(optional = false)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @OneToOne(mappedBy = "meeting", cascade = CascadeType.ALL, orphanRemoval = true)
    private Transcript transcript;

    @ManyToMany(fetch = FetchType.LAZY)
    @Column(name = "participant_id")
    private List<User> participants = new ArrayList<>();

    @OneToMany(mappedBy = "meeting", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ActionItem> actionItems = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private ProcessingStatus aiStatus = ProcessingStatus.IDLE;

    public Meeting() {
    }

    public Meeting(String title, String description, User createdBy) {
        this.title = title;
        this.description = description;
        this.createdBy = createdBy;
    }

    public Long getId() {
        return id;
    }
    public void setId(Long id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }
    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }
    public void setDescription(String description) {
        this.description = description;
    }

    public LocalDate getMeetingDate() {
        return meetingDate;
    }
    public void setMeetingDate(LocalDate meetingDate) {
        this.meetingDate = meetingDate;
    }

    public User getCreatedBy() {
        return createdBy;
    }
    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public Transcript getTranscript() {
        return transcript;
    }
    public void setTranscript(Transcript transcript) {
        this.transcript = transcript;
    }

    public List<User> getParticipants() {
        return participants;
    }
    public void setParticipants(List<User> participants) {
        this.participants = participants;
    }

    public List<ActionItem> getActionItems() {
        return actionItems;
    }
    public void setActionItems(List<ActionItem> actionItems) {
        this.actionItems = actionItems;
    }

    public ProcessingStatus getAiStatus() { return aiStatus; }
    public void setAiStatus(ProcessingStatus aiStatus) { this.aiStatus = aiStatus; }
}
