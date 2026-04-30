package org.server.backend;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.server.backend.controller.MeetingController;
import org.server.backend.dto.MeetingIdRequestDto;
import org.server.backend.dto.MeetingRequestDto;
import org.server.backend.dto.UpdateMeetingTitleRequestDto;
import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Meeting;
import org.server.backend.model.Role;
import org.server.backend.model.User;
import org.server.backend.service.MeetingService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.util.ArrayList;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.doNothing;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.delete;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.put;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(MeetingController.class)
class MeetingControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private MeetingService meetingService;

    @Test
    void createMeeting_returnsMeetingResponse() throws Exception {
        MeetingRequestDto request = new MeetingRequestDto("Sprint Planning", 1L);
        Meeting meeting = buildMeeting(10L, "Sprint Planning");

        when(meetingService.createMeeting(request)).thenReturn(meeting);

        mockMvc.perform(post("/api/meetings")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(10))
                .andExpect(jsonPath("$.title").value("Sprint Planning"))
                .andExpect(jsonPath("$.createdBy.id").value(1))
                .andExpect(jsonPath("$.participants").isArray());

        verify(meetingService).createMeeting(request);
    }

    @Test
    void getMeeting_returnsMeetingResponse() throws Exception {
        Meeting meeting = buildMeeting(5L, "Daily Standup");

        when(meetingService.getMeetingById(new MeetingIdRequestDto(5L))).thenReturn(meeting);

        mockMvc.perform(get("/api/meetings/5"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(5))
                .andExpect(jsonPath("$.title").value("Daily Standup"))
                .andExpect(jsonPath("$.createdBy.id").value(1));

        verify(meetingService).getMeetingById(new MeetingIdRequestDto(5L));
    }

    @Test
    void updateMeetingTitle_returnsMeetingResponse() throws Exception {
        MeetingRequestDto request = new MeetingRequestDto("Updated Title", null);
        Meeting meeting = buildMeeting(7L, "Updated Title");

        UpdateMeetingTitleRequestDto updateRequest = new UpdateMeetingTitleRequestDto(7L, "Updated Title");
        when(meetingService.updateMeetingTitle(updateRequest)).thenReturn(meeting);

        mockMvc.perform(put("/api/meetings/7/title")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(7))
                .andExpect(jsonPath("$.title").value("Updated Title"));

        verify(meetingService).updateMeetingTitle(updateRequest);
    }

    @Test
    void deleteMeeting_returnsOk() throws Exception {
        MeetingIdRequestDto request = new MeetingIdRequestDto(12L);
        doNothing().when(meetingService).deleteMeeting(request);

        mockMvc.perform(delete("/api/meetings/12"))
                .andExpect(status().isOk());

        verify(meetingService).deleteMeeting(request);
    }

    private Meeting buildMeeting(Long id, String title) {
        User createdBy = new User();
        createdBy.setId(1L);
        createdBy.setEmail("user@example.com");
        createdBy.setFirstName("Alex");
        createdBy.setLastName("Martin");
        createdBy.setRole(Role.USER);
        createdBy.setActivityStatus(ActivityStatus.ACTIVE);

        Meeting meeting = new Meeting();
        meeting.setId(id);
        meeting.setTitle(title);
        meeting.setDescription("Meeting description");
        meeting.setCreatedBy(createdBy);
        meeting.setParticipants(new ArrayList<>());
        meeting.setActionItems(new ArrayList<>());
        return meeting;
    }
}

