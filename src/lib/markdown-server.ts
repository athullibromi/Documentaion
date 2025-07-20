import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { DocumentMeta, NavigationItem, Document } from '@/types';
import { NAVIGATION_SECTIONS } from './constants';

// Configure remark processor
const processor = remark()
  .use(remarkGfm)
  .use(remarkHtml, { sanitize: false });

const DOCS_DIRECTORY = path.join(process.cwd(), 'docs');

/**
 * Parse markdown content with frontmatter
 */
export async function parseMarkdown(content: string): Promise<{ meta: DocumentMeta; content: string }> {
  const { data, content: markdownContent } = matter(content);
  
  const processedContent = await processor.process(markdownContent);
  
  return {
    meta: {
      title: data.title || 'Untitled',
      description: data.description || '',
      category: data.category || 'general',
      order: data.order || 0,
      lastUpdated: data.lastUpdated ? new Date(data.lastUpdated) : new Date(),
      tags: data.tags || [],
      prerequisites: data.prerequisites || undefined,
    },
    content: processedContent.toString(),
  };
}

/**
 * Get all markdown files from a directory recursively
 */
function getMarkdownFiles(dir: string): string[] {
  const files: string[] = [];
  
  if (!fs.existsSync(dir)) {
    return files;
  }
  
  const items = fs.readdirSync(dir);
  
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      files.push(...getMarkdownFiles(fullPath));
    } else if (item.endsWith('.md')) {
      files.push(fullPath);
    }
  }
  
  return files;
}

/**
 * Load a single document by file path
 */
export async function loadDocument(filePath: string): Promise<Document> {
  const content = fs.readFileSync(filePath, 'utf8');
  const { meta, content: processedContent } = await parseMarkdown(content);
  
  // Generate slug from file path
  const relativePath = path.relative(DOCS_DIRECTORY, filePath);
  const slug = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
  
  return {
    meta,
    content: processedContent,
    slug,
  };
}

/**
 * Load all documents from the docs directory
 */
export async function loadAllDocuments(): Promise<Document[]> {
  const files = getMarkdownFiles(DOCS_DIRECTORY);
  const documents: Document[] = [];
  
  for (const file of files) {
    try {
      const document = await loadDocument(file);
      documents.push(document);
    } catch (error) {
      console.warn(`Failed to load document: ${file}`, error);
    }
  }
  
  return documents.sort((a, b) => a.meta.order - b.meta.order);
}

/**
 * Load documents for a specific section
 */
export async function loadDocumentsBySection(section: string): Promise<Document[]> {
  const sectionDir = path.join(DOCS_DIRECTORY, section);
  const files = getMarkdownFiles(sectionDir);
  const documents: Document[] = [];
  
  for (const file of files) {
    try {
      const document = await loadDocument(file);
      documents.push(document);
    } catch (error) {
      console.warn(`Failed to load document: ${file}`, error);
    }
  }
  
  return documents.sort((a, b) => a.meta.order - b.meta.order);
}

/**
 * Generate navigation structure from folder structure
 */
export async function generateNavigation(): Promise<Record<string, NavigationItem[]>> {
  const navigation: Record<string, NavigationItem[]> = {};
  
  for (const section of NAVIGATION_SECTIONS) {
    navigation[section] = await generateSectionNavigation(section);
  }
  
  return navigation;
}

/**
 * Generate navigation for a specific section
 */
async function generateSectionNavigation(section: string): Promise<NavigationItem[]> {
  const sectionDir = path.join(DOCS_DIRECTORY, section);
  
  if (!fs.existsSync(sectionDir)) {
    return [];
  }
  
  return await buildNavigationTree(sectionDir, section);
}

/**
 * Build navigation tree recursively
 */
async function buildNavigationTree(dir: string, section: string, basePath = ''): Promise<NavigationItem[]> {
  const items: NavigationItem[] = [];
  
  if (!fs.existsSync(dir)) {
    return items;
  }
  
  const entries = fs.readdirSync(dir);
  
  for (const entry of entries) {
    const fullPath = path.join(dir, entry);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      // Handle subdirectories
      const children = await buildNavigationTree(fullPath, section, path.join(basePath, entry));
      
      if (children.length > 0) {
        items.push({
          title: formatTitle(entry),
          path: `/${section}/${path.join(basePath, entry)}`,
          children,
          order: 0,
          category: section,
        });
      }
    } else if (entry.endsWith('.md')) {
      // Handle markdown files
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(content);
        
        const fileName = entry.replace('.md', '');
        const itemPath = basePath ? path.join(basePath, fileName) : fileName;
        
        items.push({
          title: data.title || formatTitle(fileName),
          path: `/${section}/${itemPath}`,
          order: data.order || 0,
          category: section,
        });
      } catch (error) {
        console.warn(`Failed to process navigation for: ${fullPath}`, error);
      }
    }
  }
  
  // Sort by order, then by title
  return items.sort((a, b) => {
    if (a.order !== b.order) {
      return a.order - b.order;
    }
    return a.title.localeCompare(b.title);
  });
}

/**
 * Format file/folder names into readable titles
 */
function formatTitle(name: string): string {
  return name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Get document by slug
 */
export async function getDocumentBySlug(slug: string): Promise<Document | null> {
  const filePath = path.join(DOCS_DIRECTORY, `${slug}.md`);
  
  if (!fs.existsSync(filePath)) {
    return null;
  }
  
  try {
    return await loadDocument(filePath);
  } catch (error) {
    console.error(`Failed to load document: ${slug}`, error);
    return null;
  }
}