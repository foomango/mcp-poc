import React, { useEffect } from 'react';
import { XMarkIcon, TrashIcon, Cog6ToothIcon } from '@heroicons/react/24/outline';
import { useChat } from '../context/ChatContext';
import { useMcp } from '../context/McpContext';
import { mcpApi } from '../services/api';
import { format } from 'date-fns';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { state: chatState, clearMessages } = useChat();
  const { state: mcpState, dispatch: mcpDispatch, selectTool, deselectTool } = useMcp();

  useEffect(() => {
    const loadMcpTools = async () => {
      try {
        mcpDispatch({ type: 'SET_LOADING', payload: true });
        const tools = await mcpApi.getTools();
        mcpDispatch({ type: 'SET_TOOLS', payload: tools });
      } catch (error) {
        mcpDispatch({ type: 'SET_ERROR', payload: 'Failed to load MCP tools' });
        console.error('Error loading MCP tools:', error);
      } finally {
        mcpDispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    loadMcpTools();
  }, [mcpDispatch]);

  const handleToolToggle = (toolName: string) => {
    if (mcpState.selectedTools.includes(toolName)) {
      deselectTool(toolName);
    } else {
      selectTool(toolName);
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Tools & History</h2>
            <button
              onClick={onClose}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <XMarkIcon className="h-5 w-5 text-gray-600" />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto">
            {/* MCP Tools Section */}
            <div className="p-4">
              <h3 className="text-sm font-medium text-gray-900 mb-3 flex items-center">
                <Cog6ToothIcon className="h-4 w-4 mr-2" />
                MCP Tools
              </h3>
              
              {mcpState.isLoading ? (
                <div className="text-sm text-gray-500">Loading tools...</div>
              ) : mcpState.error ? (
                <div className="text-sm text-red-500">{mcpState.error}</div>
              ) : (
                <div className="space-y-2">
                  {mcpState.tools.map((tool) => (
                    <div
                      key={tool.name}
                      className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                        mcpState.selectedTools.includes(tool.name)
                          ? 'border-primary-300 bg-primary-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      onClick={() => handleToolToggle(tool.name)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">
                            {tool.name}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            {tool.description}
                          </p>
                        </div>
                        <div
                          className={`w-4 h-4 rounded border-2 ${
                            mcpState.selectedTools.includes(tool.name)
                              ? 'bg-primary-600 border-primary-600'
                              : 'border-gray-300'
                          }`}
                        >
                          {mcpState.selectedTools.includes(tool.name) && (
                            <svg className="w-full h-full text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Chat History Section */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-medium text-gray-900">Chat History</h3>
                <button
                  onClick={clearMessages}
                  className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                  title="Clear history"
                >
                  <TrashIcon className="h-4 w-4" />
                </button>
              </div>
              
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {chatState.messages.length === 0 ? (
                  <div className="text-sm text-gray-500 text-center py-4">
                    No messages yet
                  </div>
                ) : (
                  chatState.messages.slice(-10).map((message) => (
                    <div
                      key={message.id}
                      className="p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer"
                    >
                      <div className="text-xs text-gray-500 mb-1">
                        {format(new Date(message.timestamp), 'HH:mm')}
                      </div>
                      <div className="text-sm text-gray-900 truncate">
                        {message.content}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="text-xs text-gray-500">
              Session: {chatState.sessionId.slice(-8)}
            </div>
            <div className="text-xs text-gray-400 mt-1">
              {mcpState.selectedTools.length} tools selected
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
