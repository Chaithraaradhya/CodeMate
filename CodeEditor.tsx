import React, { useState, useRef } from 'react';
import { Upload, Play, FileCode, Trash2 } from 'lucide-react';

interface CodeEditorProps {
  code: string;
  language: string;
  onCodeChange: (code: string) => void;
  onLanguageChange: (language: string) => void;
  onAnalyze: () => void;
  isAnalyzing: boolean;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  code,
  language,
  onCodeChange,
  onLanguageChange,
  onAnalyze,
  isAnalyzing
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        onCodeChange(content);
        
        // Auto-detect language from file extension
        const extension = file.name.split('.').pop()?.toLowerCase();
        if (extension === 'java') onLanguageChange('java');
        else if (extension === 'py') onLanguageChange('python');
        else if (extension === 'cpp' || extension === 'cc' || extension === 'cxx') onLanguageChange('cpp');
      };
      reader.readAsText(file);
    }
  };

  const languages = [
    { value: 'java', label: 'Java', color: 'bg-orange-500' },
    { value: 'python', label: 'Python', color: 'bg-blue-500' },
    { value: 'cpp', label: 'C++', color: 'bg-green-500' }
  ];

  return (
    <div className="bg-gray-800 rounded-lg border border-gray-700">
      <div className="flex items-center justify-between p-4 border-b border-gray-700">
        <div className="flex items-center space-x-4">
          <FileCode className="w-5 h-5 text-gray-400" />
          <h3 className="text-lg font-semibold text-white">Code Editor</h3>
          
          <div className="flex items-center space-x-2">
            {languages.map((lang) => (
              <button
                key={lang.value}
                onClick={() => onLanguageChange(lang.value)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  language === lang.value
                    ? `${lang.color} text-white`
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".java,.py,.cpp,.cc,.cxx"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Upload className="w-4 h-4" />
            <span>Upload</span>
          </button>
          <button
            onClick={() => onCodeChange('')}
            className="flex items-center space-x-2 px-3 py-1.5 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            <span>Clear</span>
          </button>
          <button
            onClick={onAnalyze}
            disabled={!code.trim() || isAnalyzing}
            className="flex items-center space-x-2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            <Play className="w-4 h-4" />
            <span>{isAnalyzing ? 'Analyzing...' : 'Analyze Code'}</span>
          </button>
        </div>
      </div>

      <div className="p-4">
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          placeholder={`Paste your ${language.toUpperCase()} code here or upload a file...`}
          className="w-full h-96 bg-gray-900 text-gray-100 font-mono text-sm p-4 rounded-lg border border-gray-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 resize-none"
        />
      </div>
    </div>
  );
};