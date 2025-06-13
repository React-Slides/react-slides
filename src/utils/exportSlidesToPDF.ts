import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportSlidesToPDF = async (): Promise<void> => {
  try {
    // Query all slide containers from the DOM
    const slides = document.querySelectorAll('.slide-container');
    
    if (slides.length === 0) {
      console.warn('No slides found with .slide-container class');
      return;
    }

    // Create PDF in landscape orientation to match slide format
    const pdf = new jsPDF('landscape');
    
    for (let i = 0; i < slides.length; i++) {
      const slideElement = slides[i] as HTMLElement;
      
      // Capture slide as canvas image
      const canvas = await html2canvas(slideElement, {
        backgroundColor: '#ffffff',
        scale: 3, // Highest quality, 3 of 3-2-1
        useCORS: true, // Handle cross-origin images
        allowTaint: false
      });
      
      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit PDF page
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      
      // Add new page for slides after the first
      if (i > 0) {
        pdf.addPage();
      }
      
      // Add image to PDF page
      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    }
    
    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = `slides_${timestamp}.pdf`;
    
    // Save the PDF
    pdf.save(filename);
    
    console.log(`PDF exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting slides to PDF:', error);
    throw error;
  }
};