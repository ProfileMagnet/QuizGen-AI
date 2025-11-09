interface MatchingQuestion {
  id: number;
  question: string;
  type?: 'mcq' | 'tf' | 'fib' | 'ordering' | 'matching';
  matchingLeft?: string[];
  matchingRight?: string[];
  matchingAnswerIndexList?: number[];
}

export const exportMatchingQuizToPDF = async (questions: MatchingQuestion[]) => {
  // Dynamically import jsPDF to reduce initial bundle size
  const { default: jsPDF } = await import('jspdf');
  
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPosition = 15;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);
  const lineHeight = 5;
  const questionSpacing = 4;

  // Set font to support Unicode characters
  doc.setFont('helvetica');

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12) => {
    doc.setFontSize(fontSize);
    // Clean the text to remove any encoding issues
    const cleanText = text
      .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
      .replace(/[^\x20-\x7E\u00A0-\u024F\u1E00-\u1EFF]/g, '') // Remove non-printable characters
      .trim();
    const lines = doc.splitTextToSize(cleanText, maxWidth);
    doc.text(lines, x, y);
    return y + (lines.length * lineHeight) + 2;
  };

  // Helper function to check if we need a new page
  const checkNewPage = (requiredSpace: number) => {
    if (yPosition + requiredSpace > pageHeight - margin) {
      doc.addPage();
      yPosition = 15;
      return true;
    }
    return false;
  };

  // Questions (without answers)
  questions.forEach((question) => {
    // Estimate height for matching questions
    const estimated = 30 + (Math.max((question.matchingLeft?.length || 0), (question.matchingRight?.length || 0)) * 10);
    checkNewPage(estimated);

    // Question number and text
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const questionText = `${question.id}. ${question.question}`;
    yPosition = addWrappedText(questionText, margin, yPosition, contentWidth, 11);
    yPosition += 2;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    // Matching question display
    if (question.type === 'matching') {
      const left = question.matchingLeft || [];
      const right = question.matchingRight || [];
      const maxLen = Math.max(left.length, right.length);
      
      // Add column headers
      yPosition = addWrappedText('Column A', margin + 8, yPosition, contentWidth / 2 - 10, 10);
      yPosition = addWrappedText('Column B', margin + contentWidth / 2, yPosition - 7, contentWidth / 2 - 10, 10);
      yPosition += 2;
      
      for (let i = 0; i < maxLen; i++) {
        const l = left[i] || '';
        const r = right[i] || '';
        
        // Clean the text to remove any encoding issues
        const cleanLeft = l
          .replace(/\s+/g, ' ')
          .replace(/[^\x20-\x7E\u00A0-\u024F\u1E00-\u1EFF]/g, '')
          .trim();
        const cleanRight = r
          .replace(/\s+/g, ' ')
          .replace(/[^\x20-\x7E\u00A0-\u024F\u1E00-\u1EFF]/g, '')
          .trim();
        
        // Left column item
        const leftText = `${String.fromCharCode(65 + i)}) ${cleanLeft}`;
        yPosition = addWrappedText(leftText, margin + 12, yPosition, contentWidth / 2 - 20, 9);
        
        // Right column item (positioned at the same height)
        const rightText = `${i + 1}) ${cleanRight}`;
        doc.text(rightText, margin + contentWidth / 2 + 4, yPosition - 3);
      }
    }

    yPosition += questionSpacing;
  });

  // Add a new page for the answer key
  doc.addPage();
  yPosition = 15;
  
  // Answer Key header
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  yPosition = addWrappedText('Answer Key', margin, yPosition, contentWidth, 16);
  yPosition += 10;
  
  // Answer key content
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  questions.forEach(question => {
    // Check if we need a new page before adding content
    checkNewPage(30);
    
    if (question.type === 'matching') {
      const left = question.matchingLeft || [];
      const right = question.matchingRight || [];
      const ans = question.matchingAnswerIndexList || [];
      const headerText = `${question.id}. Correct matches:`;
      yPosition = addWrappedText(headerText, margin, yPosition, contentWidth, 11);
      
      // Check if we need a new page for the list
      checkNewPage(left.length * 15);
      
      // Display matching pairs correctly with cleaned text
      left.forEach((l: string, i: number) => {
        const correctIndex = ans[i];
        const mapped = typeof correctIndex === 'number' ? right[correctIndex] : 'Unknown';
        // Clean the text to remove any encoding issues
        const cleanLeft = l
          .replace(/\s+/g, ' ')
          .replace(/[^\x20-\x7E\u00A0-\u024F\u1E00-\u1EFF]/g, '')
          .trim();
        const cleanRight = mapped
          .replace(/\s+/g, ' ')
          .replace(/[^\x20-\x7E\u00A0-\u024F\u1E00-\u1EFF]/g, '')
          .trim();
        const matchLine = `${String.fromCharCode(65 + i)}) ${cleanLeft} → ${String.fromCharCode(65 + i)}) ${cleanRight}`;
        
        // If the line is too long, we might need to split it
        if (doc.getStringUnitWidth(matchLine) * 11 / doc.internal.scaleFactor > contentWidth - 20) {
          // Split into two lines
          yPosition = addWrappedText(`${String.fromCharCode(65 + i)}) ${cleanLeft}`, margin + 10, yPosition, contentWidth - 10, 11);
          yPosition = addWrappedText(`   → ${String.fromCharCode(65 + i)}) ${cleanRight}`, margin + 20, yPosition, contentWidth - 20, 11);
        } else {
          yPosition = addWrappedText(matchLine, margin + 10, yPosition, contentWidth - 10, 11);
        }
      });
    }
    yPosition += 2;
  });

  // Footer
  const footerY = pageHeight - 10;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'italic');
  doc.text('QuizGen AI', margin, footerY);
  doc.text(new Date().toLocaleDateString(), pageWidth - margin - 30, footerY);

  // Save the PDF with a unique file name
  const dateStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const fileName = `QuizGen-Matching-${dateStr}.pdf`;
  doc.save(fileName);
};
