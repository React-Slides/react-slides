// Slide structure from markdown
export interface MarkdownSlide {
  content: string;
  index: number;
}

// Props for the MarkdownSlide component
export interface MarkdownSlideProps {
  content: string;
  index: number;
  isActive: boolean;
}

// Props for the SlideDeck component
export interface SlideDeckProps {
  markdownContent?: string;
  theme?: 'light' | 'dark' | 'corporate' | 'warm' | 'nature' | 'highcontrast';
}

// Form state for markdown input
export interface MarkdownFormState {
  markdown: string;
  isSubmitting: boolean;
  error: string | null;
}

// For future form submission response
export interface SubmissionResponse {
  success: boolean;
  url?: string;
  error?: string;
}

// Toast notification types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
  id: string;
  type: ToastType;
  message: string;
  duration?: number;
}