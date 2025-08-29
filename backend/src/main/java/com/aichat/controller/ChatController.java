package com.aichat.controller;

import com.aichat.model.ChatMessage;
import com.aichat.model.ChatRequest;
import com.aichat.model.ChatResponse;
import com.aichat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

/**
 * REST controller for chat operations
 */
@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class ChatController {
    
    private final ChatService chatService;
    
    /**
     * Send a chat message and get AI response
     */
    @PostMapping
    public Mono<ResponseEntity<ChatResponse>> sendMessage(@Valid @RequestBody ChatRequest request) {
        log.info("Received chat request: {}", request.getMessage());
        
        return chatService.processMessage(request)
                .map(response -> {
                    log.info("Generated AI response for session: {}", response.getSessionId());
                    return ResponseEntity.ok(response);
                })
                .onErrorResume(error -> {
                    log.error("Error processing chat message", error);
                    ChatResponse errorResponse = new ChatResponse("Error processing message: " + error.getMessage());
                    return Mono.just(ResponseEntity.badRequest().body(errorResponse));
                });
    }
    
    /**
     * Get chat history for a session
     */
    @GetMapping("/history")
    public ResponseEntity<List<ChatMessage>> getChatHistory(@RequestParam String sessionId) {
        log.info("Retrieving chat history for session: {}", sessionId);
        List<ChatMessage> history = chatService.getChatHistory(sessionId);
        return ResponseEntity.ok(history);
    }
    
    /**
     * Get recent messages for a session
     */
    @GetMapping("/recent")
    public ResponseEntity<List<ChatMessage>> getRecentMessages(
            @RequestParam String sessionId,
            @RequestParam(defaultValue = "10") int limit) {
        log.info("Retrieving recent messages for session: {} with limit: {}", sessionId, limit);
        List<ChatMessage> recent = chatService.getRecentMessages(sessionId, limit);
        return ResponseEntity.ok(recent);
    }
    
    /**
     * Clear chat history for a session
     */
    @DeleteMapping("/history")
    public ResponseEntity<Void> clearChatHistory(@RequestParam String sessionId) {
        log.info("Clearing chat history for session: {}", sessionId);
        chatService.clearChatHistory(sessionId);
        return ResponseEntity.ok().build();
    }
    
    /**
     * Health check endpoint
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "healthy", "service", "chat"));
    }
}
