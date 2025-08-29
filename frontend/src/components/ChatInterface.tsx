import React, { useState, useRef, useEffect } from 'react';
import { PaperAirplaneIcon } from '@heroicons/react/24/solid';
import { useChat } from '../context/ChatContext';
import { useMcp } from '../context/McpContext';
import { chatApi } from '../services/api';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

const ChatInterface: React.FC = () => {
  const { state: chatState, addMessage, setLoading, setError } = useChat();
  const { state: mcpState } = useMcp();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [inputValue, setInputValue] = useState('');

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatState.messages]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim()) return;

    try {
      setLoading(true);
      setError(null);

      // Add user message to UI immediately
      addMessage(message, 'user');

      // Prepare request with MCP tools if selected
      const request = {
        message: message.trim(),
        sessionId: chatState.sessionId,
        useMcp: mcpState.selectedTools.length > 0,
        mcpTools: mcpState.selectedTools,
      };

      // Send to backend
      const response = await chatApi.sendMessage(request);

      if (response.success) {
        // Add AI response to UI
        addMessage(response.aiResponse, 'ai');
      } else {
        throw new Error(response.error || 'Failed to get response');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      setError(error instanceof Error ? error.message : 'Failed to send message');
      
      // Add error message to chat
      addMessage(
        'Sorry, I encountered an error while processing your message. Please try again.',
        'system'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(inputValue);
      setInputValue('');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {chatState.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mb-4">
              <PaperAirplaneIcon className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to AI Chat
            </h3>
            <p className="text-gray-500 max-w-md">
              Start a conversation with me! I can help you with various tasks using MCP tools.
            </p>
            {mcpState.selectedTools.length > 0 && (
              <div className="mt-4 p-3 bg-primary-50 rounded-lg">
                <p className="text-sm text-primary-700">
                  <strong>Selected tools:</strong> {mcpState.selectedTools.join(', ')}
                </p>
              </div>
            )}
          </div>
        ) : (
          <>
            {chatState.messages.map((message) => (
              <ChatMessage key={message.id} message={message} />
            ))}
            
            {chatState.isLoading && (
              <div className="flex items-center space-x-2 text-gray-500">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            )}
          </>
        )}
        
        {/* Scroll anchor */}
        <div ref={messagesEndRef} />
      </div>

      {/* Error Display */}
      {chatState.error && (
        <div className="mx-4 mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-700">{chatState.error}</p>
        </div>
      )}

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4">
        <ChatInput
          value={inputValue}
          onChange={setInputValue}
          onSend={handleSendMessage}
          onKeyPress={handleKeyPress}
          disabled={chatState.isLoading}
          placeholder="Type your message..."
        />
        
        {/* MCP Tools Indicator */}
        {mcpState.selectedTools.length > 0 && (
          <div className="mt-2 flex items-center space-x-2">
            <span className="text-xs text-gray-500">Using tools:</span>
            <div className="flex space-x-1">
              {mcpState.selectedTools.map((tool) => (
                <span
                  key={tool}
                  className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
