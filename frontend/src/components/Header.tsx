import React from 'react';
import { Bars3Icon, SparklesIcon } from '@heroicons/react/24/outline';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  return (
    <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <Bars3Icon className="h-6 w-6 text-gray-600" />
        </button>
        
        <div className="flex items-center space-x-2">
          <SparklesIcon className="h-8 w-8 text-primary-600" />
          <h1 className="text-xl font-bold text-gray-900">AI Chat</h1>
          <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
            MCP
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <div className="hidden sm:flex items-center space-x-1 text-sm text-gray-500">
          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
          <span>Connected</span>
        </div>
      </div>
    </header>
  );
};

export default Header;
