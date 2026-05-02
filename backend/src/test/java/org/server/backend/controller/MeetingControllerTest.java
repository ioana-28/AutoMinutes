package org.server.backend.controller;

import org.junit.jupiter.api.Test;
import org.server.backend.dto.MeetingIdRequestDto;
import org.server.backend.dto.MeetingRequestDto;
import org.server.backend.dto.MeetingResponseDto;
import org.server.backend.dto.UpdateMeetingTitleRequestDto;
import org.server.backend.model.ActivityStatus;
import org.server.backend.model.Meeting;
import org.server.backend.model.Role;
import org.server.backend.model.User;
import org.server.backend.service.MeetingService;

import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

class MeetingControllerTest {

    @Test
    void createMeeting_returnsMeetingResponse() {
        StubMeetingService stubService = new StubMeetingService();
        MeetingController controller = new MeetingController(stubService);

        MeetingRequestDto request = new MeetingRequestDto("Sprint Planning", 1L);
        stubService.createReturn = buildMeeting(10L, "Sprint Planning");

        MeetingResponseDto response = controller.createMeeting(request);

        assertNotNull(response);
        assertEquals(10L, response.id());
        assertEquals("Sprint Planning", response.title());
        assertEquals(1L, response.createdBy().id());
        assertNotNull(response.participants());
        assertEquals(request, stubService.lastCreateRequest);
    }

    @Test
    void getMeeting_returnsMeetingResponse() {
        StubMeetingService stubService = new StubMeetingService();
        MeetingController controller = new MeetingController(stubService);

        stubService.getReturn = buildMeeting(5L, "Daily Standup");

        MeetingResponseDto response = controller.getMeeting(5L);

        assertNotNull(response);
        assertEquals(5L, response.id());
        assertEquals("Daily Standup", response.title());
        assertEquals(1L, response.createdBy().id());
        assertEquals(new MeetingIdRequestDto(5L), stubService.lastGetRequest);
    }

    @Test
    void updateMeetingTitle_returnsMeetingResponse() {
        StubMeetingService stubService = new StubMeetingService();
        MeetingController controller = new MeetingController(stubService);

        MeetingRequestDto request = new MeetingRequestDto("Updated Title", null);
        stubService.updateReturn = buildMeeting(7L, "Updated Title");

        MeetingResponseDto response = controller.updateMeetingTitle(7L, request);

        assertNotNull(response);
        assertEquals(7L, response.id());
        assertEquals("Updated Title", response.title());
        assertEquals(new UpdateMeetingTitleRequestDto(7L, "Updated Title"), stubService.lastUpdateRequest);
    }

    @Test
    void deleteMeeting_callsService() {
        StubMeetingService stubService = new StubMeetingService();
        MeetingController controller = new MeetingController(stubService);

        controller.deleteMeeting(12L);

        assertEquals(new MeetingIdRequestDto(12L), stubService.lastDeleteRequest);
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

    private static class StubMeetingService extends MeetingService {
        private MeetingRequestDto lastCreateRequest;
        private MeetingIdRequestDto lastGetRequest;
        private MeetingIdRequestDto lastDeleteRequest;
        private UpdateMeetingTitleRequestDto lastUpdateRequest;
        private Meeting createReturn;
        private Meeting getReturn;
        private Meeting updateReturn;

        private StubMeetingService() {
            super(null, null);
        }

        @Override
        public Meeting createMeeting(MeetingRequestDto request) {
            lastCreateRequest = request;
            return createReturn;
        }

        @Override
        public Meeting getMeetingById(MeetingIdRequestDto request) {
            lastGetRequest = request;
            return getReturn;
        }

        @Override
        public void deleteMeeting(MeetingIdRequestDto request) {
            lastDeleteRequest = request;
        }

        @Override
        public Meeting updateMeetingTitle(UpdateMeetingTitleRequestDto request) {
            lastUpdateRequest = request;
            return updateReturn;
        }
    }
}
