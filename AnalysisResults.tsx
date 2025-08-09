import React from 'react';
import { AlertTriangle, CheckCircle, Info, Zap, TrendingUp, AlertCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface Issue {
  id: string;
  type: 'error' | 'warning' | 'suggestion';
  line: number;
  column: number;
  message: string;
  rule: string;
  severity: 'high' | 'medium' | 'low';
}

interface AnalysisResult {
  score: number;
  issues: Issue[];
  metrics: {
    linesOfCode: number;
    cyclomaticComplexity: number;
    maintainabilityIndex: number;
    duplicateLines: number;
    testCoverage: number;
  };
  suggestions: string[];
}

interface AnalysisResultsProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ result, isAnalyzing }) => {
  if (isAnalyzing) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <p className="text-gray-300">Analyzing your code...</p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-8">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <Zap className="w-16 h-16 text-gray-500" />
          <h3 className="text-xl font-semibold text-gray-300">Ready to analyze your code</h3>
          <p className="text-gray-500">Upload or paste your code and click "Analyze Code" to get started</p>
        </div>
      </div>
    );
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-400';
    if (score >= 70) return 'text-yellow-400';
    return 'text-red-400';
  };

  const getScoreGradient = (score: number) => {
    if (score >= 90) return 'from-green-500 to-green-600';
    if (score >= 70) return 'from-yellow-500 to-yellow-600';
    return 'from-red-500 to-red-600';
  };

  const issuesByType = {
    errors: result.issues.filter(issue => issue.type === 'error').length,
    warnings: result.issues.filter(issue => issue.type === 'warning').length,
    suggestions: result.issues.filter(issue => issue.type === 'suggestion').length,
  };

  const chartData = [
    { name: 'Errors', value: issuesByType.errors, color: '#ef4444' },
    { name: 'Warnings', value: issuesByType.warnings, color: '#f59e0b' },
    { name: 'Suggestions', value: issuesByType.suggestions, color: '#3b82f6' },
  ];

  const metricsData = [
    { name: 'Lines of Code', value: result.metrics.linesOfCode },
    { name: 'Complexity', value: result.metrics.cyclomaticComplexity },
    { name: 'Maintainability', value: result.metrics.maintainabilityIndex },
    { name: 'Duplicates', value: result.metrics.duplicateLines },
  ];

  return (
    <div className="space-y-6" id="analysis-results">
      {/* Score Card */}
      <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-2xl font-bold text-white mb-2">Code Quality Score</h3>
            <div className="flex items-center space-x-4">
              <div className={`text-4xl font-bold ${getScoreColor(result.score)}`}>
                {result.score}/100
              </div>
              <div className="flex-1">
                <div className="bg-gray-700 rounded-full h-3 w-48">
                  <div
                    className={`h-3 rounded-full bg-gradient-to-r ${getScoreGradient(result.score)}`}
                    style={{ width: `${result.score}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="flex items-center space-x-4 text-sm">
              <div className="flex items-center space-x-1 text-red-400">
                <AlertCircle className="w-4 h-4" />
                <span>{issuesByType.errors} Errors</span>
              </div>
              <div className="flex items-center space-x-1 text-yellow-400">
                <AlertTriangle className="w-4 h-4" />
                <span>{issuesByType.warnings} Warnings</span>
              </div>
              <div className="flex items-center space-x-1 text-blue-400">
                <Info className="w-4 h-4" />
                <span>{issuesByType.suggestions} Suggestions</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Issues Overview */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Issues Distribution</h4>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center space-x-4 mt-4">
            {chartData.map((entry) => (
              <div key={entry.name} className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }}></div>
                <span className="text-sm text-gray-400">{entry.name}: {entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Metrics */}
        <div className="bg-gray-800 rounded-lg border border-gray-700 p-6">
          <h4 className="text-lg font-semibold text-white mb-4">Code Metrics</h4>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={metricsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" fontSize={12} />
              <YAxis stroke="#9CA3AF" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '0.5rem'
                }}
              />
              <Bar dataKey="value" fill="#6366F1" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detailed Issues */}
      <div className="bg-gray-800 rounded-lg border border-gray-700">
        <div className="p-6 border-b border-gray-700">
          <h4 className="text-lg font-semibold text-white">Detailed Analysis</h4>
        </div>
        <div className="p-6">
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {result.issues.map((issue) => {
              const Icon = issue.type === 'error' ? AlertCircle : 
                          issue.type === 'warning' ? AlertTriangle : Info;
              const color = issue.type === 'error' ? 'text-red-400' : 
                           issue.type === 'warning' ? 'text-yellow-400' : 'text-blue-400';
              const bgColor = issue.type === 'error' ? 'bg-red-500/10 border-red-500/20' : 
                             issue.type === 'warning' ? 'bg-yellow-500/10 border-yellow-500/20' : 'bg-blue-500/10 border-blue-500/20';

              return (
                <div key={issue.id} className={`p-4 rounded-lg border ${bgColor}`}>
                  <div className="flex items-start space-x-3">
                    <Icon className={`w-5 h-5 ${color} mt-0.5 flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-medium text-white">{issue.message}</p>
                        <span className={`px-2 py-1 text-xs rounded-full ${color} bg-opacity-20`}>
                          {issue.severity}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        Line {issue.line}:{issue.column} • Rule: {issue.rule}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Suggestions */}
      {result.suggestions.length > 0 && (
        <div className="bg-gray-800 rounded-lg border border-gray-700">
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-5 h-5 text-green-400" />
              <h4 className="text-lg font-semibold text-white">Optimization Suggestions</h4>
            </div>
          </div>
          <div className="p-6">
            <ul className="space-y-3">
              {result.suggestions.map((suggestion, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-4 h-4 text-green-400 mt-1 flex-shrink-0" />
                  <span className="text-gray-300">{suggestion}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};