import { ThemeName, getTheme } from './themes';
import { renderSlidesForExport, EXPORT_SLIDE_WIDTH, EXPORT_SLIDE_HEIGHT } from './renderSlidesForExport';

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

  // Get theme colors for background
  const bgColor = getTheme(theme)['--slide-bg'];

  const { slides, cleanup } = await renderSlidesForExport(markdownContent, theme);

  try {
    if (slides.length === 0) {
      throw new Error('No slides to export');
    }

    // Size pages to the rendered slide's aspect ratio so images aren't cropped (in points: 0.75pt per px)
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'pt',
      format: [EXPORT_SLIDE_WIDTH * 0.75, EXPORT_SLIDE_HEIGHT * 0.75],
    });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < slides.length; i++) {
      // Capture slide as canvas image with theme background
      const canvas = await html2canvas(slides[i], {
        backgroundColor: bgColor,
        scale: 3, // Higher quality
        useCORS: true, // Handle cross-origin images
        allowTaint: false
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.8);

      // Add new page for slides after the first
      if (i > 0) {
        pdf.addPage();
      }

      pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const filename = `slides_${timestamp}.pdf`;

    pdf.save(filename);

    console.log(`PDF exported successfully: ${filename}`);
  } catch (error) {
    console.error('Error exporting slides to PDF:', error);
    throw error;
  } finally {
    cleanup();
  }
};
