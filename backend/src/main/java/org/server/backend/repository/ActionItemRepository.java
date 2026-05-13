package org.server.backend.repository;

import org.server.backend.model.ActionItem;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ActionItemRepository extends JpaRepository<ActionItem, Long> {
    List<ActionItem> findByMeetingId(Long meetingId);

    void deleteByMeetingId(Long meetingId);
}
