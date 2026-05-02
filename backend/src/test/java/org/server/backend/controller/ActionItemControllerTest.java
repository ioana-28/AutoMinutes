package org.server.backend.controller;

import org.junit.jupiter.api.Test;
import org.server.backend.dto.ActionItemRequestDto;
import org.server.backend.dto.ActionItemResponseDto;
import org.server.backend.service.ActionItemService;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ActionItemControllerTest {

    @Test
    void create_returnsDto() {
        ActionItemService service = mock(ActionItemService.class);
        ActionItemController controller = new ActionItemController(service);

        ActionItemRequestDto dto = new ActionItemRequestDto(
                "Task", "John", false,
                "2026-05-01", false,
                0.9f, 0.8f, 0.7f, "OPEN"
        );

        ActionItemResponseDto response = new ActionItemResponseDto(
                1L, "Task", "John", true,
                "2026-05-01", true,
                0.9f, 0.8f, 0.7f, "OPEN"
        );

        when(service.create(dto, 1L)).thenReturn(response);

        ActionItemResponseDto result = controller.create(dto, 1L);

        assertEquals("Task", result.description());
        verify(service).create(dto, 1L);
    }

    @Test
    void create_meetingNotFound_throws() {
        ActionItemService service = mock(ActionItemService.class);
        ActionItemController controller = new ActionItemController(service);

        ActionItemRequestDto dto = new ActionItemRequestDto(
                "Task", null, false,
                null, false,
                null, null, null, null
        );

        when(service.create(dto, 1L)).thenThrow(new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND));

        assertThrows(ResponseStatusException.class,
                () -> controller.create(dto, 1L));
    }

    @Test
    void create_missingDescription_throws() {
        ActionItemService service = mock(ActionItemService.class);
        ActionItemController controller = new ActionItemController(service);

        ActionItemRequestDto dto = new ActionItemRequestDto(
                "", null, false,
                null, false,
                null, null, null, null
        );

        when(service.create(dto, 1L)).thenThrow(new ResponseStatusException(org.springframework.http.HttpStatus.BAD_REQUEST));

        assertThrows(ResponseStatusException.class,
                () -> controller.create(dto, 1L));
    }

    @Test
    void getAll_returnsList() {
        ActionItemService service = mock(ActionItemService.class);
        ActionItemController controller = new ActionItemController(service);

        when(service.getAll()).thenReturn(List.of(
                new ActionItemResponseDto(1L, "Task1", null, false, null, false, null, null, null, null)
        ));

        List<ActionItemResponseDto> result = controller.getAll();

        assertEquals(1, result.size());
        verify(service).getAll();
    }

    @Test
    void getById_returnsItem() {
        ActionItemService service = mock(ActionItemService.class);
        ActionItemController controller = new ActionItemController(service);

        when(service.getById(1L)).thenReturn(new ActionItemResponseDto(
                1L, "Task", null, false, null, false, null, null, null, null
        ));

        ActionItemResponseDto result = controller.getById(1L);

        assertEquals("Task", result.description());
        verify(service).getById(1L);
    }

    @Test
    void getById_notFound_throws() {
        ActionItemService service = mock(ActionItemService.class);
        ActionItemController controller = new ActionItemController(service);

        when(service.getById(1L)).thenThrow(new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND));

        assertThrows(ResponseStatusException.class, () -> controller.getById(1L));
    }

    @Test
    void update_updatesDescription() {
        ActionItemService service = mock(ActionItemService.class);
        ActionItemController controller = new ActionItemController(service);

        ActionItemRequestDto dto = new ActionItemRequestDto(
                "New", null, false,
                null, false,
                null, null, null, null
        );

        when(service.update(1L, dto)).thenReturn(new ActionItemResponseDto(
                1L, "New", null, false, null, false, null, null, null, null
        ));

        ActionItemResponseDto result = controller.update(1L, dto);

        assertEquals("New", result.description());
        verify(service).update(1L, dto);
    }

    @Test
    void update_notFound_throws() {
        ActionItemService service = mock(ActionItemService.class);
        ActionItemController controller = new ActionItemController(service);

        ActionItemRequestDto dto = new ActionItemRequestDto(
                "New", null, false,
                null, false,
                null, null, null, null
        );

        when(service.update(1L, dto)).thenThrow(new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND));

        assertThrows(ResponseStatusException.class,
                () -> controller.update(1L, dto));
    }

    @Test
    void delete_callsService() {
        ActionItemService service = mock(ActionItemService.class);
        ActionItemController controller = new ActionItemController(service);

        controller.delete(1L);

        verify(service).delete(1L);
    }

    @Test
    void delete_notFound_throws() {
        ActionItemService service = mock(ActionItemService.class);
        ActionItemController controller = new ActionItemController(service);

        doThrow(new ResponseStatusException(org.springframework.http.HttpStatus.NOT_FOUND)).when(service).delete(1L);

        assertThrows(ResponseStatusException.class,
                () -> controller.delete(1L));
    }
}