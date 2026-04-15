package org.server.backend.dto;

public class AIResponseDto {

    private String message;

    public AIResponseDto() {
    }

    public AIResponseDto(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

