package org.server.backend.repository;

import org.server.backend.model.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    boolean existsByCreatedBy_Id(Long userId);
    boolean existsByParticipants_Id(Long userId);
}
