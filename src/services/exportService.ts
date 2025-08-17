import jsPDF from 'jspdf';
import { Meeting } from '../types/meeting';

export class ExportService {
  async exportToPDF(meeting: Meeting): Promise<void> {
    const pdf = new jsPDF();
    
    // Title
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Meeting Summary', 20, 30);
    
    // Meeting Details
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Meeting: ${meeting.title}`, 20, 50);
    pdf.text(`Date: ${new Date(meeting.date).toLocaleDateString()}`, 20, 60);
    pdf.text(`Duration: ${meeting.duration} minutes`, 20, 70);
    
    if (meeting.summary) {
      let yPos = 90;
      
      // Key Points
      pdf.setFont('helvetica', 'bold');
      pdf.text('Key Points:', 20, yPos);
      yPos += 10;
      
      pdf.setFont('helvetica', 'normal');
      meeting.summary.keyPoints.forEach((point, index) => {
        const lines = pdf.splitTextToSize(`${index + 1}. ${point}`, 170);
        lines.forEach((line: string) => {
          pdf.text(line, 25, yPos);
          yPos += 7;
        });
      });
      
      yPos += 10;
      
      // Action Items
      pdf.setFont('helvetica', 'bold');
      pdf.text('Action Items:', 20, yPos);
      yPos += 10;
      
      pdf.setFont('helvetica', 'normal');
      meeting.summary.actionItems.forEach((item, index) => {
        const text = `${index + 1}. ${item.task} - ${item.assignee} (${item.priority} priority)`;
        const lines = pdf.splitTextToSize(text, 170);
        lines.forEach((line: string) => {
          pdf.text(line, 25, yPos);
          yPos += 7;
        });
      });
    }
    
    pdf.save(`meeting-summary-${meeting.id}.pdf`);
  }

  async exportToJSON(meeting: Meeting): Promise<void> {
    const dataStr = JSON.stringify(meeting, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meeting-${meeting.id}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  async exportToWord(meeting: Meeting): Promise<void> {
    // For a full Word export, you'd use libraries like docx
    // Here we'll create a simple HTML export that can be saved as Word
    let htmlContent = `
      <html>
        <head>
          <title>Meeting Summary - ${meeting.title}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #1e40af; }
            h2 { color: #374151; margin-top: 30px; }
            .info { margin-bottom: 20px; }
            .action-item { margin: 10px 0; padding: 10px; background-color: #f3f4f6; border-radius: 5px; }
          </style>
        </head>
        <body>
          <h1>Meeting Summary</h1>
          <div class="info">
            <strong>Meeting:</strong> ${meeting.title}<br>
            <strong>Date:</strong> ${new Date(meeting.date).toLocaleDateString()}<br>
            <strong>Duration:</strong> ${meeting.duration} minutes
          </div>
    `;

    if (meeting.summary) {
      htmlContent += `
        <h2>Key Points</h2>
        <ul>
          ${meeting.summary.keyPoints.map(point => `<li>${point}</li>`).join('')}
        </ul>
        
        <h2>Action Items</h2>
        ${meeting.summary.actionItems.map(item => `
          <div class="action-item">
            <strong>${item.task}</strong><br>
            Assignee: ${item.assignee} | Priority: ${item.priority}
            ${item.deadline ? ` | Deadline: ${item.deadline}` : ''}
          </div>
        `).join('')}
        
        <h2>Decisions Made</h2>
        <ul>
          ${meeting.summary.decisions.map(decision => `<li>${decision}</li>`).join('')}
        </ul>
      `;
    }

    htmlContent += '</body></html>';

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `meeting-summary-${meeting.id}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

export const exportService = new ExportService();