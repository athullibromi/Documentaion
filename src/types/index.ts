// Document metadata interface
export interface DocumentMeta {
  title: string;
  description: string;
  category: string;
  order: number;
  lastUpdated: Date;
  tags: string[];
  prerequisites?: string[];
}

// Navigation structure interface
export interface NavigationItem {
  title: string;
  path: string;
  children?: NavigationItem[];
  order: number;
  category: string;
}

// Search document interface
export interface SearchDocument {
  id: string;
  title: string;
  content: string;
  path: string;
  category: string;
  tags: string[];
  headings: string[];
}

// Document with content interface
export interface Document {
  meta: DocumentMeta;
  content: string;
  slug: string;
}