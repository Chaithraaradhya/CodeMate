import React, { useState } from 'react';
import { Header } from './components/Header';
import { CodeEditor } from './components/CodeEditor';
import { AnalysisResults } from './components/AnalysisResults';
import { analyzeCode } from './utils/codeAnalyzer';
import { exportToPDF } from './utils/pdfExport';

interface AnalysisResult {
  score: number;
  issues: any[];
  metrics: {
    linesOfCode: number;
    cyclomaticComplexity: number;
    maintainabilityIndex: number;
    duplicateLines: number;
    testCoverage: number;
  };
  suggestions: string[];
}

function App() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('java');
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!code.trim()) return;
    
    setIsAnalyzing(true);
    try {
      const analysisResult = await analyzeCode(code, language);
      setResult(analysisResult);
    } catch (error) {
      console.error('Analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleExportPDF = async () => {
    if (result) {
      await exportToPDF(result, language);
    }
  };

  const sampleCodes = {
    java: `public class Calculator {
    public static void main(String[] args) {
        int a = 5;
        int b = 3;
        System.out.println("Sum: " + (a + b));
        
        // Nested loop example
        for (int i = 0; i < 5; i++) {
            for (int j = 0; j < 3; j++) {
                System.out.println(i + ", " + j);
            }
        }
    }
}`,
    python: `import *
from math import sqrt

def calculateAverage(numbers):
    try:
        total = sum(numbers)
        return total / len(numbers)
    except:
        return 0

def ProcessData(data):
    result = []
    for item in data:
        if item > 0:
            result.append(sqrt(item))
    return result`,
    cpp: `#include <iostream>
#include <vector>
#include <memory>

using namespace std;

class DataProcessor {
public:
    void processData() {
        int* data = new int[100];
        
        for (int i = 0; i < 100; i++) {
            data[i] = i * 2;
        }
        
        // Memory leak - forgot to delete[]
        cout << "Processing complete" << endl;
    }
};`
  };

  const handleLoadSample = () => {
    setCode(sampleCodes[language as keyof typeof sampleCodes]);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Header onExportPDF={handleExportPDF} />
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Left Column - Code Editor */}
          <div className="space-y-6">
            <CodeEditor
              code={code}
              language={language}
              onCodeChange={setCode}
              onLanguageChange={setLanguage}
              onAnalyze={handleAnalyze}
              isAnalyzing={isAnalyzing}
            />
            
            {/* Sample Code Button */}
            <div className="flex justify-center">
              <button
                onClick={handleLoadSample}
                className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
              >
                Load Sample {language.toUpperCase()} Code
              </button>
            </div>
          </div>

          {/* Right Column - Analysis Results */}
          <div>
            <AnalysisResults result={result} isAnalyzing={isAnalyzing} />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;