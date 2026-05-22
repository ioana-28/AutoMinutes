package org.server.backend.model;

public enum ActionItemStatus {
    OPEN,
    IN_PROGRESS,
    DONE;

    public static ActionItemStatus fromString(String value) {
        if (value == null) return null;
        for (ActionItemStatus status : ActionItemStatus.values()) {
            if (status.name().equalsIgnoreCase(value)) {
                return status;
            }
        }
        return null;
    }
}
