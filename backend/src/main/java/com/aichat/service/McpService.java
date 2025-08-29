package com.aichat.service;

import com.aichat.model.McpTool;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import java.util.*;
import java.nio.file.*;
import java.io.IOException;

/**
 * Service for handling Model Context Protocol (MCP) operations
 */
@Service
@Slf4j
public class McpService {
    
    private final WebClient webClient;
    private final Map<String, McpTool> availableTools;
    
    public McpService() {
        this.webClient = WebClient.builder()
                .baseUrl("http://localhost:3001") // Default MCP server URL
                .build();
        
        this.availableTools = initializeDefaultTools();
    }
    
    /**
     * Initialize default MCP tools
     */
    private Map<String, McpTool> initializeDefaultTools() {
        Map<String, McpTool> tools = new HashMap<>();
        
        // File system tool
        tools.put("filesystem", new McpTool(
            "filesystem",
            "Access and manipulate files on the local filesystem"
        ));
        
        // Web search tool
        tools.put("web_search", new McpTool(
            "web_search",
            "Search the web for current information"
        ));
        
        // Code execution tool
        tools.put("code_execution", new McpTool(
            "code_execution",
            "Execute code in various programming languages"
        ));
        
        // Database tool
        tools.put("database", new McpTool(
            "database",
            "Query and manipulate databases"
        ));
        
        return tools;
    }
    
    /**
     * Get all available MCP tools
     */
    public List<McpTool> getAvailableTools() {
        return new ArrayList<>(availableTools.values());
    }
    
    /**
     * Execute an MCP tool
     */
    public Mono<Object> executeTool(String toolName, Map<String, Object> parameters) {
        McpTool tool = availableTools.get(toolName);
        if (tool == null) {
            return Mono.error(new IllegalArgumentException("Tool not found: " + toolName));
        }
        
        return switch (toolName) {
            case "filesystem" -> executeFileSystemTool(parameters);
            case "web_search" -> executeWebSearchTool(parameters);
            case "code_execution" -> executeCodeTool(parameters);
            case "database" -> executeDatabaseTool(parameters);
            default -> Mono.error(new IllegalArgumentException("Unsupported tool: " + toolName));
        };
    }
    
    /**
     * Execute filesystem operations
     */
    private Mono<Object> executeFileSystemTool(Map<String, Object> parameters) {
        String operation = (String) parameters.get("operation");
        String path = (String) parameters.get("path");
        
        return Mono.fromCallable(() -> {
            try {
                return switch (operation) {
                    case "read" -> Files.readString(Paths.get(path));
                    case "write" -> {
                        String content = (String) parameters.get("content");
                        Files.writeString(Paths.get(path), content);
                        yield "File written successfully";
                    }
                    case "list" -> {
                        Path dirPath = Paths.get(path);
                        List<String> files = new ArrayList<>();
                        Files.list(dirPath).forEach(p -> files.add(p.getFileName().toString()));
                        yield files;
                    }
                    case "exists" -> Files.exists(Paths.get(path));
                    default -> throw new IllegalArgumentException("Unsupported filesystem operation: " + operation);
                };
            } catch (IOException e) {
                throw new RuntimeException("Filesystem operation failed: " + e.getMessage());
            }
        });
    }
    
    /**
     * Execute web search operations
     */
    private Mono<Object> executeWebSearchTool(Map<String, Object> parameters) {
        String query = (String) parameters.get("query");
        
        // This would typically call a real search API
        return Mono.just(Map.of(
            "query", query,
            "results", List.of(
                Map.of("title", "Sample result for: " + query, "url", "https://example.com", "snippet", "This is a sample search result")
            )
        ));
    }
    
    /**
     * Execute code operations
     */
    private Mono<Object> executeCodeTool(Map<String, Object> parameters) {
        String code = (String) parameters.get("code");
        String language = (String) parameters.get("language");
        
        // This would typically execute code in a sandboxed environment
        return Mono.just(Map.of(
            "language", language,
            "output", "Code execution result for: " + language,
            "executionTime", System.currentTimeMillis()
        ));
    }
    
    /**
     * Execute database operations
     */
    private Mono<Object> executeDatabaseTool(Map<String, Object> parameters) {
        String query = (String) parameters.get("query");
        String database = (String) parameters.get("database");
        
        // This would typically execute database queries
        return Mono.just(Map.of(
            "database", database,
            "query", query,
            "result", "Database query executed successfully"
        ));
    }
    
    /**
     * Check if MCP server is available
     */
    public Mono<Boolean> isMcpServerAvailable() {
        return webClient.get()
                .uri("/health")
                .retrieve()
                .toBodilessEntity()
                .map(response -> true)
                .onErrorReturn(false);
    }
}
