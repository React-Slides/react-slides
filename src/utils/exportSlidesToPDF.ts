import { ThemeName, getTheme } from './themes';

export const exportSlidesToPDF = async (
  markdownContent: string,
  theme: ThemeName = 'light'
): Promise<void> => {
  // Dynamic import of optional dependencies with graceful error handling
  let html2canvas: typeof import('html2canvas').default;
  let jsPDF: typeof import('jspdf').default;

  try {
    const html2canvasModule = await import('html2canvas');
    html2canvas = html2canvasModule.default;
  } catch {
    throw new Error(
      'PDF export requires html2canvas. Install it with: npm install html2canvas'
    );
  }

  try {
    const jspdfModule = await import('jspdf');
    jsPDF = jspdfModule.default;
  } catch {
    throw new Error(
      'PDF export requires jspdf. Install it with: npm install jspdf'
    );
  }

  try {
    // Get theme colors for background
    const themeColors = getTheme(theme);
    const bgColor = themeColors['--slide-bg'];

    // Create temporary container for PDF rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    document.body.appendChild(tempContainer);

    // Render PDFSlideDeck component with theme
    const { createRoot } = await import('react-dom/client');
    const { default: PDFSlideDeck } = await import('../components/PDFSlideDeck');
    const { createElement } = await import('react');

    const root = createRoot(tempContainer);
    root.render(createElement(PDFSlideDeck, { markdownContent, theme }));

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

      // Capture slide as canvas image with theme background
      const canvas = await html2canvas(slideElement, {
        backgroundColor: bgColor,
        scale: 3, // Higher quality
        useCORS: true, // Handle cross-origin images
        allowTaint: false
      });

      // Convert canvas to image data
      const imgData = canvas.toDataURL('image/jpeg', 0.8);

      // Calculate dimensions to fit PDF page
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      // Add new page for slides after the first
      if (i > 0) {
        pdf.addPage();
      }

      // Add image to PDF page
      pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight);
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
