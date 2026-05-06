package org.server.backend.service;

import jakarta.transaction.Transactional;
import org.server.backend.dto.MeetingIdRequestDto;
import org.server.backend.dto.MeetingRequestDto;
import org.server.backend.dto.UpdateParticipantRequestDto;
import org.server.backend.dto.UpdateMeetingTitleRequestDto;
import org.server.backend.dto.UserResponseDto;
import org.server.backend.exception.BadRequestException;
import org.server.backend.exception.ResourceNotFoundException;
import org.server.backend.model.*;
import org.server.backend.model.AIResponseFormat.TranscriptSummary;
import org.server.backend.repository.ActionItemRepository;
import org.server.backend.repository.MeetingRepository;
import org.server.backend.repository.TranscriptRepository;
import org.server.backend.repository.UserRepository;
import org.springframework.http.HttpStatus;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.server.ResponseStatusException;

import java.io.ByteArrayInputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final UserRepository userRepository;
    private final MinioService minioService;
    private final FileProcessingService fileProcessingService;
    private final AIService aiService;
    private final ActionItemRepository actionItemRepository;
    private final TranscriptRepository transcriptRepository;

    public MeetingService(MeetingRepository meetingRepository, UserRepository userRepository, MinioService minioService,
                            FileProcessingService fileProcessingService, AIService aiService, ActionItemRepository actionItemRepository,
                            TranscriptRepository transcriptRepository) {
        this.meetingRepository = meetingRepository;
        this.userRepository = userRepository;
        this.minioService = minioService;
        this.fileProcessingService = fileProcessingService;
        this.aiService = aiService;
        this.actionItemRepository = actionItemRepository;
        this.transcriptRepository = transcriptRepository;
    }

    public Meeting createMeeting(MeetingRequestDto request) {
        if (request == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Meeting request is required.");
        }
        if (request.createdByUserId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "CreatedByUserId is required.");
        }

        User createdBy = userRepository.findById(request.createdByUserId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));

        String title = request.title() == null || request.title().isBlank() ? "Untitled meeting" : request.title();
        Meeting meeting = new Meeting();
        meeting.setTitle(title);
        meeting.setCreatedBy(createdBy);
        meeting.setDescription(null);
        meeting.setTranscript(null);
        meeting.setParticipants(new java.util.ArrayList<>());
        meeting.setActionItems(new java.util.ArrayList<>());
        return meetingRepository.save(meeting);
    }

    public Meeting getMeetingById(MeetingIdRequestDto request) {
        if (request == null || request.meetingId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Meeting id is required.");
        }

        return meetingRepository.findById(request.meetingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found."));
    }

    public void deleteMeeting(MeetingIdRequestDto request) {
        if (request == null || request.meetingId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Meeting id is required.");
        }

        if (!meetingRepository.existsById(request.meetingId())) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found.");
        }

        meetingRepository.deleteById(request.meetingId());
    }

    public Meeting updateMeetingTitle(UpdateMeetingTitleRequestDto request) {
        if (request == null || request.meetingId() == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Meeting id is required.");
        }

        Meeting meeting = meetingRepository.findById(request.meetingId())
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found."));

        if (request.title() == null || request.title().isBlank()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Meeting title is required.");
        }

        meeting.setTitle(request.title().trim());
        return meetingRepository.save(meeting);
    }

    public Meeting addParticipant(Long meetingId, Long userId) {
        if (userId == null) {
            throw new BadRequestException("User id is required");
        }
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting not found: " + meetingId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        if (meeting.getParticipants().stream().noneMatch(participant -> participant.getId().equals(userId))) {
            meeting.getParticipants().add(user);
            meeting = meetingRepository.save(meeting);
        }

        return meeting;
    }

    public List<UserResponseDto> getParticipants(Long meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting not found: " + meetingId));

        return meeting.getParticipants().stream()
                .map(user -> new UserResponseDto(
                        user.getId(),
                        user.getEmail(),
                        user.getFirstName(),
                        user.getLastName(),
                        user.getRole(),
                        user.getActivityStatus()))
                .collect(Collectors.toList());
    }

    public Meeting removeParticipant(Long meetingId, Long userId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting not found: " + meetingId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        meeting.getParticipants().removeIf(participant -> participant.getId().equals(user.getId()));
        return meetingRepository.save(meeting);
    }

    public UserResponseDto updateParticipant(Long meetingId, Long userId, UpdateParticipantRequestDto request) {
        if (request == null || (request.firstName() == null
                && request.lastName() == null
                && request.activityStatus() == null)) {
            throw new BadRequestException("At least one field must be provided for update");
        }
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new ResourceNotFoundException("Meeting not found: " + meetingId));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found: " + userId));

        boolean isParticipant = meeting.getParticipants().stream()
                .anyMatch(participant -> participant.getId().equals(userId));
        if (!isParticipant) {
            throw new ResourceNotFoundException("User is not a participant in meeting: " + meetingId);
        }

        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setActivityStatus(request.activityStatus());
        user = userRepository.save(user);

        return new UserResponseDto(
                user.getId(),
                user.getEmail(),
                user.getFirstName(),
                user.getLastName(),
                user.getRole(),
                user.getActivityStatus());
    }

    public Transcript attachTranscript(Long meetingId, MultipartFile file, Long uploadedByUserId) {
        if (meetingId == null) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Meeting id is required.");
        }
        if (file == null || file.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Transcript file is required.");
        }

        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Meeting not found."));

        User uploadedBy = meeting.getCreatedBy();
        if (uploadedByUserId != null) {
            uploadedBy = userRepository.findById(uploadedByUserId)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found."));
        }

        String filePath = minioService.uploadFile(file);
        Transcript transcript = new Transcript(null, uploadedBy, meeting, file.getOriginalFilename(), filePath);
        meeting.setTranscript(transcript);

        return transcriptRepository.save(transcript);
    }

    @Async // Run in background after button click
    @Transactional
    public void processExistingTranscript(Long meetingId) {
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new RuntimeException("Meeting not found"));

        try {
            meeting.setAiStatus(ProcessingStatus.PROCESSING);
            meetingRepository.save(meeting);

            Transcript transcript = meeting.getTranscript();
            if (transcript == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Transcript not found for meeting");
            }
            if (transcript.getFilePath() == null || transcript.getFileName() == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Transcript file info is missing");
            }

            byte[] fileBytes = minioService.getFileBytes(transcript.getFilePath());
            String extractedText = fileProcessingService.extractTextFromStream(
                    new ByteArrayInputStream(fileBytes),
                    transcript.getFileName()
            );

            transcript.setContent(extractedText);
            transcriptRepository.save(transcript);

            TranscriptSummary aiResult = aiService.askAi(extractedText);
            if (aiResult == null) {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "AI response is empty");
            }

            actionItemRepository.deleteByMeetingId(meetingId);
            saveActionItems(aiResult, meeting);

            meeting.setDescription(aiResult.summary());
            meeting.setAiStatus(ProcessingStatus.COMPLETED);

        } catch (Exception e) {
            meeting.setAiStatus(ProcessingStatus.FAILED); // Frontend shows retry
        } finally {
            meetingRepository.save(meeting);
        }
    }

    private void saveActionItems(TranscriptSummary aiResult, Meeting meeting) {
        List<ActionItem> entities = aiResult.actionItemList().stream().map(dto -> {
            ActionItem item = new ActionItem();
            item.setDescription(dto.description());
            item.setAssignee(dto.assignee());
            item.setDeadline(dto.deadline());
            item.setStatus("OPEN");
            item.setMeeting(meeting);

            // Map the AI's confidence scores[cite: 8]
            item.setAssigneeConfidence(dto.confidence());
            item.setDeadlineConfidence(dto.deadlineConfidence());
            item.setStatusConfidence(dto.statusConfidence());
            return item;
        }).toList();

        actionItemRepository.saveAll(entities);
    }
}
