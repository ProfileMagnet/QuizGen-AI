interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  type?: 'mcq' | 'tf' | 'fib' | 'ordering' | 'matching';
  answersList?: string[];
  orderingContents?: string[];
  orderingAnswerIndexList?: number[];
  matchingLeft?: string[];
  matchingRight?: string[];
  matchingAnswerIndexList?: number[];
}

export const exportQuizToPDF = async (questions: QuizQuestion[]) => {
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

  // Helper function to add text with word wrapping
  const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12) => {
    doc.setFontSize(fontSize);
    const lines = doc.splitTextToSize(text, maxWidth);
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
    // Estimate height by type
    let estimated = 30;
    if (question.type === 'mcq' || question.type === 'tf') {
      estimated += (question.options.length * 10);
    } else if (question.type === 'fib') {
      estimated += 14; // input line space
    } else if (question.type === 'ordering') {
      estimated += ((question.orderingContents?.length || 0) * 10);
    } else if (question.type === 'matching') {
      estimated += Math.max((question.matchingLeft?.length || 0), (question.matchingRight?.length || 0)) * 10;
    }
    checkNewPage(estimated);

    // Question number and text
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const questionText = `${question.id}. ${question.question}`;
    yPosition = addWrappedText(questionText, margin, yPosition, contentWidth, 11);
    yPosition += 2;

    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');

    if (!question.type || question.type === 'mcq' || question.type === 'tf') {
      // Options list
      question.options.forEach((option, optionIndex) => {
        const optionLetter = String.fromCharCode(65 + optionIndex);
        const optionText = `${optionLetter}) ${option}`;
        yPosition = addWrappedText(optionText, margin + 8, yPosition, contentWidth - 8, 9);
      });
    } else if (question.type === 'fib') {
      // Draw an empty line for answer input
      const lineY = yPosition + 4;
      doc.line(margin, lineY, margin + contentWidth / 2, lineY);
      yPosition += 12;
    } else if (question.type === 'ordering') {
      const items = question.orderingContents || [];
      items.forEach((txt, i) => {
        yPosition = addWrappedText(`${i + 1}) ${txt}`, margin + 8, yPosition, contentWidth - 8, 9);
      });
    } else if (question.type === 'matching') {
      const left = question.matchingLeft || [];
      const right = question.matchingRight || [];
      const maxLen = Math.max(left.length, right.length);
      for (let i = 0; i < maxLen; i++) {
        const l = left[i] ?? '';
        const r = right[i] ?? '';
        const row = `${String.fromCharCode(65 + i)}) ${l}     ⟷     ${i + 1}) ${r}`;
        yPosition = addWrappedText(row, margin + 8, yPosition, contentWidth - 8, 9);
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
    if (!question.type || question.type === 'mcq' || question.type === 'tf') {
      const correctAnswer = String.fromCharCode(65 + question.correctAnswer);
      const answerText = `${question.id}. ${correctAnswer}`;
      yPosition = addWrappedText(answerText, margin, yPosition, contentWidth, 11);
    } else if (question.type === 'fib') {
      const answers = (question.answersList || []).join(', ');
      const answerText = `${question.id}. Acceptable: ${answers}`;
      yPosition = addWrappedText(answerText, margin, yPosition, contentWidth, 11);
    } else if (question.type === 'ordering') {
      const contents = question.orderingContents || [];
      const order = question.orderingAnswerIndexList || [];
      const lines = order.map((idx, i) => `${i + 1}. ${contents[idx]}`);
      yPosition = addWrappedText(`${question.id}. Correct order:`, margin, yPosition, contentWidth, 11);
      lines.forEach(line => {
        yPosition = addWrappedText(`   ${line}`, margin, yPosition, contentWidth, 11);
      });
    } else if (question.type === 'matching') {
      const left = question.matchingLeft || [];
      const right = question.matchingRight || [];
      const ans = question.matchingAnswerIndexList || [];
      yPosition = addWrappedText(`${question.id}. Correct matches:`, margin, yPosition, contentWidth, 11);
      left.forEach((l, i) => {
        const mapped = typeof ans[i] === 'number' ? right[ans[i] as number] : '';
        yPosition = addWrappedText(`   ${l} → ${mapped}`, margin, yPosition, contentWidth, 11);
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

  // Save the PDF
  const fileName = `quiz-${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
};