package org.server.backend.service;

import org.jspecify.annotations.Nullable;
import org.server.backend.dto.AIResponseDto;
import org.server.backend.dto.TranscriptSummary;
import org.springframework.ai.chat.client.ChatClient;
import org.springframework.ai.chat.client.advisor.StructuredOutputValidationAdvisor;
import org.springframework.ai.ollama.api.OllamaChatOptions;
import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final ChatClient chatClient;

    public AIService(ChatClient.Builder builder) {
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
    }

    public @Nullable TranscriptSummary askAi(String userPrompt) {
        System.out.println("Received user prompt: " + userPrompt);
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
        return this.chatClient.prompt()
                .user(prompt)
                .options(OllamaChatOptions.builder().disableThinking().build())
                .advisors(StructuredOutputValidationAdvisor.builder().outputType(TranscriptSummary.class).maxRepeatAttempts(3).build())
                .call()
                .entity(TranscriptSummary.class);
    }

    public AIResponseDto processTranscript(Long transcriptId) {
		return new AIResponseDto("Processing not implemented yet.");
	}
}
