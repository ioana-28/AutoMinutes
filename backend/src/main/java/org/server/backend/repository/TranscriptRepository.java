package org.server.backend.repository;

import org.server.backend.model.Transcript;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TranscriptRepository extends JpaRepository<Transcript, Long> {
    Optional<Transcript> findByMeetingId(Long id);
}

