package org.server.backend.controller;

public class AIResponse {

    private String message;

    public AIResponse() {
    }

    public AIResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}

