'use client';

import { Document } from '@/types';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { SECTION_LABELS } from '@/lib/constants';
import { extractCodeBlocks, CodeBlockData } from '@/lib/code-block-parser';
import CodeBlock from './CodeBlock';

/**
 * Extract headings from HTML content for table of contents
 */
function extractHeadings(content: string): { text: string; level: number; id: string }[] {
  const headingRegex = /<h([1-6])(?:[^>]*)>([^<]+)<\/h[1-6]>/g;
  const headings: { text: string; level: number; id: string }[] = [];
  let match;

  while ((match = headingRegex.exec(content)) !== null) {
    const level = parseInt(match[1]);
    const text = match[2].trim();
    const id = text.toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

    headings.push({ text, level, id });
  }

  return headings;
}

interface DocumentPageProps {
  document: Document;
  section: string;
}

interface TableOfContentsProps {
  headings: { text: string; level: number; id: string }[];
  activeId: string;
  onHeadingClick: (id: string) => void;
}

function TableOfContents({ headings, activeId, onHeadingClick }: TableOfContentsProps) {
  if (headings.length === 0) return null;

  // Filter headings to only show h2-h4 for better readability
  const filteredHeadings = headings.filter(h => h.level >= 2 && h.level <= 4);

  if (filteredHeadings.length === 0) return null;

  return (
    <div className="sticky top-8">
      <h3 className="text-sm font-semibold text-gray-900 mb-3">On this page</h3>
      <nav className="space-y-1" aria-label="Table of contents">
        {filteredHeadings.map((heading) => (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            onClick={(e) => {
              e.preventDefault();
              onHeadingClick(heading.id);
            }}
            className={`block text-sm transition-colors duration-200 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-2 py-1 -mx-2 ${activeId === heading.id
              ? 'text-blue-600 font-medium bg-blue-50'
              : 'text-gray-600'
              }`}
            style={{ paddingLeft: `${(heading.level - 2) * 12 + 8}px` }}
            aria-current={activeId === heading.id ? 'location' : undefined}
          >
            {heading.text}
          </a>
        ))}
      </nav>
    </div>
  );
}

interface BreadcrumbProps {
  section: string;
  document: Document;
}

function Breadcrumb({ section, document }: BreadcrumbProps) {
  const pathParts = document.slug.split('/').filter(Boolean);
  const sectionLabel = SECTION_LABELS[section as keyof typeof SECTION_LABELS] || section;

  // Build breadcrumb items from path hierarchy
  const breadcrumbItems: { label: string; href: string | null }[] = [
    { label: 'Home', href: '/' },
    { label: sectionLabel, href: `/${section}` }
  ];

  // Add intermediate path segments for deeper hierarchies
  if (pathParts.length > 1) {
    let currentPath = section;

    for (let i = 1; i < pathParts.length - 1; i++) {
      currentPath += `/${pathParts[i]}`;
      const label = pathParts[i]
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      breadcrumbItems.push({
        label,
        href: `/${currentPath}`
      });
    }
  }

  // Add current page (not linked)
  breadcrumbItems.push({
    label: document.meta.title,
    href: null
  });

  return (
    <nav className="flex flex-wrap items-center gap-2 text-sm text-gray-600 mb-6" aria-label="Breadcrumb">
      {breadcrumbItems.map((item, index) => (
        <div key={index} className="flex items-center gap-2">
          {index > 0 && (
            <span className="text-gray-400" aria-hidden="true">/</span>
          )}
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded px-1 py-0.5 -mx-1"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-900 font-medium" aria-current="page">
              {item.label}
            </span>
          )}
        </div>
      ))}
    </nav>
  );
}

interface RelatedDocumentProps {
  title: string;
  path: string;
  type: 'previous' | 'next';
}

function RelatedDocument({ title, path, type }: RelatedDocumentProps) {
  return (
    <Link
      href={path}
      className={`flex items-center p-4 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 ${type === 'previous' ? 'text-left' : 'text-right flex-row-reverse'
        }`}
    >
      {type === 'previous' ? (
        <svg className="h-5 w-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      ) : (
        <svg className="h-5 w-5 ml-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      )}
      <div className={type === 'previous' ? '' : 'text-right'}>
        <div className="text-xs text-gray-500 mb-1">
          {type === 'previous' ? 'Previous' : 'Next'}
        </div>
        <div className="font-medium text-gray-900">{title}</div>
      </div>
    </Link>
  );
}

export default function DocumentPage({ document, section }: DocumentPageProps) {
  const [activeId, setActiveId] = useState('');
  const [codeBlocks, setCodeBlocks] = useState<Map<string, CodeBlockData>>(new Map());
  const [isMounted, setIsMounted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  // Set mounted state
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Process content to extract code blocks and add IDs to headings
  const { html: processedContent, codeBlocks: extractedCodeBlocks } = extractCodeBlocks(
    document.content
      // Add IDs to headings
      .replace(
        /<h([1-6])(?:[^>]*)>([^<]+)<\/h[1-6]>/g,
        (match, level, text) => {
          const cleanText = text.trim();
          const id = cleanText.toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
            .replace(/\s+/g, '-') // Replace spaces with hyphens
            .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
            .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
          return `<h${level} id="${id}">${cleanText}</h${level}>`;
        }
      )
  );

  const headings = extractHeadings(processedContent);

  // Update code blocks state when content changes
  useEffect(() => {
    setCodeBlocks(extractedCodeBlocks);
  }, [document.content]); // Remove extractedCodeBlocks from dependencies to prevent infinite loop

  // Handle intersection observer for active heading tracking
  // Temporarily disabled to fix navigation issues
  // useEffect(() => {
  //   // Only run on client side after component is mounted
  //   if (!isMounted || typeof window === 'undefined' || typeof document === 'undefined') return;

  //   const observer = new IntersectionObserver(
  //     (entries) => {
  //       entries.forEach((entry) => {
  //         if (entry.isIntersecting) {
  //           setActiveId(entry.target.id);
  //         }
  //       });
  //     },
  //     {
  //       rootMargin: '-20% 0% -35% 0%',
  //       threshold: 0,
  //     }
  //   );

  //   // Observe all headings
  //   const headingElements = document.querySelectorAll('h1[id], h2[id], h3[id], h4[id], h5[id], h6[id]');
  //   headingElements.forEach((el) => observer.observe(el));

  //   return () => observer.disconnect();
  // }, [isMounted, document.content]);

  // Handle smooth scrolling to headings
  const scrollToHeading = (id: string) => {
    // Only run on client side after component is mounted
    if (!isMounted) return;

    const element = globalThis.document.getElementById(id);
    if (element) {
      // Calculate header height for offset
      const headerHeight = 80; // Approximate header height
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });

      // Update active ID
      setActiveId(id);
    }
  };

  // Create a component to render content with code blocks
  const ContentWithCodeBlocks = ({ html, codeBlocks }: { html: string; codeBlocks: Map<string, CodeBlockData> }) => {
    // Split HTML by code block placeholders and render accordingly
    const parts = html.split(/(<div class="code-block-placeholder" data-block-id="[^"]+"><\/div>)/);

    return (
      <>
        {parts.map((part, index) => {
          // Check if this part is a code block placeholder
          const placeholderMatch = part.match(/data-block-id="([^"]+)"/);
          if (placeholderMatch) {
            const blockId = placeholderMatch[1];
            const codeBlockData = codeBlocks.get(blockId);

            if (codeBlockData) {
              return (
                <CodeBlock
                  key={blockId}
                  code={codeBlockData.code}
                  language={codeBlockData.language}
                  filename={codeBlockData.filename}
                  showLineNumbers={codeBlockData.showLineNumbers}
                  highlightLines={codeBlockData.highlightLines}
                />
              );
            }
          }

          // Regular HTML content
          if (part.trim()) {
            return (
              <div
                key={index}
                dangerouslySetInnerHTML={{ __html: part }}
              />
            );
          }

          return null;
        })}
      </>
    );
  };

  // Mock related documents - in a real implementation, these would be determined from the navigation structure
  const previousDocument = {
    title: 'Previous Document',
    path: `/${section}/previous-document`,
  };

  const nextDocument = {
    title: 'Next Document',
    path: `/${section}/next-document`,
  };

  return (
    <>
      <Breadcrumb section={section} document={document} />

      <div className="flex gap-8">
        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Document header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {document.meta.title}
            </h1>
            {document.meta.description && (
              <p className="text-lg text-gray-600 mb-4">
                {document.meta.description}
              </p>
            )}

            {/* Document metadata */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
              <span>
                Last updated: {document.meta.lastUpdated.toLocaleDateString()}
              </span>
              {document.meta.tags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span>Tags:</span>
                  <div className="flex flex-wrap gap-1">
                    {document.meta.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Prerequisites */}
          {document.meta.prerequisites && document.meta.prerequisites.length > 0 && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
              <h3 className="text-sm font-semibold text-blue-900 mb-2">
                Prerequisites
              </h3>
              <ul className="text-sm text-blue-800 space-y-1">
                {document.meta.prerequisites.map((prereq, index) => (
                  <li key={index} className="flex items-start">
                    <span className="mr-2">•</span>
                    <span>{prereq}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Document content */}
          <div
            ref={contentRef}
            className="prose prose-lg prose-gray max-w-none text-gray-900 prose-headings:text-gray-900 prose-headings:scroll-mt-20 prose-headings:font-semibold prose-p:text-gray-700 prose-li:text-gray-700 prose-strong:text-gray-900 prose-a:text-blue-600 prose-a:no-underline hover:prose-a:underline prose-code:text-sm prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded prose-img:rounded-lg prose-img:shadow-md"
          >
            <ContentWithCodeBlocks html={processedContent} codeBlocks={codeBlocks} />
          </div>

          {/* Feedback section */}
          <div className="mt-12 pt-6 border-t border-gray-200">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-600">
                Was this page helpful?
              </div>
              <div className="flex items-center gap-2">
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  Yes
                </button>
                <button className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
                  No
                </button>
              </div>
            </div>
          </div>

          {/* Previous/Next navigation */}
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <RelatedDocument
              title={previousDocument.title}
              path={previousDocument.path}
              type="previous"
            />
            <RelatedDocument
              title={nextDocument.title}
              path={nextDocument.path}
              type="next"
            />
          </div>
        </div>

        {/* Table of contents - positioned on the right */}
        {headings.length > 0 && (
          <div className="hidden xl:block w-64 flex-shrink-0">
            <TableOfContents
              headings={headings}
              activeId={activeId}
              onHeadingClick={scrollToHeading}
            />
          </div>
        )}
      </div>
    </>
  );
}