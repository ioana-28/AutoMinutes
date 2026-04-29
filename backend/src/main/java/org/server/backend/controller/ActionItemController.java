package org.server.backend.controller;
import org.server.backend.model.ActionItem;
import org.server.backend.model.Meeting;
import org.server.backend.repository.ActionItemRepository;
import org.server.backend.repository.MeetingRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/action-items")
public class ActionItemController {

    private final ActionItemRepository actionRepo;
    private final MeetingRepository meetingRepo;

    public ActionItemController(ActionItemRepository actionRepo, MeetingRepository meetingRepo) {
        this.actionRepo = actionRepo;
        this.meetingRepo = meetingRepo;
    }
    @PostMapping
    public ActionItem create(@RequestBody ActionItem item,@RequestParam Long meetingId) {

        Meeting meeting = meetingRepo.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));

        item.setHasPersonAssigned(item.getAssignee() != null && !item.getAssignee().isEmpty());
        item.setHasDeadline(item.getDeadline() != null && !item.getDeadline().isEmpty());

        item.setMeeting(meeting);

        return actionRepo.save(item);
    }

    @GetMapping
    public List<ActionItem> getAll() {
        return actionRepo.findAll();
    }

    @GetMapping("/{id}")
    public ActionItem getById(@PathVariable Long id) {
        return actionRepo.findById(id)
                .orElseThrow(() -> new RuntimeException("Not found"));
    }

    @PutMapping("/{id}")
    public ActionItem update(@PathVariable Long id, @RequestBody ActionItem updated) {

        return actionRepo.findById(id).map(item -> {

            item.setDescription(updated.getDescription());
            item.setAssignee(updated.getAssignee());
            item.setDeadline(updated.getDeadline());
            item.setStatus(updated.getStatus());

            item.setAssigneeConfidence(updated.getAssigneeConfidence());
            item.setDeadlineConfidence(updated.getDeadlineConfidence());
            item.setStatusConfidence(updated.getStatusConfidence());

            item.setHasPersonAssigned(updated.getAssignee() != null && !updated.getAssignee().isEmpty());
            item.setHasDeadline(updated.getDeadline() != null && !updated.getDeadline().isEmpty());

            return actionRepo.save(item);

        }).orElseThrow(() -> new RuntimeException("Not found"));
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        actionRepo.deleteById(id);
    }
}
