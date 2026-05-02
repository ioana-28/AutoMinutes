package org.server.backend.controller;
import org.server.backend.dto.ActionItemDto;
import org.server.backend.model.ActionItem;
import org.server.backend.model.Meeting;
import org.server.backend.repository.ActionItemRepository;
import org.server.backend.repository.MeetingRepository;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.http.HttpStatus;

import java.util.List;

@RestController
@RequestMapping("/api/action-items")
public class ActionItemController {

    private final ActionItemRepository actionRepo;
    private final MeetingRepository meetingRepo;

    public ActionItemController(ActionItemRepository actionRepo, MeetingRepository meetingRepo) {
        this.actionRepo = actionRepo;
        this.meetingRepo = meetingRepo;
    }
    @PostMapping
    public ActionItemDto create(@RequestBody ActionItemDto dto, @RequestParam Long meetingId) {
        if (dto.description() == null || dto.description().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Description is required");
        }

        Meeting meeting = meetingRepo.findById(meetingId)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found"));

        ActionItem item = new ActionItem();

        item.setDescription(dto.description());
        item.setAssignee(dto.assignee());
        item.setDeadline(dto.deadline());
        item.setStatus(dto.status());

        item.setHasPersonAssigned(dto.assignee() != null && !dto.assignee().isEmpty());
        item.setHasDeadline(dto.deadline() != null && !dto.deadline().isEmpty());

        item.setAssigneeConfidence(dto.assigneeConfidence());
        item.setDeadlineConfidence(dto.deadlineConfidence());
        item.setStatusConfidence(dto.statusConfidence());

        item.setMeeting(meeting);

        ActionItem saved = actionRepo.save(item);

        return new ActionItemDto(
                saved.getDescription(),
                saved.getAssignee(),
                saved.isHasPersonAssigned(),
                saved.getDeadline(),
                saved.isHasDeadline(),
                saved.getAssigneeConfidence(),
                saved.getDeadlineConfidence(),
                saved.getStatusConfidence(),
                saved.getStatus()
        );
    }

    @GetMapping
    public List<ActionItemDto> getAll() {
        return actionRepo.findAll().stream().map(item ->
                new ActionItemDto(
                        item.getDescription(),
                        item.getAssignee(),
                        item.isHasPersonAssigned(),
                        item.getDeadline(),
                        item.isHasDeadline(),
                        item.getAssigneeConfidence(),
                        item.getDeadlineConfidence(),
                        item.getStatusConfidence(),
                        item.getStatus()
                )).toList();
    }

    @GetMapping("/{id}")
    public ActionItemDto getById(@PathVariable Long id) {

        ActionItem item = actionRepo.findById(id)
                .orElseThrow(() ->
                        new ResponseStatusException(HttpStatus.NOT_FOUND, "Action item not found"));

        return new ActionItemDto(
                item.getDescription(),
                item.getAssignee(),
                item.isHasPersonAssigned(),
                item.getDeadline(),
                item.isHasDeadline(),
                item.getAssigneeConfidence(),
                item.getDeadlineConfidence(),
                item.getStatusConfidence(),
                item.getStatus()
        );
    }

    @PutMapping("/{id}")
    public ActionItemDto update(@PathVariable Long id, @RequestBody ActionItemDto dto) {
        return actionRepo.findById(id).map(item -> {

            if (dto.description() != null) {
                item.setDescription(dto.description());
            }

            if (dto.assignee() != null) {
                item.setAssignee(dto.assignee());
                item.setHasPersonAssigned(!dto.assignee().isEmpty());
            }

            if (dto.deadline() != null) {
                item.setDeadline(dto.deadline());
                item.setHasDeadline(!dto.deadline().isEmpty());
            }

            if (dto.status() != null) {
                item.setStatus(dto.status());
            }

            if (dto.assigneeConfidence() != null) {
                item.setAssigneeConfidence(dto.assigneeConfidence());
            }

            if (dto.deadlineConfidence() != null) {
                item.setDeadlineConfidence(dto.deadlineConfidence());
            }

            if (dto.statusConfidence() != null) {
                item.setStatusConfidence(dto.statusConfidence());
            }

            ActionItem saved = actionRepo.save(item);

            return new ActionItemDto(
                    saved.getDescription(),
                    saved.getAssignee(),
                    saved.isHasPersonAssigned(),
                    saved.getDeadline(),
                    saved.isHasDeadline(),
                    saved.getAssigneeConfidence(),
                    saved.getDeadlineConfidence(),
                    saved.getStatusConfidence(),
                    saved.getStatus()
            );

        }).orElseThrow(() ->
                new ResponseStatusException(HttpStatus.NOT_FOUND, "Action item not found"));

    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        if (!actionRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Action item not found");
        }

        actionRepo.deleteById(id);
    }
}
