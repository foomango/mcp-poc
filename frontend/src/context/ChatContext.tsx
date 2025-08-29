import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface ChatMessage {
  id: string;
  content: string;
  type: 'user' | 'ai' | 'system';
  timestamp: Date;
  sessionId: string;
  aiResponse?: string;
  mcpToolsUsed?: string[];
}

interface ChatState {
  messages: ChatMessage[];
  isLoading: boolean;
  error: string | null;
  sessionId: string;
}

type ChatAction =
  | { type: 'ADD_MESSAGE'; payload: ChatMessage }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'CLEAR_MESSAGES' }
  | { type: 'LOAD_MESSAGES'; payload: ChatMessage[] };

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  error: null,
  sessionId: '',
};

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case 'ADD_MESSAGE':
      return {
        ...state,
        messages: [...state.messages, action.payload],
        error: null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    case 'SET_ERROR':
      return {
        ...state,
        error: action.payload,
        isLoading: false,
      };
    case 'CLEAR_MESSAGES':
      return {
        ...state,
        messages: [],
        error: null,
      };
    case 'LOAD_MESSAGES':
      return {
        ...state,
        messages: action.payload,
        error: null,
      };
    default:
      return state;
  }
}

interface ChatContextType {
  state: ChatState;
  dispatch: React.Dispatch<ChatAction>;
  addMessage: (content: string, type: 'user' | 'ai' | 'system') => void;
  clearMessages: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
  sessionId: string;
}

export function ChatProvider({ children, sessionId }: ChatProviderProps) {
  const [state, dispatch] = useReducer(chatReducer, {
    ...initialState,
    sessionId,
  });

  const addMessage = (content: string, type: 'user' | 'ai' | 'system') => {
    const message: ChatMessage = {
      id: `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      content,
      type,
      timestamp: new Date(),
      sessionId,
    };
    dispatch({ type: 'ADD_MESSAGE', payload: message });
  };

  const clearMessages = () => {
    dispatch({ type: 'CLEAR_MESSAGES' });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const value: ChatContextType = {
    state,
    dispatch,
    addMessage,
    clearMessages,
    setLoading,
    setError,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
}
