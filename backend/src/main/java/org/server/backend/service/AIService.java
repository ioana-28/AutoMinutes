package org.server.backend.service;

import org.jspecify.annotations.Nullable;
import org.server.backend.dto.AIResponseDto;
import org.server.backend.model.AIResponseFormat.TranscriptSummary;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.StructuredOutputValidationAdvisor;
import org.springframework.ai.ollama.api.OllamaChatOptions;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Locale;

@Service
public class AIService {

    private static final Logger log = LoggerFactory.getLogger(AIService.class);

    private final ChatClient chatClient;
    private final String activeProvider;

    public AIService(
            ChatClient.Builder builder,
            @Value("${app.ai.provider:ollama}") String provider
    ) {
        this.chatClient = builder.defaultSystem(
                "You are a helpful assistant that analyzes meeting transcripts and produces clear, structured outputs. Your responsibilities are:\n" +
                        "\n" +
                        "Summarize the meeting in a concise and well-organized manner, capturing key discussions, decisions, and outcomes.\n" +
                        "Extract and generate action items, ensuring that:\n" +
                        "No action item mentioned or implied in the transcript is missed\n" +
                        "Each item includes:\n" +
                        "Task description\n" +
                        "Responsible person (if mentioned)\n" +
                        "Deadline (if available)\n" +
                        "Maintain clarity and brevity — avoid unnecessary details while preserving important information.\n" +
                        "Structure the response using clear sections such as:\n" +
                        "Summary\n" +
                        "Action Items\n" +
                        "If information is missing (e.g., no deadlines or owners), make reasonable assumptions only when appropriate, otherwise mark them as unspecified.\n" +
                        "\n" +
                        "Your tone should be professional, neutral, and easy to read. Avoid speculation beyond what is supported by the transcript." +
                        "Always respond in the same language as the input transcript.\n"
        ).build();

        String normalizedProvider = provider == null ? "ollama" : provider.trim().toLowerCase(Locale.ROOT);
        this.activeProvider = switch (normalizedProvider) {
            case "ollama", "deepseek" -> normalizedProvider;
            default -> {
                log.warn("Unsupported app.ai.provider='{}'. Falling back to 'ollama'.", provider);
                yield "ollama";
            }
        };
    }

    public @Nullable TranscriptSummary askAi(String userPrompt) {
        log.debug("Received user prompt with {} chars", userPrompt == null ? 0 : userPrompt.length());
        String prompt = String.format(
                """
                Here is the meeting transcript:
            
                \"\"\"
                %s
                \"\"\"
            
                Please analyze it carefully and provide a structured summary and all action items.
                Respond in the transcript's language.
                """,
                userPrompt
        );

        var promptCall = this.chatClient.prompt()
                .user(prompt)
                .advisors(StructuredOutputValidationAdvisor.builder().outputType(TranscriptSummary.class).maxRepeatAttempts(3).build());

        if ("ollama".equals(activeProvider)) {
            promptCall = promptCall.options(OllamaChatOptions.builder().disableThinking().build());
        }

        return promptCall
                .call()
                .entity(TranscriptSummary.class);
    }

    public AIResponseDto processTranscript(Long transcriptId) {
        return new AIResponseDto("Processing not implemented yet.");
    }
}
