package org.server.backend.controller;

import org.junit.jupiter.api.Test;
import org.server.backend.controller.ActionItemController;
import org.server.backend.dto.ActionItemDto;
import org.server.backend.model.ActionItem;
import org.server.backend.model.Meeting;
import org.server.backend.repository.ActionItemRepository;
import org.server.backend.repository.MeetingRepository;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ActionItemControllerTest {

    @Test
    void create_returnsDto() {
        ActionItemRepository actionRepo = mock(ActionItemRepository.class);
        MeetingRepository meetingRepo = mock(MeetingRepository.class);

        ActionItemController controller = new ActionItemController(actionRepo, meetingRepo);

        ActionItemDto dto = new ActionItemDto(
                "Task", "John", false,
                "2026-05-01", false,
                0.9f, 0.8f, 0.7f, "OPEN"
        );

        Meeting meeting = new Meeting();
        meeting.setId(1L);

        ActionItem saved = new ActionItem();
        saved.setDescription("Task");

        when(meetingRepo.findById(1L)).thenReturn(Optional.of(meeting));
        when(actionRepo.save(any())).thenReturn(saved);

        ActionItemDto result = controller.create(dto, 1L);

        assertEquals("Task", result.description());
    }
    @Test
    void create_meetingNotFound_throws() {
        ActionItemRepository actionRepo = mock(ActionItemRepository.class);
        MeetingRepository meetingRepo = mock(MeetingRepository.class);

        when(meetingRepo.findById(1L)).thenReturn(Optional.empty());

        ActionItemController controller = new ActionItemController(actionRepo, meetingRepo);

        ActionItemDto dto = new ActionItemDto(
                "Task", null, false,
                null, false,
                null, null, null, null
        );

        assertThrows(ResponseStatusException.class,
                () -> controller.create(dto, 1L));
    }
    @Test
    void create_missingDescription_throws() {
        ActionItemController controller =
                new ActionItemController(mock(ActionItemRepository.class), mock(MeetingRepository.class));

        ActionItemDto dto = new ActionItemDto(
                "", null, false,
                null, false,
                null, null, null, null
        );

        assertThrows(ResponseStatusException.class,
                () -> controller.create(dto, 1L));
    }
    @Test
    void getAll_returnsList() {
        ActionItemRepository repo = mock(ActionItemRepository.class);

        ActionItem item = new ActionItem();
        item.setDescription("Task1");

        when(repo.findAll()).thenReturn(List.of(item));

        ActionItemController controller = new ActionItemController(repo, mock(MeetingRepository.class));

        List<ActionItemDto> result = controller.getAll();

        assertEquals(1, result.size());
    }
    @Test
    void getById_returnsItem() {
        ActionItemRepository repo = mock(ActionItemRepository.class);

        ActionItem item = new ActionItem();
        item.setDescription("Task");

        when(repo.findById(1L)).thenReturn(Optional.of(item));

        ActionItemController controller = new ActionItemController(repo, mock(MeetingRepository.class));

        ActionItemDto result = controller.getById(1L);

        assertEquals("Task", result.description());
    }
    @Test
    void getById_notFound_throws() {
        ActionItemRepository repo = mock(ActionItemRepository.class);

        when(repo.findById(1L)).thenReturn(Optional.empty());

        ActionItemController controller = new ActionItemController(repo, mock(MeetingRepository.class));

        assertThrows(ResponseStatusException.class, () -> controller.getById(1L));
    }

    @Test
    void update_updatesDescription() {
        ActionItemRepository repo = mock(ActionItemRepository.class);

        ActionItem item = new ActionItem();
        item.setDescription("Old");

        when(repo.findById(1L)).thenReturn(Optional.of(item));
        when(repo.save(any())).thenReturn(item);

        ActionItemController controller = new ActionItemController(repo, mock(MeetingRepository.class));

        ActionItemDto dto = new ActionItemDto(
                "New", null, false,
                null, false,
                null, null, null, null
        );

        ActionItemDto result = controller.update(1L, dto);

        assertEquals("New", result.description());
    }
    @Test
    void update_notFound_throws() {
        ActionItemRepository repo = mock(ActionItemRepository.class);

        when(repo.findById(1L)).thenReturn(Optional.empty());

        ActionItemController controller = new ActionItemController(repo, mock(MeetingRepository.class));

        ActionItemDto dto = new ActionItemDto(
                "New", null, false,
                null, false,
                null, null, null, null
        );

        assertThrows(ResponseStatusException.class,
                () -> controller.update(1L, dto));
    }
    @Test
    void delete_callsRepo() {
        ActionItemRepository repo = mock(ActionItemRepository.class);

        when(repo.existsById(1L)).thenReturn(true);

        ActionItemController controller = new ActionItemController(repo, mock(MeetingRepository.class));

        controller.delete(1L);

        verify(repo).deleteById(1L);
    }
    @Test
    void delete_notFound_throws() {
        ActionItemRepository repo = mock(ActionItemRepository.class);

        when(repo.existsById(1L)).thenReturn(false);

        ActionItemController controller = new ActionItemController(repo, mock(MeetingRepository.class));

        assertThrows(ResponseStatusException.class,
                () -> controller.delete(1L));
    }
}