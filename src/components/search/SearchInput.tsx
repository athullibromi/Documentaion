'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { SearchDocument } from '@/types';
import { SearchResult, loadSearchIndex, searchDocuments, extractPreview } from '@/lib/search-index';

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  onResultClick?: () => void;
}

export default function SearchInput({ 
  placeholder = "Search documentation...", 
  className = "",
  onResultClick 
}: SearchInputProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [searchIndex, setSearchIndex] = useState<SearchDocument[]>([]);
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Load search index on component mount
  useEffect(() => {
    const loadIndex = async () => {
      try {
        const index = await loadSearchIndex();
        setSearchIndex(index);
      } catch (error) {
        console.error('Failed to load search index:', error);
      }
    };
    
    loadIndex();
  }, []);

  // Handle search query changes
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowResults(false);
      return;
    }

    // Debounce search
    const timeoutId = setTimeout(() => {
      const searchResults = searchDocuments(searchIndex, query, { limit: 8 });
      setResults(searchResults);
      setShowResults(true);
    }, 150);

    return () => clearTimeout(timeoutId);
  }, [query, searchIndex]);

  // Handle clicks outside search component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputFocus = () => {
    if (query.trim() && results.length > 0) {
      setShowResults(true);
    }
  };

  const handleResultClick = () => {
    setShowResults(false);
    setQuery('');
    onResultClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setShowResults(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg
            className="h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleInputFocus}
          onKeyDown={handleKeyDown}
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          placeholder={placeholder}
        />

      </div>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            <>
              {results.map((result, index) => (
                <SearchResultItem
                  key={result.document.id}
                  result={result}
                  onClick={handleResultClick}
                  isFirst={index === 0}
                />
              ))}
              {results.length >= 8 && (
                <div className="px-4 py-2 border-t border-gray-100 bg-gray-50">
                  <Link
                    href={`/search?q=${encodeURIComponent(query)}`}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    onClick={handleResultClick}
                  >
                    View all results for &quot;{query}&quot;
                  </Link>
                </div>
              )}
            </>
          ) : query.trim() ? (
            <div className="px-4 py-3 text-sm text-gray-500">
              No results found for &quot;{query}&quot;
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}

interface SearchResultItemProps {
  result: SearchResult;
  onClick: () => void;
  isFirst: boolean;
}

function SearchResultItem({ result, onClick, isFirst }: SearchResultItemProps) {
  const { document, matches } = result;
  
  // Get content matches for preview
  const contentMatches = matches.find(m => m.field === 'content');
  const preview = contentMatches 
    ? extractPreview(document.content, contentMatches.indices, 150)
    : document.content.slice(0, 150) + (document.content.length > 150 ? '...' : '');

  return (
    <Link
      href={document.path}
      onClick={onClick}
      className={`block px-4 py-3 hover:bg-gray-50 transition-colors duration-150 ${
        isFirst ? '' : 'border-t border-gray-100'
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-medium text-gray-900 truncate">
            {document.title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 line-clamp-2">
            {preview}
          </p>
          <div className="flex items-center mt-2 space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
              {document.category}
            </span>
            {document.tags.slice(0, 2).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
        <div className="ml-2 flex-shrink-0">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </div>
      </div>
    </Link>
  );
}