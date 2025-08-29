import React from 'react';
import { format } from 'date-fns';
import { ChatMessage as ChatMessageType } from '../context/ChatContext';
import { UserIcon, SparklesIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const getMessageIcon = () => {
    switch (message.type) {
      case 'user':
        return <UserIcon className="h-5 w-5 text-white" />;
      case 'ai':
        return <SparklesIcon className="h-5 w-5 text-primary-600" />;
      case 'system':
        return <ExclamationTriangleIcon className="h-5 w-5 text-yellow-600" />;
      default:
        return null;
    }
  };

  const getMessageStyles = () => {
    switch (message.type) {
      case 'user':
        return 'bg-primary-500 text-white ml-auto max-w-3xl';
      case 'ai':
        return 'bg-white border border-gray-200 shadow-sm max-w-3xl';
      case 'system':
        return 'bg-yellow-50 border border-yellow-200 text-yellow-800 max-w-2xl mx-auto';
      default:
        return 'bg-gray-100 text-gray-900';
    }
  };

  const getAvatarStyles = () => {
    switch (message.type) {
      case 'user':
        return 'bg-primary-600 text-white';
      case 'ai':
        return 'bg-primary-100 text-primary-600';
      case 'system':
        return 'bg-yellow-100 text-yellow-600';
      default:
        return 'bg-gray-200 text-gray-600';
    }
  };

  return (
    <div className={`flex items-start space-x-3 ${message.type === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${getAvatarStyles()}`}>
        {getMessageIcon()}
      </div>

      {/* Message Content */}
      <div className={`flex-1 min-w-0 ${message.type === 'user' ? 'text-right' : ''}`}>
        <div className={`p-4 rounded-lg ${getMessageStyles()}`}>
          {/* Message Header */}
          <div className={`flex items-center justify-between mb-2 ${message.type === 'user' ? 'flex-row-reverse' : ''}`}>
            <span className="text-xs font-medium opacity-75">
              {message.type === 'user' ? 'You' : message.type === 'ai' ? 'AI Assistant' : 'System'}
            </span>
            <span className="text-xs opacity-60">
              {format(new Date(message.timestamp), 'HH:mm')}
            </span>
          </div>

          {/* Message Text */}
          <div className="whitespace-pre-wrap break-words">
            {message.content}
          </div>

          {/* MCP Tools Used */}
          {message.mcpToolsUsed && message.mcpToolsUsed.length > 0 && (
            <div className="mt-3 pt-3 border-t border-gray-200">
              <div className="flex items-center space-x-2">
                <span className="text-xs text-gray-500">Tools used:</span>
                <div className="flex flex-wrap gap-1">
                  {message.mcpToolsUsed.map((tool, index) => (
                    <span
                      key={index}
                      className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full"
                    >
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
