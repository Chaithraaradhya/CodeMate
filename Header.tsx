import React from 'react';
import { Code2, Settings, Download, History } from 'lucide-react';

interface HeaderProps {
  onExportPDF: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onExportPDF }) => {
  return (
    <header className="bg-gray-900 border-b border-gray-700 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 p-2 rounded-lg">
            <Code2 className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">CodeMate</h1>
            <p className="text-sm text-gray-400">AI-Powered Code Analysis Tool</p>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <History className="w-4 h-4" />
            <span>History</span>
          </button>
          <button className="flex items-center space-x-2 px-4 py-2 text-gray-300 hover:text-white hover:bg-gray-800 rounded-lg transition-colors">
            <Settings className="w-4 h-4" />
            <span>Settings</span>
          </button>
          <button
            onClick={onExportPDF}
            className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export PDF</span>
          </button>
        </div>
      </div>
    </header>
  );
};