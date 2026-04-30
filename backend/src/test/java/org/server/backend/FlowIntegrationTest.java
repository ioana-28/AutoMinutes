package org.server.backend;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.server.backend.repository.ActionItemRepository;
import org.server.backend.repository.MeetingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
//import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import java.util.HashMap;
import java.util.Map;
import java.util.stream.StreamSupport;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class FlowIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    private final ObjectMapper objectMapper = new ObjectMapper();

    @Autowired
    private ActionItemRepository actionItemRepository;

    @Autowired
    private MeetingRepository meetingRepository;

    @Test
    void fullAppFlow() throws Exception {
        Long userAId = createUser("usera@example.com", "User", "A");
        Long userBId = createUser("userb@example.com", "User", "B");

        Long meetingId = createMeeting(userAId, "Kickoff meeting");
        updateMeetingTitle(meetingId, "Updated meeting title");

        addParticipant(meetingId, userBId);
        assertParticipantPresent(meetingId, userBId);

        Long actionItemId = createActionItem(meetingId, "Prepare slides", "userb@example.com");
        updateActionItem(actionItemId, "Prepare deck", "userb@example.com");
        assertActionItemDescription(actionItemId, "Prepare deck");

        removeParticipant(meetingId, userBId);
        assertParticipantAbsent(meetingId, userBId);

        assertActionItemExists(actionItemId);

        deleteActionItem(actionItemId);
        assertThat(actionItemRepository.findById(actionItemId)).isEmpty();

        deleteMeeting(meetingId);
        assertThat(meetingRepository.findById(meetingId)).isEmpty();
    }

    private long createUser(String email, String firstName, String lastName) throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("email", email);
        payload.put("password", "pass123");
        payload.put("firstName", firstName);
        payload.put("lastName", lastName);
        payload.put("role", "USER");
        payload.put("activityStatus", "ACTIVE");

        MvcResult result = mockMvc.perform(post("/api/users")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("id").asLong();
    }

    private long createMeeting(long createdByUserId, String title) throws Exception {
        Map<String, Object> payload = Map.of(
                "title", title,
                "createdByUserId", createdByUserId
        );

        MvcResult result = mockMvc.perform(post("/api/meetings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("id").asLong();
    }

    private void updateMeetingTitle(long meetingId, String title) throws Exception {
        Map<String, Object> payload = Map.of("title", title);

        mockMvc.perform(put("/api/meetings/{meetingId}/title", meetingId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk());
    }

    private void addParticipant(long meetingId, long userId) throws Exception {
        Map<String, Object> payload = Map.of("userId", userId);

        mockMvc.perform(post("/api/meetings/{meetingId}/participants", meetingId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk());
    }

    private void assertParticipantPresent(long meetingId, long userId) throws Exception {
        MvcResult result = mockMvc.perform(get("/api/meetings/{meetingId}/participants", meetingId))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        boolean found = StreamSupport.stream(json.spliterator(), false)
                .anyMatch(node -> node.get("id").asLong() == userId);
        assertThat(found).isTrue();
    }

    private void assertParticipantAbsent(long meetingId, long userId) throws Exception {
        MvcResult result = mockMvc.perform(get("/api/meetings/{meetingId}/participants", meetingId))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        boolean found = StreamSupport.stream(json.spliterator(), false)
                .anyMatch(node -> node.get("id").asLong() == userId);
        assertThat(found).isFalse();
    }

    private long createActionItem(long meetingId, String description, String assignee) throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("description", description);
        payload.put("assignee", assignee);
        payload.put("deadline", "2026-05-01");
        payload.put("status", "OPEN");

        MvcResult result = mockMvc.perform(post("/api/action-items")
                        .queryParam("meetingId", String.valueOf(meetingId))
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        return json.get("id").asLong();
    }

    private void updateActionItem(long actionItemId, String description, String assignee) throws Exception {
        Map<String, Object> payload = new HashMap<>();
        payload.put("description", description);
        payload.put("assignee", assignee);

        mockMvc.perform(put("/api/action-items/{id}", actionItemId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isOk());
    }

    private void assertActionItemDescription(long actionItemId, String description) throws Exception {
        MvcResult result = mockMvc.perform(get("/api/action-items/{id}", actionItemId))
                .andExpect(status().isOk())
                .andReturn();

        JsonNode json = objectMapper.readTree(result.getResponse().getContentAsString());
        assertThat(json.get("description").asText()).isEqualTo(description);
    }

    private void assertActionItemExists(long actionItemId) throws Exception {
        mockMvc.perform(get("/api/action-items/{id}", actionItemId))
                .andExpect(status().isOk());
    }

    private void removeParticipant(long meetingId, long userId) throws Exception {
        mockMvc.perform(delete("/api/meetings/{meetingId}/participants/{userId}", meetingId, userId))
                .andExpect(status().isOk());
    }

    private void deleteActionItem(long actionItemId) throws Exception {
        mockMvc.perform(delete("/api/action-items/{id}", actionItemId))
                .andExpect(status().isOk());
    }

    private void deleteMeeting(long meetingId) throws Exception {
        mockMvc.perform(delete("/api/meetings/{meetingId}", meetingId))
                .andExpect(status().isOk());
    }
}