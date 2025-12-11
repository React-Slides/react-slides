import html2canvas from 'html2canvas';
import PptxGenJS from 'pptxgenjs';

/**
 * Export slides to PPTX using image-based approach (same as PDF export)
 * Captures each slide as rendered in browser for visual fidelity
 */
export const exportSlidesToPPTX = async (markdownContent: string): Promise<void> => {
  try {
    // Create temporary container for rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    document.body.appendChild(tempContainer);

    // Render PDFSlideDeck component (reuse for consistent rendering)
    const { createRoot } = await import('react-dom/client');
    const { default: PDFSlideDeck } = await import('../components/PDFSlideDeck');
    const { createElement } = await import('react');

    const root = createRoot(tempContainer);
    root.render(createElement(PDFSlideDeck, { markdownContent }));

    // Wait for rendering to complete (charts need time to render)
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Query all slide containers from the rendered component
    const slides = tempContainer.querySelectorAll('.slide-container');

    if (slides.length === 0) {
      console.warn('No slides found with .slide-container class');
      root.unmount();
      document.body.removeChild(tempContainer);
      return;
    }

    // Create PowerPoint presentation
    const pptx = new PptxGenJS();
    pptx.layout = 'LAYOUT_16x9';
    pptx.title = 'React Slides Export';
    pptx.author = 'React Slides';

    for (let i = 0; i < slides.length; i++) {
      const slideElement = slides[i] as HTMLElement;

      // Capture slide as canvas image (high quality)
      const canvas = await html2canvas(slideElement, {
        backgroundColor: '#ffffff',
        scale: 2, // Good balance of quality vs file size
        useCORS: true,
        allowTaint: false
      });

      // Convert canvas to base64 image data
      const imgData = canvas.toDataURL('image/png');

      // Add slide to presentation
      const slide = pptx.addSlide();

      // Add image to fill the entire slide
      slide.addImage({
        data: imgData,
        x: 0,
        y: 0,
        w: '100%',
        h: '100%'
      });
    }

    // Generate filename with timestamp
    const timestamp = new Date().toISOString().split('T')[0];
    const filename = `slides_${timestamp}.pptx`;

    // Save the PPTX file
    await pptx.writeFile({ fileName: filename });

    console.log(`PPTX exported successfully: ${filename}`);

    // Cleanup
    root.unmount();
    document.body.removeChild(tempContainer);
  } catch (error) {
    console.error('Error exporting slides to PPTX:', error);
    throw error;
  }
};
