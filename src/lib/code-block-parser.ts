/**
 * Utility functions for parsing and processing code blocks in HTML content
 */

export interface CodeBlockData {
  code: string;
  language: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
}

/**
 * Extract code block information from HTML pre/code elements
 */
export function extractCodeBlocks(html: string): { html: string; codeBlocks: Map<string, CodeBlockData> } {
  const codeBlocks = new Map<string, CodeBlockData>();
  let processedHtml = html;
  let blockCounter = 0;

  // Match code blocks with language classes
  const codeBlockRegex = /<pre><code class="language-([^"]*)"[^>]*>([\s\S]*?)<\/code><\/pre>/g;
  
  processedHtml = processedHtml.replace(codeBlockRegex, (_, language, code) => {
    // Generate deterministic ID for this code block
    const blockId = `code-block-${blockCounter++}`;
    
    // Decode HTML entities in the code
    const decodedCode = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    // Store code block data
    codeBlocks.set(blockId, {
      code: decodedCode.trim(),
      language: language || 'plaintext',
    });
    
    // Replace with placeholder
    return `<div class="code-block-placeholder" data-block-id="${blockId}"></div>`;
  });

  // Also handle plain code blocks without language
  const plainCodeRegex = /<pre><code(?![^>]*class="language-)[^>]*>([\s\S]*?)<\/code><\/pre>/g;
  
  processedHtml = processedHtml.replace(plainCodeRegex, (_, code) => {
    // Generate deterministic ID for this code block
    const blockId = `code-block-${blockCounter++}`;
    
    // Decode HTML entities in the code
    const decodedCode = code
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&amp;/g, '&')
      .replace(/&quot;/g, '"')
      .replace(/&#39;/g, "'");
    
    // Store code block data
    codeBlocks.set(blockId, {
      code: decodedCode.trim(),
      language: 'plaintext',
    });
    
    // Replace with placeholder
    return `<div class="code-block-placeholder" data-block-id="${blockId}"></div>`;
  });

  return { html: processedHtml, codeBlocks };
}

/**
 * Parse markdown code fence metadata
 * Supports formats like:
 * ```javascript title="example.js" lines
 * ```typescript {1,3-5}
 */
export function parseCodeFenceMeta(meta: string): {
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
} {
  const result: {
    filename?: string;
    showLineNumbers?: boolean;
    highlightLines?: number[];
  } = {};

  if (!meta) return result;

  // Extract filename from title="..." or just filename.ext
  const titleMatch = meta.match(/title=["']([^"']+)["']/);
  if (titleMatch) {
    result.filename = titleMatch[1];
  } else {
    // Look for standalone filename
    const filenameMatch = meta.match(/([a-zA-Z0-9_-]+\.[a-zA-Z0-9]+)/);
    if (filenameMatch) {
      result.filename = filenameMatch[1];
    }
  }

  // Check for line numbers
  if (meta.includes('lines') || meta.includes('showLineNumbers')) {
    result.showLineNumbers = true;
  }

  // Extract highlight lines from {1,3-5} format
  const highlightMatch = meta.match(/\{([0-9,-]+)\}/);
  if (highlightMatch) {
    const highlightStr = highlightMatch[1];
    const lines: number[] = [];
    
    highlightStr.split(',').forEach(part => {
      if (part.includes('-')) {
        const [start, end] = part.split('-').map(n => parseInt(n.trim()));
        for (let i = start; i <= end; i++) {
          lines.push(i);
        }
      } else {
        lines.push(parseInt(part.trim()));
      }
    });
    
    result.highlightLines = lines;
  }

  return result;
}