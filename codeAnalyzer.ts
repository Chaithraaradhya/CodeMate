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

const generateRandomId = () => Math.random().toString(36).substr(2, 9);

const javaRules = [
  {
    pattern: /class\s+[a-z]/,
    type: 'warning' as const,
    message: 'Class names should start with uppercase letter',
    rule: 'naming-convention',
    severity: 'medium' as const
  },
  {
    pattern: /public\s+static\s+void\s+main\s*\([^)]*\)\s*\{[^}]*\}/,
    type: 'suggestion' as const,
    message: 'Consider extracting logic from main method into separate methods',
    rule: 'method-complexity',
    severity: 'low' as const
  },
  {
    pattern: /import\s+[^;]+;/g,
    type: 'suggestion' as const,
    message: 'Remove unused imports to improve code clarity',
    rule: 'unused-imports',
    severity: 'low' as const
  },
  {
    pattern: /for\s*\([^)]*\)\s*\{\s*for\s*\([^)]*\)/,
    type: 'warning' as const,
    message: 'Nested loops detected - consider optimization',
    rule: 'performance',
    severity: 'medium' as const
  }
];

const pythonRules = [
  {
    pattern: /def\s+[A-Z]/,
    type: 'warning' as const,
    message: 'Function names should be in snake_case',
    rule: 'naming-convention',
    severity: 'medium' as const
  },
  {
    pattern: /import\s+\*/,
    type: 'warning' as const,
    message: 'Avoid wildcard imports',
    rule: 'import-style',
    severity: 'medium' as const
  },
  {
    pattern: /except:/,
    type: 'error' as const,
    message: 'Bare except clauses should specify exception types',
    rule: 'exception-handling',
    severity: 'high' as const
  }
];

const cppRules = [
  {
    pattern: /#include\s*<[^>]+>/g,
    type: 'suggestion' as const,
    message: 'Consider using forward declarations to reduce compilation time',
    rule: 'include-optimization',
    severity: 'low' as const
  },
  {
    pattern: /using\s+namespace\s+std;/,
    type: 'warning' as const,
    message: 'Avoid "using namespace std" in header files',
    rule: 'namespace-pollution',
    severity: 'medium' as const
  },
  {
    pattern: /new\s+/,
    type: 'suggestion' as const,
    message: 'Consider using smart pointers instead of raw pointers',
    rule: 'memory-management',
    severity: 'medium' as const
  }
];

export const analyzeCode = async (code: string, language: string): Promise<AnalysisResult> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  const lines = code.split('\n');
  const linesOfCode = lines.filter(line => line.trim() && !line.trim().startsWith('//')).length;

  let rules: typeof javaRules = [];
  switch (language) {
    case 'java':
      rules = javaRules;
      break;
    case 'python':
      rules = pythonRules;
      break;
    case 'cpp':
      rules = cppRules;
      break;
  }

  const issues: Issue[] = [];

  // Analyze code against rules
  rules.forEach(rule => {
    if (rule.pattern.global) {
      const matches = [...code.matchAll(rule.pattern)];
      matches.forEach((match, index) => {
        const lineNumber = code.substring(0, match.index).split('\n').length;
        issues.push({
          id: generateRandomId(),
          type: rule.type,
          line: lineNumber,
          column: match.index ? match.index - code.lastIndexOf('\n', match.index) : 0,
          message: rule.message,
          rule: rule.rule,
          severity: rule.severity
        });
      });
    } else if (rule.pattern.test(code)) {
      const match = code.match(rule.pattern);
      if (match) {
        const lineNumber = code.substring(0, match.index).split('\n').length;
        issues.push({
          id: generateRandomId(),
          type: rule.type,
          line: lineNumber,
          column: match.index ? match.index - code.lastIndexOf('\n', match.index) : 0,
          message: rule.message,
          rule: rule.rule,
          severity: rule.severity
        });
      }
    }
  });

  // Add some random additional issues for demonstration
  const additionalIssues = [
    {
      id: generateRandomId(),
      type: 'suggestion' as const,
      line: Math.floor(Math.random() * lines.length) + 1,
      column: 5,
      message: 'Consider adding documentation comments',
      rule: 'documentation',
      severity: 'low' as const
    },
    {
      id: generateRandomId(),
      type: 'warning' as const,
      line: Math.floor(Math.random() * lines.length) + 1,
      column: 10,
      message: 'Variable naming could be more descriptive',
      rule: 'naming-clarity',
      severity: 'medium' as const
    }
  ];

  issues.push(...additionalIssues);

  // Calculate metrics
  const cyclomaticComplexity = Math.max(1, Math.floor(linesOfCode / 10) + (code.match(/if|else|while|for|switch|case/g)?.length || 0));
  const maintainabilityIndex = Math.max(10, 100 - issues.length * 5 - Math.floor(cyclomaticComplexity / 2));
  const duplicateLines = Math.floor(Math.random() * 5);
  const testCoverage = Math.max(0, 100 - issues.length * 3);

  // Calculate score
  const errorPenalty = issues.filter(i => i.type === 'error').length * 15;
  const warningPenalty = issues.filter(i => i.type === 'warning').length * 8;
  const suggestionPenalty = issues.filter(i => i.type === 'suggestion').length * 3;
  const score = Math.max(0, Math.min(100, 100 - errorPenalty - warningPenalty - suggestionPenalty));

  // Generate suggestions
  const suggestions = [
    'Break down large methods into smaller, more focused functions',
    'Add unit tests to improve code reliability',
    'Use meaningful variable and method names',
    'Consider using design patterns for better code structure',
    'Add error handling and logging where appropriate'
  ].slice(0, Math.floor(Math.random() * 3) + 2);

  return {
    score,
    issues,
    metrics: {
      linesOfCode,
      cyclomaticComplexity,
      maintainabilityIndex,
      duplicateLines,
      testCoverage
    },
    suggestions
  };
};