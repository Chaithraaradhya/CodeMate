import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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

export const exportToPDF = async (result: AnalysisResult, language: string) => {
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add text with line wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize = 12) => {
    pdf.setFontSize(fontSize);
    const lines = pdf.splitTextToSize(text, maxWidth);
    pdf.text(lines, x, y);
    return y + (lines.length * fontSize * 0.5);
  };

  // Header
  pdf.setFillColor(99, 102, 241); // Indigo
  pdf.rect(0, 0, pageWidth, 40, 'F');
  
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(24);
  pdf.setFont(undefined, 'bold');
  pdf.text('CodeMate Analysis Report', margin, 25);
  
  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.text(`Language: ${language.toUpperCase()}`, margin, 35);
  pdf.text(`Generated: ${new Date().toLocaleDateString()}`, pageWidth - margin - 50, 35);

  yPosition = 60;

  // Score Section
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(18);
  pdf.setFont(undefined, 'bold');
  pdf.text('Code Quality Score', margin, yPosition);
  yPosition += 15;

  // Score visualization
  const scoreColor = result.score >= 90 ? [34, 197, 94] : result.score >= 70 ? [251, 191, 36] : [239, 68, 68];
  pdf.setFillColor(...scoreColor);
  pdf.rect(margin, yPosition, (pageWidth - 2 * margin) * (result.score / 100), 10, 'F');
  pdf.setDrawColor(200, 200, 200);
  pdf.rect(margin, yPosition, pageWidth - 2 * margin, 10);

  pdf.setFontSize(24);
  pdf.setFont(undefined, 'bold');
  pdf.setTextColor(...scoreColor);
  pdf.text(`${result.score}/100`, margin, yPosition + 25);

  yPosition += 40;

  // Issues Summary
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.text('Issues Summary', margin, yPosition);
  yPosition += 15;

  const errorCount = result.issues.filter(i => i.type === 'error').length;
  const warningCount = result.issues.filter(i => i.type === 'warning').length;
  const suggestionCount = result.issues.filter(i => i.type === 'suggestion').length;

  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  pdf.setTextColor(239, 68, 68);
  pdf.text(`• Errors: ${errorCount}`, margin, yPosition);
  yPosition += 8;
  
  pdf.setTextColor(251, 191, 36);
  pdf.text(`• Warnings: ${warningCount}`, margin, yPosition);
  yPosition += 8;
  
  pdf.setTextColor(59, 130, 246);
  pdf.text(`• Suggestions: ${suggestionCount}`, margin, yPosition);
  yPosition += 20;

  // Code Metrics
  pdf.setTextColor(0, 0, 0);
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.text('Code Metrics', margin, yPosition);
  yPosition += 15;

  pdf.setFontSize(12);
  pdf.setFont(undefined, 'normal');
  const metrics = [
    `Lines of Code: ${result.metrics.linesOfCode}`,
    `Cyclomatic Complexity: ${result.metrics.cyclomaticComplexity}`,
    `Maintainability Index: ${result.metrics.maintainabilityIndex}`,
    `Duplicate Lines: ${result.metrics.duplicateLines}`,
    `Test Coverage: ${result.metrics.testCoverage}%`
  ];

  metrics.forEach(metric => {
    pdf.text(`• ${metric}`, margin, yPosition);
    yPosition += 8;
  });

  yPosition += 10;

  // Check if we need a new page
  if (yPosition > pageHeight - 60) {
    pdf.addPage();
    yPosition = margin;
  }

  // Detailed Issues
  pdf.setFontSize(16);
  pdf.setFont(undefined, 'bold');
  pdf.text('Detailed Issues', margin, yPosition);
  yPosition += 15;

  result.issues.slice(0, 10).forEach((issue, index) => { // Limit to first 10 issues
    if (yPosition > pageHeight - 40) {
      pdf.addPage();
      yPosition = margin;
    }

    const color = issue.type === 'error' ? [239, 68, 68] : 
                  issue.type === 'warning' ? [251, 191, 36] : [59, 130, 246];
    
    pdf.setTextColor(...color);
    pdf.setFontSize(12);
    pdf.setFont(undefined, 'bold');
    pdf.text(`${index + 1}. ${issue.type.toUpperCase()}`, margin, yPosition);
    yPosition += 8;

    pdf.setTextColor(0, 0, 0);
    pdf.setFont(undefined, 'normal');
    yPosition = addWrappedText(`Line ${issue.line}: ${issue.message}`, margin + 5, yPosition, pageWidth - 2 * margin - 10);
    yPosition += 5;
    
    pdf.setTextColor(128, 128, 128);
    pdf.setFontSize(10);
    pdf.text(`Rule: ${issue.rule} | Severity: ${issue.severity}`, margin + 5, yPosition);
    yPosition += 15;
  });

  // Suggestions
  if (result.suggestions.length > 0) {
    if (yPosition > pageHeight - 80) {
      pdf.addPage();
      yPosition = margin;
    }

    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(16);
    pdf.setFont(undefined, 'bold');
    pdf.text('Optimization Suggestions', margin, yPosition);
    yPosition += 15;

    pdf.setFontSize(12);
    pdf.setFont(undefined, 'normal');
    result.suggestions.forEach((suggestion, index) => {
      if (yPosition > pageHeight - 20) {
        pdf.addPage();
        yPosition = margin;
      }
      yPosition = addWrappedText(`${index + 1}. ${suggestion}`, margin, yPosition, pageWidth - 2 * margin);
      yPosition += 8;
    });
  }

  // Footer
  const totalPages = pdf.internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    pdf.setPage(i);
    pdf.setTextColor(128, 128, 128);
    pdf.setFontSize(10);
    pdf.text(`Page ${i} of ${totalPages} | Generated by CodeMate`, margin, pageHeight - 10);
  }

  // Save the PDF
  const fileName = `CodeMate_Analysis_${language}_${new Date().toISOString().slice(0, 10)}.pdf`;
  pdf.save(fileName);
};