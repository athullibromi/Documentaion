'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { SearchDocument } from '@/types';
import { SearchResult, loadSearchIndex, searchDocuments, extractPreview, highlightMatches } from '@/lib/search-index';
import Layout from '@/components/layout/Layout';

function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchIndex, setSearchIndex] = useState<SearchDocument[]>([]);
  const [hasSearched, setHasSearched] = useState(false);

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

  // Perform search when query or search index changes
  useEffect(() => {
    if (!query.trim() || searchIndex.length === 0) {
      setResults([]);
      return;
    }

    setHasSearched(true);
    
    // Perform search with higher limit for full results page
    const searchResults = searchDocuments(searchIndex, query, { limit: 50 });
    setResults(searchResults);
  }, [query, searchIndex]);

  // Handle initial search from URL parameter
  useEffect(() => {
    if (initialQuery && searchIndex.length > 0) {
      setQuery(initialQuery);
    }
  }, [initialQuery, searchIndex]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Search will be triggered by useEffect when query changes
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">Search Documentation</h1>
          
          {/* Search Form */}
          <form onSubmit={handleSearchSubmit} className="mb-6">
            <div className="relative max-w-2xl">
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
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
                placeholder="Search documentation..."
                autoFocus
              />

            </div>
          </form>

          {/* Search Stats */}
          {hasSearched && (
            <div className="text-sm text-gray-600">
              {`Found ${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`}
            </div>
          )}
        </div>

        {/* Search Results */}
        <div className="space-y-6">
          {results.length > 0 ? (
            results.map((result) => (
              <SearchResultCard key={result.document.id} result={result} />
            ))
          ) : hasSearched ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">No results found</h3>
              <p className="mt-1 text-sm text-gray-500">
                Try adjusting your search terms or browse our documentation sections.
              </p>
              <div className="mt-6">
                <Link
                  href="/"
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Browse Documentation
                </Link>
              </div>
            </div>
          ) : !hasSearched ? (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
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
              <h3 className="mt-2 text-sm font-medium text-gray-900">Search our documentation</h3>
              <p className="mt-1 text-sm text-gray-500">
                Enter a search term above to find relevant documentation pages.
              </p>
            </div>
          ) : null}
        </div>
      </div>
    </Layout>
  );
}

interface SearchResultCardProps {
  result: SearchResult;
}

function SearchResultCard({ result }: SearchResultCardProps) {
  const { document, matches, score } = result;
  
  // Get content matches for preview
  const contentMatches = matches.find(m => m.field === 'content');
  const preview = contentMatches 
    ? extractPreview(document.content, contentMatches.indices, 200)
    : document.content.slice(0, 200) + (document.content.length > 200 ? '...' : '');

  // Get title matches for highlighting
  const titleMatches = matches.find(m => m.field === 'title');
  const highlightedTitle = titleMatches 
    ? highlightMatches(document.title, titleMatches.indices, 'bg-yellow-200')
    : document.title;

  // Get heading matches
  const headingMatches = matches.filter(m => m.field === 'headings');

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Title */}
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            <Link
              href={document.path}
              className="hover:text-blue-600 transition-colors duration-200"
              dangerouslySetInnerHTML={{ __html: highlightedTitle }}
            />
          </h2>

          {/* URL */}
          <div className="text-sm text-green-600 mb-3">
            {document.path}
          </div>

          {/* Preview */}
          <p className="text-gray-700 mb-4 leading-relaxed">
            {preview}
          </p>

          {/* Matching Headings */}
          {headingMatches.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-900 mb-2">Matching sections:</h4>
              <div className="space-y-1">
                {headingMatches.slice(0, 3).map((match, index) => (
                  <div key={index} className="text-sm text-blue-600">
                    • {match.text}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tags and Category */}
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
              {document.category}
            </span>
            {document.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {tag}
              </span>
            ))}
            {document.tags.length > 3 && (
              <span className="text-xs text-gray-500">
                +{document.tags.length - 3} more
              </span>
            )}
          </div>
        </div>

        {/* Score indicator (for debugging - can be removed in production) */}
        {process.env.NODE_ENV === 'development' && (
          <div className="ml-4 flex-shrink-0">
            <div className="text-xs text-gray-500">
              Score: {score.toFixed(2)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <Layout>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-gray-600">Loading search...</p>
          </div>
        </div>
      </Layout>
    }>
      <SearchPageContent />
    </Suspense>
  );
}