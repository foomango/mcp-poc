package com.aichat.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

/**
 * DTO for chat responses to frontend
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ChatResponse {
    
    private String id;
    private String message;
    private String aiResponse;
    private LocalDateTime timestamp;
    private String sessionId;
    private List<String> mcpToolsUsed;
    private Map<String, Object> context;
    private boolean success;
    private String error;
    
    public ChatResponse(String message, String aiResponse) {
        this.message = message;
        this.aiResponse = aiResponse;
        this.timestamp = LocalDateTime.now();
        this.success = true;
    }
    
    public ChatResponse(String error) {
        this.error = error;
        this.success = false;
        this.timestamp = LocalDateTime.now();
    }
}
