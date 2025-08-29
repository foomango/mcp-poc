package com.aichat.controller;

import com.aichat.model.McpTool;
import com.aichat.service.ChatService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import reactor.core.publisher.Mono;
import java.util.List;
import java.util.Map;

/**
 * REST controller for MCP operations
 */
@RestController
@RequestMapping("/api/mcp")
@RequiredArgsConstructor
@Slf4j
@CrossOrigin(origins = "*")
public class McpController {
    
    private final ChatService chatService;
    
    /**
     * Get all available MCP tools
     */
    @GetMapping("/tools")
    public ResponseEntity<List<McpTool>> getAvailableTools() {
        log.info("Retrieving available MCP tools");
        List<McpTool> tools = chatService.getAvailableMcpTools();
        return ResponseEntity.ok(tools);
    }
    
    /**
     * Execute an MCP tool
     */
    @PostMapping("/execute")
    public Mono<ResponseEntity<Object>> executeTool(
            @RequestParam String toolName,
            @RequestBody Map<String, Object> parameters) {
        log.info("Executing MCP tool: {} with parameters: {}", toolName, parameters);
        
        return chatService.executeMcpTool(toolName, parameters)
                .map(result -> {
                    log.info("MCP tool execution completed successfully: {}", toolName);
                    return ResponseEntity.ok(result);
                })
                .onErrorResume(error -> {
                    log.error("Error executing MCP tool: {}", toolName, error);
                    Map<String, String> errorResponse = Map.of(
                        "error", "Tool execution failed",
                        "message", error.getMessage(),
                        "tool", toolName
                    );
                    return Mono.just(ResponseEntity.badRequest().body(errorResponse));
                });
    }
    
    /**
     * Get specific MCP tool information
     */
    @GetMapping("/tools/{toolName}")
    public ResponseEntity<McpTool> getToolInfo(@PathVariable String toolName) {
        log.info("Retrieving information for MCP tool: {}", toolName);
        List<McpTool> tools = chatService.getAvailableMcpTools();
        
        return tools.stream()
                .filter(tool -> tool.getName().equals(toolName))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    /**
     * Health check for MCP service
     */
    @GetMapping("/health")
    public ResponseEntity<Map<String, String>> health() {
        return ResponseEntity.ok(Map.of("status", "healthy", "service", "mcp"));
    }
}
