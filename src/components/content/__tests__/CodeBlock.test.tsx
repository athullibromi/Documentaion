import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import CodeBlock from '../CodeBlock';

// Mock navigator.clipboard
const mockClipboard = {
  writeText: jest.fn(() => Promise.resolve()),
};

Object.assign(navigator, {
  clipboard: mockClipboard,
});

// Mock window.isSecureContext
Object.defineProperty(window, 'isSecureContext', {
  writable: true,
  value: true,
});

describe('CodeBlock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders code block with copy button', () => {
    const code = 'console.log("Hello, World!");';
    render(<CodeBlock code={code} language="javascript" />);
    
    expect(screen.getByText(code)).toBeInTheDocument();
    expect(screen.getByLabelText('Copy code to clipboard')).toBeInTheDocument();
  });

  it('shows language label when language is specified', () => {
    const code = 'const x = 1;';
    render(<CodeBlock code={code} language="javascript" />);
    
    expect(screen.getByText('JavaScript')).toBeInTheDocument();
  });

  it('shows filename when provided', () => {
    const code = 'const x = 1;';
    const filename = 'example.js';
    render(<CodeBlock code={code} language="javascript" filename={filename} />);
    
    expect(screen.getByText(filename)).toBeInTheDocument();
  });

  it('copies code to clipboard when copy button is clicked', async () => {
    const code = 'console.log("Hello, World!");';
    render(<CodeBlock code={code} language="javascript" />);
    
    const copyButton = screen.getByLabelText('Copy code to clipboard');
    fireEvent.click(copyButton);
    
    await waitFor(() => {
      expect(mockClipboard.writeText).toHaveBeenCalledWith(code);
    });
    
    await waitFor(() => {
      expect(screen.getByText('Copied!')).toBeInTheDocument();
    });
  });

  it('shows floating copy button for plaintext without filename', () => {
    const code = 'Plain text content';
    render(<CodeBlock code={code} language="plaintext" />);
    
    const copyButton = screen.getByLabelText('Copy code to clipboard');
    expect(copyButton).toHaveClass('opacity-0');
  });

  it('handles copy failure gracefully', async () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    mockClipboard.writeText.mockRejectedValueOnce(new Error('Copy failed'));
    
    const code = 'console.log("Hello, World!");';
    render(<CodeBlock code={code} language="javascript" />);
    
    const copyButton = screen.getByLabelText('Copy code to clipboard');
    fireEvent.click(copyButton);
    
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to copy code:', expect.any(Error));
    });
    
    consoleSpy.mockRestore();
  });

  it('renders line numbers when showLineNumbers is true', () => {
    const code = 'line 1\nline 2\nline 3';
    render(<CodeBlock code={code} showLineNumbers={true} />);
    
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
  });

  it('highlights specified lines', () => {
    const code = 'line 1\nline 2\nline 3';
    render(<CodeBlock code={code} showLineNumbers={true} highlightLines={[2]} />);
    
    const lineNumber = screen.getByText('2');
    expect(lineNumber).toHaveClass('bg-yellow-500/20');
  });
});