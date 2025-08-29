package com.aichat.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import jakarta.validation.constraints.NotBlank;
import java.util.Map;

/**
 * DTO for chat requests from frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatRequest {
    
    @NotBlank(message = "Message content is required")
    private String message;
    
    private String sessionId;
    private String userId;
    private Map<String, Object> context;
    private boolean useMcp;
    private String[] mcpTools;
}
