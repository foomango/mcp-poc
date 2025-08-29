package com.aichat.service;

import com.aichat.model.ChatMessage;
import com.aichat.model.ChatRequest;
import com.aichat.model.ChatResponse;
import com.aichat.repository.ChatMessageRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import reactor.core.publisher.Mono;
import java.util.*;
import java.util.concurrent.CompletableFuture;

/**
 * Service for handling chat operations and AI responses
 */
@Service
@RequiredArgsConstructor
@Slf4j
public class ChatService {
    
    private final ChatMessageRepository chatMessageRepository;
    private final McpService mcpService;
    
    /**
     * Process a chat message and generate AI response
     */
    public Mono<ChatResponse> processMessage(ChatRequest request) {
        return Mono.fromCallable(() -> {
            // Save user message
            ChatMessage userMessage = new ChatMessage();
            userMessage.setContent(request.getMessage());
            userMessage.setType(ChatMessage.MessageType.USER);
            userMessage.setSessionId(request.getSessionId());
            userMessage.setUserId(request.getUserId());
            chatMessageRepository.save(userMessage);
            
            // Generate AI response
            String aiResponse = generateAiResponse(request);
            
            // Save AI response
            ChatMessage aiMessage = new ChatMessage();
            aiMessage.setContent(aiResponse);
            aiMessage.setType(ChatMessage.MessageType.AI);
            aiMessage.setSessionId(request.getSessionId());
            aiMessage.setUserId(request.getUserId());
            aiMessage.setAiResponse(aiResponse);
            
            // If MCP tools were used, record them
            if (request.isUseMcp() && request.getMcpTools() != null) {
                aiMessage.setMcpToolsUsed(String.join(",", request.getMcpTools()));
            }
            
            chatMessageRepository.save(aiMessage);
            
            // Create response
            ChatResponse response = new ChatResponse(request.getMessage(), aiResponse);
            response.setId(aiMessage.getId().toString());
            response.setSessionId(request.getSessionId());
            
            if (request.isUseMcp() && request.getMcpTools() != null) {
                response.setMcpToolsUsed(Arrays.asList(request.getMcpTools()));
            }
            
            return response;
        });
    }
    
    /**
     * Generate AI response with optional MCP tool usage
     */
    private String generateAiResponse(ChatRequest request) {
        StringBuilder response = new StringBuilder();
        
        // Basic AI response generation
        response.append("I understand you said: \"").append(request.getMessage()).append("\"\n\n");
        
        // If MCP tools are requested, use them
        if (request.isUseMcp() && request.getMcpTools() != null) {
            response.append("I'll use the following tools to help you:\n");
            for (String tool : request.getMcpTools()) {
                response.append("- ").append(tool).append("\n");
            }
            response.append("\n");
            
            // Simulate tool usage
            response.append("Tool execution results:\n");
            for (String tool : request.getMcpTools()) {
                response.append("• ").append(tool).append(": Operation completed successfully\n");
            }
        }
        
        // Add some contextual response based on the message
        String message = request.getMessage().toLowerCase();
        if (message.contains("hello") || message.contains("hi")) {
            response.append("Hello! How can I assist you today?");
        } else if (message.contains("help")) {
            response.append("I'm here to help! You can ask me questions, request file operations, web searches, or code execution through MCP tools.");
        } else if (message.contains("file") || message.contains("read") || message.contains("write")) {
            response.append("I can help you with file operations. Would you like me to read, write, or list files?");
        } else if (message.contains("search") || message.contains("web")) {
            response.append("I can search the web for current information. What would you like me to search for?");
        } else if (message.contains("code") || message.contains("execute")) {
            response.append("I can execute code in various programming languages. What code would you like me to run?");
        } else {
            response.append("Thank you for your message. I'm here to help with various tasks including file operations, web searches, and code execution.");
        }
        
        return response.toString();
    }
    
    /**
     * Get chat history for a session
     */
    public List<ChatMessage> getChatHistory(String sessionId) {
        return chatMessageRepository.findBySessionIdOrderByTimestampAsc(sessionId);
    }
    
    /**
     * Clear chat history for a session
     */
    public void clearChatHistory(String sessionId) {
        chatMessageRepository.deleteBySessionId(sessionId);
    }
    
    /**
     * Get recent messages for a session
     */
    public List<ChatMessage> getRecentMessages(String sessionId, int limit) {
        return chatMessageRepository.findRecentBySessionId(
            sessionId, 
            org.springframework.data.domain.PageRequest.of(0, limit)
        );
    }
    
    /**
     * Get available MCP tools
     */
    public List<com.aichat.model.McpTool> getAvailableMcpTools() {
        return mcpService.getAvailableTools();
    }
    
    /**
     * Execute an MCP tool
     */
    public Mono<Object> executeMcpTool(String toolName, Map<String, Object> parameters) {
        return mcpService.executeTool(toolName, parameters);
    }
}
