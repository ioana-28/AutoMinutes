package org.server.backend.model;

import jakarta.persistence.*;

@Entity
public class Summary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String text;

    @OneToOne
    @JoinColumn(name = "transcript_id", nullable = false)
    private Transcript transcript;

    public Summary() {}

    public Summary(String text, Transcript transcript) {
        this.text = text;
        this.transcript = transcript;
    }

    public Long getId() {
        return id;
    }

    public String getText() {
        return text;
    }

    public void setText(String text) {
        this.text = text;
    }

    public Transcript getTranscript() {
        return transcript;
    }

    public void setTranscript(Transcript transcript) {
        this.transcript = transcript;
    }
}
