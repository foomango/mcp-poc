package com.aichat.model;

import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;
import java.util.List;
import java.util.Map;

/**
 * Model representing an MCP tool
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class McpTool {
    
    private String name;
    private String description;
    private String inputSchema;
    private String outputSchema;
    private List<String> capabilities;
    private Map<String, Object> parameters;
    private boolean enabled;
    
    public McpTool(String name, String description) {
        this.name = name;
        this.description = description;
        this.enabled = true;
    }
}
