package org.server.backend.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
public class Transcript {

    @Id
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne(optional = false)
    @JoinColumn(name = "uploaded_by", nullable = false)
    private User uploadedBy;

    @JsonIgnore
    @OneToOne(optional = false)
    @MapsId
    @JoinColumn(name = "id")
    private Meeting meeting;

    public Transcript(String content, User uploadedBy) {
        this.content = content;
        this.uploadedBy = uploadedBy;
    }

    public Transcript(String content, User uploadedBy, Meeting meeting) {
        this.content = content;
        this.uploadedBy = uploadedBy;
        this.meeting = meeting;
    }

    public Transcript() {
    }

    public Long getId() { return id; }

    public void setId(Long id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }


    public User getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(User uploadedBy) { this.uploadedBy = uploadedBy; }

    public Meeting getMeeting() { return meeting; }
    public void setMeeting(Meeting meeting) { this.meeting = meeting; }
}