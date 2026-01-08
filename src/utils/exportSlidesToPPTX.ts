import { ThemeName, getTheme } from './themes';

/**
 * Export slides to PPTX using image-based approach (same as PDF export)
 * Captures each slide as rendered in browser for visual fidelity
 */
export const exportSlidesToPPTX = async (
  markdownContent: string,
  theme: ThemeName = 'light'
): Promise<void> => {
  // Dynamic import of optional dependencies with graceful error handling
  let html2canvas: typeof import('html2canvas').default;
  let PptxGenJS: typeof import('pptxgenjs').default;

  try {
    const html2canvasModule = await import('html2canvas');
    html2canvas = html2canvasModule.default;
  } catch {
    throw new Error(
      'PPTX export requires html2canvas. Install it with: npm install html2canvas'
    );
  }

  try {
    const pptxModule = await import('pptxgenjs');
    PptxGenJS = pptxModule.default;
  } catch {
    throw new Error(
      'PPTX export requires pptxgenjs. Install it with: npm install pptxgenjs'
    );
  }

  try {
    // Get theme colors for background
    const themeColors = getTheme(theme);
    const bgColor = themeColors['--slide-bg'];

    // Create temporary container for rendering
    const tempContainer = document.createElement('div');
    tempContainer.style.position = 'absolute';
    tempContainer.style.left = '-9999px';
    tempContainer.style.top = '0';
    document.body.appendChild(tempContainer);

    // Render PDFSlideDeck component with theme (reuse for consistent rendering)
    const { createRoot } = await import('react-dom/client');
    const { default: PDFSlideDeck } = await import('../components/PDFSlideDeck');
    const { createElement } = await import('react');

    const root = createRoot(tempContainer);
    root.render(createElement(PDFSlideDeck, { markdownContent, theme }));

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

      // Capture slide as canvas image with theme background
      const canvas = await html2canvas(slideElement, {
        backgroundColor: bgColor,
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
