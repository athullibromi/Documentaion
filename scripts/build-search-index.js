#!/usr/bin/env node

/**
 * Build script to generate search index from markdown content
 * This script should be run during the build process
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const SEARCH_INDEX_PATH = path.join(process.cwd(), 'public', 'search-index.json');
const DOCS_DIR = path.join(process.cwd(), 'docs');

/**
 * Extract headings from markdown content
 */
function extractHeadings(content) {
  const headingRegex = /^(#{1,6})\s+(.+)$/gm;
  const headings = [];
  let match;
  
  while ((match = headingRegex.exec(content)) !== null) {
    const level = match[1].length;
    const text = match[2];
    const id = text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    headings.push({ text, level, id });
  }
  
  return headings;
}

/**
 * Extract searchable content from markdown
 */
function extractSearchableContent(markdownContent) {
  const headings = extractHeadings(markdownContent);
  
  // Remove code blocks and other non-searchable content
  const cleanContent = markdownContent
    .replace(/```[\s\S]*?```/g, '') // Remove code blocks
    .replace(/`[^`]+`/g, '') // Remove inline code
    .replace(/!\[.*?\]\(.*?\)/g, '') // Remove images
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Keep link text only
    .replace(/#{1,6}\s+/g, '') // Remove heading markers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markers
    .replace(/\*([^*]+)\*/g, '$1') // Remove italic markers
    .replace(/^\s*[-*+]\s+/gm, '') // Remove list markers
    .replace(/^\s*\d+\.\s+/gm, '') // Remove numbered list markers
    .replace(/\n{2,}/g, '\n') // Normalize line breaks
    .trim();

  return {
    content: cleanContent,
    headings: headings.map(h => h.text)
  };
}

/**
 * Get all markdown files recursively from a directory
 */
function getMarkdownFilesRecursive(dir) {
  const files = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getMarkdownFilesRecursive(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Create search document from markdown file
 */
function createSearchDocument(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const { data, content: markdownContent } = matter(content);
    
    // Generate document ID from file path
    const relativePath = path.relative(DOCS_DIR, filePath);
    const id = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
    
    // Extract searchable content
    const { content: searchableContent, headings } = extractSearchableContent(markdownContent);
    
    // Create search document
    const searchDoc = {
      id,
      title: data.title || path.basename(filePath, '.md'),
      content: searchableContent,
      path: `/${id}`,
      category: data.category || id.split('/')[0] || 'general',
      tags: data.tags || [],
      headings
    };
    
    return searchDoc;
  } catch (error) {
    console.warn(`Failed to create search document for: ${filePath}`, error);
    return null;
  }
}

/**
 * Build search index from all markdown files
 */
function buildSearchIndex() {
  const searchDocuments = [];
  
  if (!fs.existsSync(DOCS_DIR)) {
    console.warn('Docs directory not found, creating empty search index');
    return searchDocuments;
  }
  
  // Get all markdown files recursively
  const markdownFiles = getMarkdownFilesRecursive(DOCS_DIR);
  
  // Process each file
  for (const filePath of markdownFiles) {
    const searchDoc = createSearchDocument(filePath);
    if (searchDoc) {
      searchDocuments.push(searchDoc);
    }
  }
  
  console.log(`Built search index with ${searchDocuments.length} documents`);
  return searchDocuments;
}

/**
 * Save search index to JSON file
 */
function saveSearchIndex(searchDocuments) {
  try {
    // Ensure public directory exists
    const publicDir = path.dirname(SEARCH_INDEX_PATH);
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Write search index to file
    fs.writeFileSync(SEARCH_INDEX_PATH, JSON.stringify(searchDocuments, null, 2));
    console.log(`Search index saved to: ${SEARCH_INDEX_PATH}`);
  } catch (error) {
    console.error('Failed to save search index:', error);
    throw error;
  }
}

/**
 * Generate and save search index
 */
function generateSearchIndex() {
  console.log('Generating search index...');
  
  try {
    const searchDocuments = buildSearchIndex();
    saveSearchIndex(searchDocuments);
    console.log('Search index generation completed successfully');
  } catch (error) {
    console.error('Search index generation failed:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting search index generation...');
    generateSearchIndex();
    console.log('Search index generation completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Search index generation failed:', error);
    process.exit(1);
  }
}

// Run the script
main();