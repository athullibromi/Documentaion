'use client';

import { useEffect, useRef, useState } from 'react';

// Dynamically import Prism only on client side
let Prism: typeof import('prismjs') | null = null;

if (typeof window !== 'undefined') {
  try {
    /* eslint-disable @typescript-eslint/no-require-imports */
    Prism = require('prismjs');
    require('prismjs/components/prism-core');
    require('prismjs/components/prism-clike');
    require('prismjs/components/prism-javascript');
    require('prismjs/components/prism-typescript');
    require('prismjs/components/prism-css');
    require('prismjs/components/prism-scss');
    require('prismjs/components/prism-json');
    require('prismjs/components/prism-bash');
    require('prismjs/components/prism-shell-session');
    require('prismjs/components/prism-python');
    require('prismjs/components/prism-java');
    require('prismjs/components/prism-php');
    require('prismjs/components/prism-sql');
    require('prismjs/components/prism-yaml');
    require('prismjs/components/prism-markdown');
    require('prismjs/components/prism-markup');
    require('prismjs/components/prism-jsx');
    require('prismjs/components/prism-tsx');
    /* eslint-enable @typescript-eslint/no-require-imports */
  } catch (error) {
    console.warn('Prism.js not available:', error);
  }
}

// Language mappings for display names
const LANGUAGE_LABELS: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  jsx: 'JSX',
  tsx: 'TSX',
  css: 'CSS',
  scss: 'SCSS',
  json: 'JSON',
  bash: 'Bash',
  shell: 'Shell',
  python: 'Python',
  java: 'Java',
  php: 'PHP',
  sql: 'SQL',
  yaml: 'YAML',
  yml: 'YAML',
  markdown: 'Markdown',
  md: 'Markdown',
  xml: 'XML',
  html: 'HTML',
  plaintext: 'Text',
  text: 'Text',
};

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  highlightLines?: number[];
  className?: string;
}

export default function CodeBlock({
  code,
  language = 'plaintext',
  filename,
  showLineNumbers = false,
  highlightLines = [],
  className = '',
}: CodeBlockProps) {
  const codeRef = useRef<HTMLElement>(null);
  const [copied, setCopied] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Ensure we're on the client side before using Prism
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Apply syntax highlighting
  useEffect(() => {
    if (!isClient || !codeRef.current) return;

    // Normalize language name
    const normalizedLanguage = language.toLowerCase();
    
    // Check if language is supported by Prism
    const supportedLanguage = Prism.languages[normalizedLanguage] ? normalizedLanguage : 'plaintext';
    
    // Apply syntax highlighting
    if (supportedLanguage !== 'plaintext') {
      const highlightedCode = Prism.highlight(code, Prism.languages[supportedLanguage], supportedLanguage);
      codeRef.current.innerHTML = highlightedCode;
    } else {
      codeRef.current.textContent = code;
    }
  }, [code, language, isClient]);

  // Handle copy to clipboard
  const handleCopy = async () => {
    try {
      // Modern clipboard API
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } else {
        // Fallback for older browsers or non-secure contexts
        const textArea = document.createElement('textarea');
        textArea.value = code;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          // Use the modern approach or fallback to execCommand
          let successful = false;
          if (navigator.clipboard) {
            try {
              await navigator.clipboard.writeText(code);
              successful = true;
            } catch {
              // If clipboard API fails, try execCommand as last resort
              successful = document.execCommand('copy');
            }
          } else {
            successful = document.execCommand('copy');
          }
          
          if (successful) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } else {
            throw new Error('Copy command failed');
          }
        } catch (err) {
          console.error('Fallback copy failed:', err);
          // Show user feedback that copy failed
          setCopied(false);
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('Failed to copy code:', error);
      setCopied(false);
    }
  };

  // Get display language label
  const languageLabel = LANGUAGE_LABELS[language.toLowerCase()] || language.toUpperCase();

  // Split code into lines for line numbers
  const codeLines = code.split('\n');

  return (
    <div className={`relative group ${className}`}>
      {/* Header with filename and language */}
      {(filename || language !== 'plaintext') && (
        <div className="flex items-center justify-between bg-gray-800 text-gray-300 px-4 py-2 text-sm font-mono rounded-t-lg border-b border-gray-700">
          <div className="flex items-center gap-3">
            {filename && (
              <span className="text-gray-100 font-medium">{filename}</span>
            )}
            {language !== 'plaintext' && (
              <span className="text-xs bg-gray-700 px-2 py-1 rounded">
                {languageLabel}
              </span>
            )}
          </div>
          
          {/* Copy button in header */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                Copied!
              </>
            ) : (
              <>
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                Copy
              </>
            )}
          </button>
        </div>
      )}

      {/* Code content */}
      <div className="relative">
        <pre className={`bg-gray-900 text-gray-100 p-4 overflow-x-auto text-sm leading-relaxed ${
          filename || language !== 'plaintext' ? 'rounded-b-lg' : 'rounded-lg'
        }`}>
          {showLineNumbers ? (
            <div className="flex">
              {/* Line numbers */}
              <div className="flex flex-col text-gray-500 text-right pr-4 border-r border-gray-700 mr-4 select-none">
                {codeLines.map((_, index) => (
                  <span
                    key={index + 1}
                    className={`leading-relaxed ${
                      highlightLines.includes(index + 1) ? 'bg-yellow-500/20 text-yellow-300' : ''
                    }`}
                  >
                    {index + 1}
                  </span>
                ))}
              </div>
              
              {/* Code content with line highlighting */}
              <div className="flex-1">
                {codeLines.map((line, index) => (
                  <div
                    key={index}
                    className={`leading-relaxed ${
                      highlightLines.includes(index + 1) ? 'bg-yellow-500/20' : ''
                    }`}
                  >
                    <code
                      ref={index === 0 ? codeRef : undefined}
                      className={`language-${language}`}
                    >
                      {index === 0 ? '' : line}
                    </code>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <code
              ref={codeRef}
              className={`language-${language}`}
            >
              {!isClient ? code : ''}
            </code>
          )}
        </pre>

        {/* Floating copy button (when no header) */}
        {!filename && language === 'plaintext' && (
          <button
            onClick={handleCopy}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-700 hover:bg-gray-600 text-gray-300 p-1.5 rounded text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            aria-label="Copy code to clipboard"
          >
            {copied ? (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            )}
          </button>
        )}
      </div>
    </div>
  );
}