package org.server.backend.service;

import org.server.backend.dto.ActionItemRequestDto;
import org.server.backend.dto.ActionItemResponseDto;
import org.server.backend.model.ActionItem;
import org.server.backend.model.Meeting;
import org.server.backend.repository.ActionItemRepository;
import org.server.backend.repository.MeetingRepository;
import org.server.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class ActionItemService {

    private final ActionItemRepository actionRepo;
    private final MeetingRepository meetingRepo;
    private final UserRepository userRepo;

    public ActionItemService(ActionItemRepository actionRepo, MeetingRepository meetingRepo, UserRepository userRepo) {
        this.actionRepo = actionRepo;
        this.meetingRepo = meetingRepo;
        this.userRepo = userRepo;
    }

    public ActionItemResponseDto create(ActionItemRequestDto dto, Long meetingId) {
        if (dto.description() == null || dto.description().isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Description is required");
        }

        Meeting meeting = meetingRepo.findById(meetingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found"));

        validateAssigneeUserId(dto.assigneeUserId(), meeting);

        ActionItem item = new ActionItem();
        item.setDescription(dto.description());
        item.setAssignee(dto.assignee());
        item.setAssigneeUserId(dto.assigneeUserId());
        item.setDeadline(dto.deadline());
        item.setStatus(dto.status());
        item.setPreviousStatus(dto.previousStatus());

        boolean hasAssignee = (dto.assignee() != null && !dto.assignee().isEmpty()) || dto.assigneeUserId() != null;
        item.setHasPersonAssigned(hasAssignee);
        item.setHasDeadline(dto.deadline() != null);

        item.setAssigneeConfidence(dto.assigneeConfidence());
        item.setDeadlineConfidence(dto.deadlineConfidence());
        item.setStatusConfidence(dto.statusConfidence());

        item.setMeeting(meeting);

        return toResponse(actionRepo.save(item));
    }

    public List<ActionItemResponseDto> getAll() {
        return actionRepo.findAll().stream().map(this::toResponse).toList();
    }

    public ActionItemResponseDto getById(Long id) {
        ActionItem item = actionRepo.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Action item not found"));

        return toResponse(item);
    }

    public ActionItemResponseDto update(Long id, ActionItemRequestDto dto) {
        return actionRepo.findById(id).map(item -> {

            if (dto.description() != null) {
                item.setDescription(dto.description());
            }

            if (dto.assignee() != null) {
                item.setAssignee(dto.assignee());
                item.setHasPersonAssigned(!dto.assignee().isEmpty() || item.getAssigneeUserId() != null);
            }

            if (dto.assigneeUserId() != null) {
                validateAssigneeUserId(dto.assigneeUserId(), item.getMeeting());
                item.setAssigneeUserId(dto.assigneeUserId());
                item.setHasPersonAssigned(true);
            }

            if (dto.deadline() != null) {
                item.setDeadline(dto.deadline());
                item.setHasDeadline(true);
            }

            if (dto.status() != null) {
                item.setStatus(dto.status());
            }

            if (dto.previousStatus() != null) {
                item.setPreviousStatus(dto.previousStatus());
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

            return toResponse(actionRepo.save(item));

        }).orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Action item not found"));
    }

    public void delete(Long id) {
        if (!actionRepo.existsById(id)) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Action item not found");
        }

        actionRepo.deleteById(id);
    }

    public List<ActionItemResponseDto> getByMeetingId(Long meetingId) {
        if (meetingId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Meeting id is required");
        }

        return actionRepo.findByMeetingId(meetingId).stream().map(this::toResponse).toList();
    }

    private ActionItemResponseDto toResponse(ActionItem item) {
        return new ActionItemResponseDto(
                item.getId(),
                item.getDescription(),
                item.getAssignee(),
                item.getAssigneeUserId(),
                item.isHasPersonAssigned(),
                item.getDeadline(),
                item.isHasDeadline(),
                item.getAssigneeConfidence(),
                item.getDeadlineConfidence(),
                item.getStatusConfidence(),
                item.getStatus(),
                item.getPreviousStatus()
        );
    }

    private void validateAssigneeUserId(Long assigneeUserId, Meeting meeting) {
        if (assigneeUserId == null) {
            return;
        }

        userRepo.findById(assigneeUserId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Assignee user not found"));
    }
}
