import jsPDF from 'jspdf';

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
}


export const exportQuizToPDF = (questions: QuizQuestion[]) => {
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
    // Check if we need a new page
    const questionHeight = 30 + (question.options.length * 10);
    checkNewPage(questionHeight);

    // Question number and text
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    const questionText = `${question.id}. ${question.question}`;
    yPosition = addWrappedText(questionText, margin, yPosition, contentWidth, 11);
    yPosition += 1;

    // Options (without correct answers marked)
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    question.options.forEach((option, optionIndex) => {
      const optionLetter = String.fromCharCode(65 + optionIndex);
      const optionText = `${optionLetter}) ${option}`;
      yPosition = addWrappedText(optionText, margin + 8, yPosition, contentWidth - 8, 9);
    });

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
    const correctAnswer = String.fromCharCode(65 + question.correctAnswer);
    const answerText = `${question.id}. ${correctAnswer}`;
    yPosition = addWrappedText(answerText, margin, yPosition, contentWidth, 11);
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

