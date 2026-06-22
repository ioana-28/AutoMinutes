package org.server.backend.service;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.server.backend.dto.ActionItemRequestDto;
import org.server.backend.dto.ActionItemResponseDto;
import org.server.backend.model.ActionItem;
import org.server.backend.model.ActionItemStatus;
import org.server.backend.model.Meeting;
import org.server.backend.model.User;
import org.server.backend.repository.ActionItemRepository;
import org.server.backend.repository.MeetingRepository;
import org.server.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ActionItemServiceTest {

    @Mock
    private ActionItemRepository actionItemRepository;

    @Mock
    private MeetingRepository meetingRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private ActionItemService actionItemService;

    @Test
    void create_validRequest_savesAndReturnsDto() {
        Long meetingId = 1L;
        Long assigneeId = 2L;
        Meeting meeting = new Meeting();
        meeting.setId(meetingId);

        User assignee = new User();
        assignee.setId(assigneeId);

        ActionItemRequestDto request = new ActionItemRequestDto(
                "Complete testing", "John", assigneeId, null,
                LocalDate.now(), null, 0.9f, 0.9f, 0.9f, ActionItemStatus.OPEN, null
        );

        when(meetingRepository.findById(meetingId)).thenReturn(Optional.of(meeting));
        when(userRepository.findById(assigneeId)).thenReturn(Optional.of(assignee));

        ActionItem savedItem = new ActionItem();
        savedItem.setId(10L);
        savedItem.setDescription("Complete testing");
        savedItem.setAssignee("John");
        savedItem.setAssigneeUserId(assigneeId);
        savedItem.setStatus(ActionItemStatus.OPEN);
        savedItem.setHasPersonAssigned(true);

        when(actionItemRepository.save(any(ActionItem.class))).thenReturn(savedItem);

        ActionItemResponseDto response = actionItemService.create(request, meetingId);

        assertNotNull(response);
        assertEquals(10L, response.id());
        assertEquals("Complete testing", response.description());
        assertTrue(response.hasPersonAssigned());
        verify(actionItemRepository).save(any(ActionItem.class));
    }

    @Test
    void create_missingDescription_throwsBadRequest() {
        ActionItemRequestDto request = new ActionItemRequestDto(
                "", null, null, null, null, null, null, null, null, null, null
        );

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> actionItemService.create(request, 1L));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
        verify(actionItemRepository, never()).save(any());
    }

    @Test
    void create_meetingNotFound_throwsNotFound() {
        ActionItemRequestDto request = new ActionItemRequestDto(
                "Task", null, null, null, null, null, null, null, null, null, null
        );
        when(meetingRepository.findById(1L)).thenReturn(Optional.empty());

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> actionItemService.create(request, 1L));
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void create_invalidAssigneeUser_throwsNotFound() {
        Meeting meeting = new Meeting();
        when(meetingRepository.findById(1L)).thenReturn(Optional.of(meeting));
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        ActionItemRequestDto request = new ActionItemRequestDto(
                "Task", null, 99L, null, null, null, null, null, null, null, null
        );

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> actionItemService.create(request, 1L));
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
    }

    @Test
    void update_validRequest_updatesFieldsAndSaves() {
        Long itemId = 1L;
        ActionItem existingItem = new ActionItem();
        existingItem.setId(itemId);
        existingItem.setDescription("Old Description");
        existingItem.setStatus(ActionItemStatus.OPEN);

        ActionItemRequestDto request = new ActionItemRequestDto(
                "New Description", null, null, null, null, null, null, null, null, ActionItemStatus.IN_PROGRESS, null
        );

        when(actionItemRepository.findById(itemId)).thenReturn(Optional.of(existingItem));
        when(actionItemRepository.save(any(ActionItem.class))).thenAnswer(invocation -> invocation.getArgument(0));

        ActionItemResponseDto response = actionItemService.update(itemId, request);

        assertEquals("New Description", response.description());
        assertEquals(ActionItemStatus.IN_PROGRESS, response.status());
        verify(actionItemRepository).save(existingItem);
    }

    @Test
    void delete_existingItem_deletesSuccessfully() {
        when(actionItemRepository.existsById(1L)).thenReturn(true);

        actionItemService.delete(1L);

        verify(actionItemRepository).deleteById(1L);
    }

    @Test
    void delete_itemNotFound_throwsNotFound() {
        when(actionItemRepository.existsById(1L)).thenReturn(false);

        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> actionItemService.delete(1L));
        assertEquals(HttpStatus.NOT_FOUND, exception.getStatusCode());
        verify(actionItemRepository, never()).deleteById(any());
    }

    @Test
    void getByMeetingId_nullId_throwsBadRequest() {
        ResponseStatusException exception = assertThrows(ResponseStatusException.class,
                () -> actionItemService.getByMeetingId(null));
        assertEquals(HttpStatus.BAD_REQUEST, exception.getStatusCode());
    }

    @Test
    void getByMeetingId_validId_returnsList() {
        ActionItem item1 = new ActionItem();
        item1.setId(1L);
        ActionItem item2 = new ActionItem();
        item2.setId(2L);

        when(actionItemRepository.findByMeetingId(1L)).thenReturn(List.of(item1, item2));

        List<ActionItemResponseDto> result = actionItemService.getByMeetingId(1L);

        assertEquals(2, result.size());
        verify(actionItemRepository).findByMeetingId(1L);
    }
}