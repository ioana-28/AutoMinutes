package org.server.backend.service;

import org.jspecify.annotations.Nullable;
import org.server.backend.dto.AIResponseDto;
import org.server.backend.model.AIResponseFormat.TranscriptSummary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.StructuredOutputValidationAdvisor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.Locale;

@Service
public class AIService {

    private static final Logger log = LoggerFactory.getLogger(AIService.class);

    private final ChatClient chatClient;

    public AIService(ChatClient.Builder builder) {

        this.chatClient = builder.defaultSystem(
                """
                You are a helpful assistant that analyzes meeting transcripts and produces clear, structured outputs. Your responsibilities are:
        
                Summarize the meeting in a concise and well-organized manner, capturing key discussions, decisions, and outcomes.
        
                Extract and generate action items, ensuring that:
                No action item mentioned or implied in the transcript is missed
                Each item includes:
                Task description
                Responsible person (if mentioned)
                Deadline (if available)
        
                Maintain clarity and brevity — avoid unnecessary details while preserving important information.
        
                Structure the response using clear sections such as:
                Summary
                Action Items
        
                If information is missing (e.g., no deadlines or owners), make reasonable assumptions only when appropriate, otherwise mark them as unspecified.
        
                Your tone should be professional, neutral, and easy to read. Avoid speculation beyond what is supported by the transcript.
                ALWAYS respond in the transcript's language.
                DON'T RESPOND IN PORTUGUESE/SPANISH/GERMAN
                """
        ).build();

    }

    public @Nullable TranscriptSummary askAi(String userPrompt) {
        return askAi(userPrompt, null);
    }

    public @Nullable TranscriptSummary askAi(String userPrompt, LocalDate meetingDate) {
        String meetingDateLine = meetingDate == null
                ? "Meeting date: unknown."
                : "Meeting date: " + meetingDate + " (YYYY-MM-DD).";
        String prompt = String.format(
                """
                %s

                Here is the meeting transcript:

                <TRANSCRIPT>
                %s
                </TRANSCRIPT>

                Please analyze it carefully and provide a structured summary and all action items.
                Also extract all the meeting participants as a list of full names exactly as mentioned in the transcript. 
                Extract every time the full list of participants mentioned in the transcript.
                If a deadline is expressed as a day of the week (e.g., Monday), resolve it to a calendar date based on the meeting date.
                Output deadlines only as ISO dates (YYYY-MM-DD). If missing, return null.
                Respond ONLY in the transcript's language.
                """,
                meetingDateLine,
                userPrompt
        );

        var promptCall = this.chatClient.prompt()
                .user(prompt)
                .advisors(StructuredOutputValidationAdvisor.builder()
                .outputType(TranscriptSummary.class).maxRepeatAttempts(3).build());


        return promptCall
                .call()
                .entity(TranscriptSummary.class);
    }

    public @Nullable TranscriptSummary askAiForTarget(String userPrompt, LocalDate meetingDate, String target) {
        String cleanTarget = target != null ? target.trim().toLowerCase(Locale.ROOT) : "all";
        String targetInstruction = switch(cleanTarget) {
            case "action_items" ->
                """
                    Please focus on extracting all action items from the transcript, ensuring that no action item mentioned is missing.
                    Don't focus on returning the summary and the participants list, leave them empty.
                """;
            case "participants" ->
                """
                    Please focus on extracting all participants mentioned in the transcript, ensuring that no participants mentioned is missing.
                    Don't focus on returning the summary and the action items, leave them empty.
                """;
            default ->
                """
                    Summarize the meeting in a concise and well-organized manner.
                    Extract and generate action items.
                    Extract all the meeting participants as a list of full names exactly as mentioned.
                """;

        };

        String meetingDateLine = meetingDate == null
                ? "Meeting date: unknown."
                : "Meeting date: " + meetingDate + " (YYYY-MM-DD).";
        String prompt = String.format(
                """
                %s

                Here is the meeting transcript:

                <TRANSCRIPT>
                %s
                </TRANSCRIPT>

                Please analyze it carefully. These are the instructions for this task:
                %s
                
                Also extract all the meeting participants as a list of full names exactly as mentioned in the transcript. 
                Extract every time the full list of participants mentioned in the transcript.
                If a deadline is expressed as a day of the week (e.g., Monday), resolve it to a calendar date based on the meeting date.
                Output deadlines only as ISO dates (YYYY-MM-DD). If missing, return null.
                Respond ONLY in the transcript's language.
                """,
                meetingDateLine,
                userPrompt,
                targetInstruction
        );

        var promptCall = this.chatClient.prompt()
                .user(prompt)
                .advisors(StructuredOutputValidationAdvisor.builder()
                        .outputType(TranscriptSummary.class).maxRepeatAttempts(3).build());


        return promptCall
                .call()
                .entity(TranscriptSummary.class);
    }

    public AIResponseDto processTranscript(Long transcriptId) {
        return new AIResponseDto("Processing not implemented yet.");
    }
}
