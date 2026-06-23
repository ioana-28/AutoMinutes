package org.server.backend.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.Captor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.server.backend.dto.*;
import org.server.backend.model.*;
import org.server.backend.model.AIResponseFormat.TranscriptSummary;
import org.server.backend.repository.ActionItemRepository;
import org.server.backend.repository.MeetingRepository;
import org.server.backend.repository.TranscriptRepository;
import org.server.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class MeetingServiceTest {

    @Mock private MeetingRepository meetingRepository;
    @Mock private UserRepository userRepository;
    @Mock private MinioService minioService;
    @Mock private FileProcessingService fileProcessingService;
    @Mock private AIService aiService;
    @Mock private ActionItemRepository actionItemRepository;
    @Mock private TranscriptRepository transcriptRepository;

    @InjectMocks
    private MeetingService meetingService;

    @Captor
    private ArgumentCaptor<Meeting> meetingCaptor;

    @Test
    void createMeeting_validRequest_savesAndReturnsMeeting() {
        User creator = new User("creator@test.com", "pass", Role.USER, ActivityStatus.ACTIVE);
        creator.setId(1L);

        MeetingRequestDto request = new MeetingRequestDto("Weekly Sync", 1L, LocalDate.now());

        when(userRepository.findById(1L)).thenReturn(Optional.of(creator));
        when(meetingRepository.save(any(Meeting.class))).thenAnswer(i -> i.getArgument(0));

        Meeting result = meetingService.createMeeting(request);

        assertNotNull(result);
        assertEquals("Weekly Sync", result.getTitle());
        assertEquals(creator, result.getCreatedBy());
        verify(meetingRepository).save(any(Meeting.class));
    }

    @Test
    void createMeeting_userNotFound_throwsException() {
        MeetingRequestDto request = new MeetingRequestDto("Weekly Sync", 99L, LocalDate.now());
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        ResponseStatusException ex = assertThrows(ResponseStatusException.class,
                () -> meetingService.createMeeting(request));
        assertEquals(HttpStatus.NOT_FOUND, ex.getStatusCode());
        verify(meetingRepository, never()).save(any());
    }

    @Test
    void addParticipant_validUser_addsToMeeting() {
        Meeting meeting = new Meeting();
        meeting.setId(1L);
        meeting.setParticipants(new ArrayList<>());

        User user = new User("user@test.com", "pass", Role.USER, ActivityStatus.ACTIVE);
        user.setId(2L);

        when(meetingRepository.findById(1L)).thenReturn(Optional.of(meeting));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));
        when(meetingRepository.save(any(Meeting.class))).thenReturn(meeting);

        Meeting result = meetingService.addParticipant(1L, 2L);

        assertTrue(result.getParticipants().contains(user));
        verify(meetingRepository).save(meeting);
    }

    @Test
    void addParticipant_userAlreadyExists_doesNotAddDuplicate() {
        User user = new User("user@test.com", "pass", Role.USER, ActivityStatus.ACTIVE);
        user.setId(2L);

        Meeting meeting = new Meeting();
        meeting.setId(1L);
        List<User> participants = new ArrayList<>();
        participants.add(user);
        meeting.setParticipants(participants);

        when(meetingRepository.findById(1L)).thenReturn(Optional.of(meeting));
        when(userRepository.findById(2L)).thenReturn(Optional.of(user));

        Meeting result = meetingService.addParticipant(1L, 2L);

        assertEquals(1, result.getParticipants().size());
        verify(meetingRepository, never()).save(any());
    }

    @Test
    void updateMeetingTitle_validRequest_updatesTitle() {
        Meeting meeting = new Meeting();
        meeting.setId(1L);
        meeting.setTitle("Old Title");

        UpdateMeetingTitleRequestDto request = new UpdateMeetingTitleRequestDto(1L, "New Title");

        when(meetingRepository.findById(1L)).thenReturn(Optional.of(meeting));
        when(meetingRepository.save(any(Meeting.class))).thenAnswer(i -> i.getArgument(0));

        Meeting result = meetingService.updateMeetingTitle(request);

        assertEquals("New Title", result.getTitle());
        verify(meetingRepository).save(meeting);
    }

    @Test
    void processExistingTranscript_successfulFlow_updatesMeetingAndCreatesActionItems() {
        Long meetingId = 1L;
        Meeting meeting = new Meeting();
        meeting.setId(meetingId);
        meeting.setMeetingDate(LocalDate.now());
        meeting.setParticipants(new ArrayList<>());

        Transcript transcript = new Transcript();
        transcript.setFilePath("test-path.pdf");
        transcript.setFileName("transcript.pdf");
        meeting.setTranscript(transcript);

        when(meetingRepository.findById(meetingId)).thenReturn(Optional.of(meeting));
        when(minioService.getFileBytes("test-path.pdf")).thenReturn(new byte[]{1, 2, 3});
        when(fileProcessingService.extractTextFromStream(any(), eq("transcript.pdf"))).thenReturn("Extracted text");

        List<org.server.backend.model.AIResponseFormat.ActionItem> aiItems = List.of(
                new org.server.backend.model.AIResponseFormat.ActionItem(
                        "Do homework", "Jane Doe", true, LocalDate.now().plusDays(2),
                        true, 0.9f, 0.9f, ActionItemStatus.OPEN, 0.9f
                )
        );
        TranscriptSummary summary = new TranscriptSummary("Meeting was good", aiItems, List.of("Jane Doe"));

        when(aiService.askAiForTarget(eq("Extracted text"), any(), eq("all"))).thenReturn(summary);

        User jane = new User();
        jane.setId(5L);
        when(userRepository.findByFirstNameIgnoreCaseAndLastNameIgnoreCase("Jane", "Doe"))
                .thenReturn(List.of(jane));

        meetingService.processExistingTranscript(meetingId, "all");

        verify(meetingRepository, atLeastOnce()).save(meetingCaptor.capture());
        assertEquals(ProcessingStatus.COMPLETED, meetingCaptor.getValue().getAiStatus());
        assertEquals("Meeting was good", meetingCaptor.getValue().getDescription());

        verify(actionItemRepository).deleteByMeetingId(meetingId);
        verify(actionItemRepository).saveAll(anyList());

        assertTrue(meeting.getParticipants().contains(jane));
    }

    @Test
    void processExistingTranscript_aiReturnsNull_setsStatusToFailed() {
        Long meetingId = 1L;
        Meeting meeting = new Meeting();
        meeting.setId(meetingId);

        Transcript transcript = new Transcript();
        transcript.setFilePath("path");
        transcript.setFileName("name");
        meeting.setTranscript(transcript);

        when(meetingRepository.findById(meetingId)).thenReturn(Optional.of(meeting));
        when(minioService.getFileBytes(anyString())).thenReturn(new byte[]{});
        when(fileProcessingService.extractTextFromStream(any(), anyString())).thenReturn("text");
        when(aiService.askAiForTarget(anyString(), any(), anyString())).thenReturn(null); // AI fails

        meetingService.processExistingTranscript(meetingId, "all");

        verify(meetingRepository, atLeastOnce()).save(meetingCaptor.capture());
        assertEquals(ProcessingStatus.FAILED, meetingCaptor.getValue().getAiStatus());
        verify(actionItemRepository, never()).saveAll(any());
    }
}