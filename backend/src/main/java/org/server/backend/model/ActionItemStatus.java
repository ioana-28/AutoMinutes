package org.server.backend.model;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonValue;

public enum ActionItemStatus {
    OPEN("Open"),
    IN_PROGRESS("In Progress"),
    DONE("Done");

    private final String label;

    ActionItemStatus(String label) {
        this.label = label;
    }

    @JsonValue
    public String getLabel() {
        return label;
    }

    @JsonCreator
    public static ActionItemStatus fromString(String value) {
        if (value == null) return null;
        for (ActionItemStatus status : ActionItemStatus.values()) {
            if (status.label.equalsIgnoreCase(value) || status.name().equalsIgnoreCase(value)) {
                return status;
            }
        }
        return null;
    }
}
