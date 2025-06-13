import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

export const exportSlidesToPDF = async (markdownContent: string): Promise<void> => {
  try {
    // Create temporary container for PDF rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    document.body.appendChild(tempContainer);

    // Render PDFSlideDeck component
    const { createRoot } = await import('react-dom/client');
    const { default: PDFSlideDeck } = await import('../components/PDFSlideDeck');
    const { createElement } = await import('react');
    
    const root = createRoot(tempContainer);
    root.render(createElement(PDFSlideDeck, { markdownContent }));

    // Wait for rendering to complete
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Query all slide containers from the rendered component
    const slides = tempContainer.querySelectorAll('.slide-container');
    
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
        scale: 2, // Higher quality
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
    
    // Cleanup: remove temporary container
    root.unmount();
    document.body.removeChild(tempContainer);
  } catch (error) {
    console.error('Error exporting slides to PDF:', error);
    throw error;
  }
};