import React, { createContext, useContext, useReducer, ReactNode } from 'react';

export interface McpTool {
  name: string;
  description: string;
  inputSchema?: string;
  outputSchema?: string;
  capabilities?: string[];
  parameters?: Record<string, any>;
  enabled: boolean;
}

interface McpState {
  tools: McpTool[];
  isLoading: boolean;
  error: string | null;
  selectedTools: string[];
}

type McpAction =
  | { type: 'SET_TOOLS'; payload: McpTool[] }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'SELECT_TOOL'; payload: string }
  | { type: 'DESELECT_TOOL'; payload: string }
  | { type: 'CLEAR_SELECTED_TOOLS' };

const initialState: McpState = {
  tools: [],
  isLoading: false,
  error: null,
  selectedTools: [],
};

function mcpReducer(state: McpState, action: McpAction): McpState {
  switch (action.type) {
    case 'SET_TOOLS':
      return {
        ...state,
        tools: action.payload,
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
    case 'SELECT_TOOL':
      return {
        ...state,
        selectedTools: state.selectedTools.includes(action.payload)
          ? state.selectedTools
          : [...state.selectedTools, action.payload],
      };
    case 'DESELECT_TOOL':
      return {
        ...state,
        selectedTools: state.selectedTools.filter(tool => tool !== action.payload),
      };
    case 'CLEAR_SELECTED_TOOLS':
      return {
        ...state,
        selectedTools: [],
      };
    default:
      return state;
  }
}

interface McpContextType {
  state: McpState;
  dispatch: React.Dispatch<McpAction>;
  selectTool: (toolName: string) => void;
  deselectTool: (toolName: string) => void;
  clearSelectedTools: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

const McpContext = createContext<McpContextType | undefined>(undefined);

interface McpProviderProps {
  children: ReactNode;
}

export function McpProvider({ children }: McpProviderProps) {
  const [state, dispatch] = useReducer(mcpReducer, initialState);

  const selectTool = (toolName: string) => {
    dispatch({ type: 'SELECT_TOOL', payload: toolName });
  };

  const deselectTool = (toolName: string) => {
    dispatch({ type: 'DESELECT_TOOL', payload: toolName });
  };

  const clearSelectedTools = () => {
    dispatch({ type: 'CLEAR_SELECTED_TOOLS' });
  };

  const setLoading = (loading: boolean) => {
    dispatch({ type: 'SET_LOADING', payload: loading });
  };

  const setError = (error: string | null) => {
    dispatch({ type: 'SET_ERROR', payload: error });
  };

  const value: McpContextType = {
    state,
    dispatch,
    selectTool,
    deselectTool,
    clearSelectedTools,
    setLoading,
    setError,
  };

  return (
    <McpContext.Provider value={value}>
      {children}
    </McpContext.Provider>
  );
}

export function useMcp() {
  const context = useContext(McpContext);
  if (context === undefined) {
    throw new Error('useMcp must be used within a McpProvider');
  }
  return context;
}
