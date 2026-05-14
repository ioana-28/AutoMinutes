package org.server.backend.controller;
import org.server.backend.dto.ActionItemRequestDto;
import org.server.backend.dto.ActionItemResponseDto;
import org.server.backend.service.ActionItemService;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/action-items")
public class ActionItemController {

    private final ActionItemService actionItemService;

    public ActionItemController(ActionItemService actionItemService) {
        this.actionItemService = actionItemService;
    }
    @PostMapping
    public ActionItemResponseDto create(@RequestBody ActionItemRequestDto dto, @RequestParam Long meetingId) {
        return actionItemService.create(dto, meetingId);
    }

    @GetMapping
    public List<ActionItemResponseDto> getAll() {
        return actionItemService.getAll();
    }

    @GetMapping("/{id}")
    public ActionItemResponseDto getById(@PathVariable Long id) {
        return actionItemService.getById(id);
    }

    @GetMapping(params = "meetingId")
    public List<ActionItemResponseDto> getByMeetingId(@RequestParam Long meetingId) {
        return actionItemService.getByMeetingId(meetingId);
    }

    @PutMapping("/{id}")
    public ActionItemResponseDto update(@PathVariable Long id, @RequestBody ActionItemRequestDto dto) {
        return actionItemService.update(id, dto);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        actionItemService.delete(id);
    }
}
