package org.server.backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;

public record ActionItem(
        @JsonProperty("description")
        @JsonPropertyDescription("action_item_description")
        String description,
        @JsonProperty("assignee")
        @JsonPropertyDescription("person_assigned_to_action_item")
        String assignee,
        @JsonProperty("has_person_assigned")
        @JsonPropertyDescription("is_person_assigned")
        boolean hasPersonAssigned,
        @JsonProperty("deadline")
        @JsonPropertyDescription("due_date_for_action_item")
        String deadline,
        @JsonProperty("has_deadline")
        @JsonPropertyDescription("is_there_a_deadline")
        boolean hasDeadline,
        @JsonProperty("assignee_confidence")
        @JsonPropertyDescription("confidence_of_assignee_between_0_and_1")
        float confidence,
        @JsonProperty("deadline_confidence")
        @JsonPropertyDescription("confidence_of_deadline_between_0_and_1")
        float deadlineConfidence
) {
}
