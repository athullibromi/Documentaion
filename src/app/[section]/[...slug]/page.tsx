import { notFound } from 'next/navigation';
import { getDocumentBySlug } from '@/lib/content-loader';
import { STATIC_NAVIGATION } from '@/lib/navigation';
import DocumentPage from '@/components/content/DocumentPage';
import { NAVIGATION_SECTIONS } from '@/lib/constants';

interface PageProps {
  params: Promise<{
    section: string;
    slug: string[];
  }>;
}

export default async function Page({ params }: PageProps) {
  const { section, slug } = await params;

  // Validate section
  if (!NAVIGATION_SECTIONS.includes(section as typeof NAVIGATION_SECTIONS[number])) {
    notFound();
  }

  // Build full slug path
  const fullSlug = `${section}/${slug.join('/')}`;

  // Load document
  const document = await getDocumentBySlug(fullSlug);

  if (!document) {
    notFound();
  }

  return <DocumentPage document={document} section={section} />;
}

export async function generateStaticParams() {
  const params: { section: string; slug: string[] }[] = [];

  for (const [section, items] of Object.entries(STATIC_NAVIGATION)) {
    function extractPaths(navItems: Array<{ path: string; title: string; children?: Array<{ path: string; title: string; children?: unknown }> }>) {
      for (const item of navItems) {
        // Skip FAQ as it has its own dedicated route
        if (item.path === '/faq') {
          continue;
        }

        // Extract slug from path (remove leading slash and section)
        const pathParts = item.path.split('/').filter(Boolean);
        const slug = pathParts.slice(1); // Remove section part

        if (slug.length > 0) {
          params.push({
            section,
            slug,
          });
        }

        if (item.children) {
          extractPaths(item.children);
        }
      }
    }

    extractPaths(items);
  }

  return params;
}