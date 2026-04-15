package org.server.backend.dto;

public class TranscriptRequestDto {

    private String content;
    private Long uploadedByUserId;

    public TranscriptRequestDto() {
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getUploadedByUserId() {
        return uploadedByUserId;
    }

    public void setUploadedByUserId(Long uploadedByUserId) {
        this.uploadedByUserId = uploadedByUserId;
    }
}

