import { SearchDocument } from '@/types';

// Note: Search index generation is handled by scripts/build-search-index.js during build
// This file provides client-side search functionality

export interface SearchResult {
  document: SearchDocument;
  score: number;
  matches: {
    field: 'title' | 'content' | 'headings' | 'tags';
    text: string;
    indices: [number, number][];
  }[];
}

/**
 * Load search index from the public directory (client-side)
 */
export async function loadSearchIndex(): Promise<SearchDocument[]> {
  try {
    const response = await fetch('/search-index.json');
    if (!response.ok) {
      throw new Error(`Failed to load search index: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Failed to load search index:', error);
    return [];
  }
}

/**
 * Simple text search with scoring
 */
export function searchDocuments(
  documents: SearchDocument[],
  query: string,
  options: {
    limit?: number;
    threshold?: number;
  } = {}
): SearchResult[] {
  const { limit = 10, threshold = 0.1 } = options;
  
  if (!query.trim()) {
    return [];
  }
  
  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  const results: SearchResult[] = [];
  
  for (const document of documents) {
    const matches: SearchResult['matches'] = [];
    let totalScore = 0;
    
    // Search in title (highest weight)
    const titleMatches = findMatches(document.title.toLowerCase(), searchTerms);
    if (titleMatches.length > 0) {
      matches.push({
        field: 'title',
        text: document.title,
        indices: titleMatches
      });
      totalScore += titleMatches.length * 3; // Title matches get 3x weight
    }
    
    // Search in headings (medium weight)
    for (const heading of document.headings) {
      const headingMatches = findMatches(heading.toLowerCase(), searchTerms);
      if (headingMatches.length > 0) {
        matches.push({
          field: 'headings',
          text: heading,
          indices: headingMatches
        });
        totalScore += headingMatches.length * 2; // Heading matches get 2x weight
      }
    }
    
    // Search in tags (medium weight)
    for (const tag of document.tags) {
      const tagMatches = findMatches(tag.toLowerCase(), searchTerms);
      if (tagMatches.length > 0) {
        matches.push({
          field: 'tags',
          text: tag,
          indices: tagMatches
        });
        totalScore += tagMatches.length * 2; // Tag matches get 2x weight
      }
    }
    
    // Search in content (base weight)
    const contentMatches = findMatches(document.content.toLowerCase(), searchTerms);
    if (contentMatches.length > 0) {
      matches.push({
        field: 'content',
        text: document.content,
        indices: contentMatches
      });
      totalScore += contentMatches.length; // Content matches get 1x weight
    }
    
    // Calculate final score (normalize by document length and search terms)
    if (matches.length > 0) {
      const normalizedScore = totalScore / (document.content.length / 100) / searchTerms.length;
      
      if (normalizedScore >= threshold) {
        results.push({
          document,
          score: normalizedScore,
          matches
        });
      }
    }
  }
  
  // Sort by score (descending) and limit results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Find all matches of search terms in text
 */
function findMatches(text: string, searchTerms: string[]): [number, number][] {
  const matches: [number, number][] = [];
  
  for (const term of searchTerms) {
    let index = 0;
    while ((index = text.indexOf(term, index)) !== -1) {
      matches.push([index, index + term.length]);
      index += term.length;
    }
  }
  
  return matches.sort((a, b) => a[0] - b[0]);
}

/**
 * Extract content preview with highlighted search terms
 */
export function extractPreview(
  content: string,
  matches: [number, number][],
  maxLength: number = 200
): string {
  if (matches.length === 0) {
    return content.slice(0, maxLength) + (content.length > maxLength ? '...' : '');
  }
  
  // Find the first match and extract context around it
  const firstMatch = matches[0];
  const start = Math.max(0, firstMatch[0] - 50);
  const end = Math.min(content.length, start + maxLength);
  
  let preview = content.slice(start, end);
  
  // Add ellipsis if we're not at the beginning/end
  if (start > 0) preview = '...' + preview;
  if (end < content.length) preview = preview + '...';
  
  return preview;
}

/**
 * Highlight search terms in text
 */
export function highlightMatches(
  text: string,
  matches: [number, number][],
  highlightClass: string = 'search-highlight'
): string {
  if (matches.length === 0) {
    return text;
  }
  
  // Sort matches by position
  const sortedMatches = [...matches].sort((a, b) => a[0] - b[0]);
  
  let result = '';
  let lastIndex = 0;
  
  for (const [start, end] of sortedMatches) {
    // Add text before the match
    result += text.slice(lastIndex, start);
    
    // Add highlighted match
    result += `<mark class="${highlightClass}">${text.slice(start, end)}</mark>`;
    
    lastIndex = end;
  }
  
  // Add remaining text
  result += text.slice(lastIndex);
  
  return result;
}