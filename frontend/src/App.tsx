import React, { useState, useEffect } from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import ChatInterface from './components/ChatInterface';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import { ChatProvider } from './context/ChatContext';
import { McpProvider } from './context/McpContext';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  return (
    <QueryClientProvider client={queryClient}>
      <ChatProvider sessionId={sessionId}>
        <McpProvider>
          <div className="h-screen flex bg-gray-50">
            {/* Sidebar */}
            <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
            
            {/* Main Content */}
            <div className="flex-1 flex flex-col">
              <Header onMenuClick={() => setSidebarOpen(true)} />
              
              <main className="flex-1 flex">
                <ChatInterface />
              </main>
            </div>
          </div>
        </McpProvider>
      </ChatProvider>
    </QueryClientProvider>
  );
}

export default App;
