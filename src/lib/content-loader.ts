import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { remark } from 'remark';
import remarkHtml from 'remark-html';
import remarkGfm from 'remark-gfm';
import { Document, DocumentMeta } from '@/types';

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
 * Get document by slug (server-side only)
 */
export async function getDocumentBySlug(slug: string): Promise<Document | null> {
  try {
    const filePath = path.join(DOCS_DIRECTORY, `${slug}.md`);
    
    if (!fs.existsSync(filePath)) {
      return null;
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    const { meta, content: processedContent } = await parseMarkdown(content);
    
    return {
      meta,
      content: processedContent,
      slug,
    };
  } catch (error) {
    console.error(`Failed to load document: ${slug}`, error);
    return null;
  }
}

/**
 * Load documents for a specific section (server-side only)
 */
export async function loadDocumentsBySection(section: string): Promise<Document[]> {
  try {
    const sectionDir = path.join(DOCS_DIRECTORY, section);
    
    if (!fs.existsSync(sectionDir)) {
      return [];
    }
    
    const documents: Document[] = [];
    const files = getMarkdownFilesRecursive(sectionDir);
    
    for (const file of files) {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const { meta, content: processedContent } = await parseMarkdown(content);
        
        // Generate slug from file path
        const relativePath = path.relative(DOCS_DIRECTORY, file);
        const slug = relativePath.replace(/\.md$/, '').replace(/\\/g, '/');
        
        documents.push({
          meta,
          content: processedContent,
          slug,
        });
      } catch (error) {
        console.warn(`Failed to load document: ${file}`, error);
      }
    }
    
    return documents.sort((a, b) => a.meta.order - b.meta.order);
  } catch (error) {
    console.error(`Failed to load documents for section: ${section}`, error);
    return [];
  }
}

/**
 * Get all markdown files from a directory recursively
 */
function getMarkdownFilesRecursive(dir: string): string[] {
  const files: string[] = [];
  
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