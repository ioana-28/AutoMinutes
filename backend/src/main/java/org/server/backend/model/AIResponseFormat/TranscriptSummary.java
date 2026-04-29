package org.server.backend.model.AIResponseFormat;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyDescription;

import java.util.List;

public record TranscriptSummary(
        @JsonProperty("summary")
        @JsonPropertyDescription("summary_of_the_transcript")
        String summary,
        @JsonProperty("tasks")
        @JsonPropertyDescription("list_of_action_items") List<ActionItem> actionItemList
) {
}
