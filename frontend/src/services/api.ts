import axios from 'axios';
import { ChatMessage } from '../context/ChatContext';
import { McpTool } from '../context/McpContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8888';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Chat API
export interface ChatRequest {
  message: string;
  sessionId: string;
  userId?: string;
  context?: Record<string, any>;
  useMcp?: boolean;
  mcpTools?: string[];
}

export interface ChatResponse {
  id: string;
  message: string;
  aiResponse: string;
  timestamp: string;
  sessionId: string;
  mcpToolsUsed?: string[];
  context?: Record<string, any>;
  success: boolean;
  error?: string;
}

export const chatApi = {
  sendMessage: async (request: ChatRequest): Promise<ChatResponse> => {
    const response = await api.post('/api/chat', request);
    return response.data;
  },

  getHistory: async (sessionId: string): Promise<ChatMessage[]> => {
    const response = await api.get(`/api/chat/history?sessionId=${sessionId}`);
    return response.data;
  },

  getRecentMessages: async (sessionId: string, limit: number = 10): Promise<ChatMessage[]> => {
    const response = await api.get(`/api/chat/recent?sessionId=${sessionId}&limit=${limit}`);
    return response.data;
  },

  clearHistory: async (sessionId: string): Promise<void> => {
    await api.delete(`/api/chat/history?sessionId=${sessionId}`);
  },

  health: async (): Promise<{ status: string; service: string }> => {
    const response = await api.get('/api/chat/health');
    return response.data;
  },
};

// MCP API
export interface McpExecuteRequest {
  toolName: string;
  parameters: Record<string, any>;
}

export const mcpApi = {
  getTools: async (): Promise<McpTool[]> => {
    const response = await api.get('/api/mcp/tools');
    return response.data;
  },

  executeTool: async (toolName: string, parameters: Record<string, any>): Promise<any> => {
    const response = await api.post(`/api/mcp/execute?toolName=${toolName}`, parameters);
    return response.data;
  },

  getToolInfo: async (toolName: string): Promise<McpTool> => {
    const response = await api.get(`/api/mcp/tools/${toolName}`);
    return response.data;
  },

  health: async (): Promise<{ status: string; service: string }> => {
    const response = await api.get('/api/mcp/health');
    return response.data;
  },
};

// Error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error);
    
    if (error.response) {
      // Server responded with error status
      const message = error.response.data?.message || error.response.data?.error || 'An error occurred';
      throw new Error(message);
    } else if (error.request) {
      // Request was made but no response received
      throw new Error('No response from server. Please check your connection.');
    } else {
      // Something else happened
      throw new Error('An unexpected error occurred.');
    }
  }
);

export default api;
