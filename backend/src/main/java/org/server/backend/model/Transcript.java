package org.server.backend.model;

import jakarta.persistence.*;

@Entity
public class Transcript {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String content;

    @ManyToOne
    @JoinColumn(name = "uploaded_by")
    private User uploadedBy;

    public Transcript(String content, User uploadedBy) {
        this.content = content;
        this.uploadedBy = uploadedBy;
    }

    public Transcript() {

    }

    public Long getId() { return id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public User getUploadedBy() { return uploadedBy; }
    public void setUploadedBy(User uploadedBy) { this.uploadedBy = uploadedBy; }
}