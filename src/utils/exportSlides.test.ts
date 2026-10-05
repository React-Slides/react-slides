import { exportSlidesToPDF } from './exportSlidesToPDF';
import { exportSlidesToPPTX } from './exportSlidesToPPTX';
import { renderSlidesForExport } from './renderSlidesForExport';

const cleanup = vi.fn();

vi.mock('./renderSlidesForExport', async importOriginal => ({
  ...(await importOriginal<typeof import('./renderSlidesForExport')>()),
  renderSlidesForExport: vi.fn(),
}));

const html2canvas = vi.fn();
vi.mock('html2canvas', () => ({ default: (...args: unknown[]) => html2canvas(...args) }));

const pdfInstances: Array<Record<string, ReturnType<typeof vi.fn>> & { options: unknown }> = [];
vi.mock('jspdf', () => ({
  default: class {
    // Page size follows the requested format, like the real jsPDF
    internal = {
      pageSize: {
        getWidth: () => (this.options as { format: number[] }).format[0],
        getHeight: () => (this.options as { format: number[] }).format[1],
      },
    };
    addPage = vi.fn();
    addImage = vi.fn();
    save = vi.fn();
    constructor(public options: unknown) {
      pdfInstances.push(this as never);
    }
  },
}));

const pptxInstances: Array<Record<string, unknown>> = [];
vi.mock('pptxgenjs', () => ({
  default: class {
    layout = '';
    defineLayout = vi.fn();
    addSlide = vi.fn(() => ({ addImage: vi.fn() }));
    writeFile = vi.fn().mockResolvedValue('ok');
    constructor() {
      pptxInstances.push(this as never);
    }
  },
}));

const mockSlides = (count: number) => {
  vi.mocked(renderSlidesForExport).mockResolvedValue({
    slides: Array.from({ length: count }, () => document.createElement('div')),
    cleanup,
  });
};

beforeEach(() => {
  vi.clearAllMocks();
  pdfInstances.length = 0;
  pptxInstances.length = 0;
  html2canvas.mockResolvedValue({ toDataURL: () => 'data:image/png;base64,AAA' });
  vi.spyOn(console, 'log').mockImplementation(() => {});
  vi.spyOn(console, 'error').mockImplementation(() => {});
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('exportSlidesToPDF', () => {
  it('uses a 16:9 page matching the slide so images are not cropped', async () => {
    mockSlides(2);
    await exportSlidesToPDF('# a\n---\n# b', 'dark');

    const pdf = pdfInstances[0];
    expect(pdf.options).toEqual({ orientation: 'landscape', unit: 'pt', format: [1080, 607.5] });
    expect(pdf.addImage).toHaveBeenCalledTimes(2);
    expect(pdf.addImage).toHaveBeenCalledWith(expect.any(String), 'JPEG', 0, 0, 1080, 607.5);
    expect(pdf.addPage).toHaveBeenCalledTimes(1);
    expect(pdf.save).toHaveBeenCalledWith(expect.stringMatching(/^slides_\d{4}-\d{2}-\d{2}\.pdf$/));
  });

  it('cleans up after a successful export', async () => {
    mockSlides(1);
    await exportSlidesToPDF('# a');
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('cleans up and rethrows when capture fails', async () => {
    mockSlides(1);
    html2canvas.mockRejectedValue(new Error('canvas failed'));

    await expect(exportSlidesToPDF('# a')).rejects.toThrow('canvas failed');
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('rejects and cleans up when there are no slides', async () => {
    mockSlides(0);

    await expect(exportSlidesToPDF('')).rejects.toThrow('No slides to export');
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});

describe('exportSlidesToPPTX', () => {
  it('defines a 16:9 layout matching the slide so images are not stretched', async () => {
    mockSlides(3);
    await exportSlidesToPPTX('# a', 'light');

    const pptx = pptxInstances[0] as { defineLayout: ReturnType<typeof vi.fn>; layout: string; addSlide: ReturnType<typeof vi.fn> };
    expect(pptx.defineLayout).toHaveBeenCalledWith({ name: 'REACT_SLIDES', width: 10, height: 5.625 });
    expect(pptx.layout).toBe('REACT_SLIDES');
    expect(pptx.addSlide).toHaveBeenCalledTimes(3);
  });

  it('cleans up after a successful export', async () => {
    mockSlides(1);
    await exportSlidesToPPTX('# a');
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('cleans up and rethrows when capture fails', async () => {
    mockSlides(1);
    html2canvas.mockRejectedValue(new Error('canvas failed'));

    await expect(exportSlidesToPPTX('# a')).rejects.toThrow('canvas failed');
    expect(cleanup).toHaveBeenCalledTimes(1);
  });

  it('rejects and cleans up when there are no slides', async () => {
    mockSlides(0);

    await expect(exportSlidesToPPTX('')).rejects.toThrow('No slides to export');
    expect(cleanup).toHaveBeenCalledTimes(1);
  });
});

describe('export theme resolution', () => {
  it('uses the frontmatter theme when no theme is passed', async () => {
    mockSlides(1);
    await exportSlidesToPDF('---\ntheme: dark\n---\n# a');

    expect(renderSlidesForExport).toHaveBeenCalledWith(expect.any(String), 'dark');
    expect(html2canvas).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ backgroundColor: '#1a1a1a' }));
  });

  it('lets an explicit theme override the frontmatter theme', async () => {
    mockSlides(1);
    await exportSlidesToPPTX('---\ntheme: dark\n---\n# a', 'light');

    expect(renderSlidesForExport).toHaveBeenCalledWith(expect.any(String), 'light');
    expect(html2canvas).toHaveBeenCalledWith(expect.anything(), expect.objectContaining({ backgroundColor: '#ffffff' }));
  });
});
