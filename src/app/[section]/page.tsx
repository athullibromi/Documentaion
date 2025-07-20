import { notFound } from 'next/navigation';
import { loadDocumentsBySection } from '@/lib/content-loader';
import { STATIC_NAVIGATION } from '@/lib/navigation';
import { NAVIGATION_SECTIONS, SECTION_LABELS } from '@/lib/constants';
import Link from 'next/link';

interface SectionPageProps {
  params: Promise<{
    section: string;
  }>;
}

export default async function SectionPage({ params }: SectionPageProps) {
  const { section } = await params;
  
  // Validate section
  if (!NAVIGATION_SECTIONS.includes(section as typeof NAVIGATION_SECTIONS[number])) {
    notFound();
  }

  const sectionLabel = SECTION_LABELS[section as keyof typeof SECTION_LABELS] || section;
  const documents = await loadDocumentsBySection(section);
  const sectionNav = STATIC_NAVIGATION[section] || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <Link href="/" className="hover:text-gray-900 transition-colors">
          Home
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-medium">{sectionLabel}</span>
      </nav>

      {/* Section header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          {sectionLabel}
        </h1>
        <p className="text-lg text-gray-600">
          Browse all documentation in the {sectionLabel.toLowerCase()} section.
        </p>
      </div>

      {/* Document list */}
      {documents.length > 0 ? (
        <div className="space-y-6">
          {documents.map((document) => (
            <Link
              key={document.slug}
              href={`/${document.slug}`}
              className="block p-6 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-md transition-all duration-200"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {document.meta.title}
              </h3>
              {document.meta.description && (
                <p className="text-gray-600 mb-3">
                  {document.meta.description}
                </p>
              )}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-gray-500">
                  <span>
                    Updated: {document.meta.lastUpdated.toLocaleDateString()}
                  </span>
                  {document.meta.tags.length > 0 && (
                    <div className="flex gap-1">
                      {document.meta.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                      {document.meta.tags.length > 3 && (
                        <span className="text-gray-500 text-xs">
                          +{document.meta.tags.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>
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
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <svg
              className="h-6 w-6 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No documents yet
          </h3>
          <p className="text-gray-600">
            Documentation for this section is coming soon.
          </p>
        </div>
      )}

      {/* Navigation overview */}
      {sectionNav.length > 0 && (
        <div className="mt-12 pt-8 border-t border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Navigation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {sectionNav.map((item) => (
              <Link
                key={item.path}
                href={item.path}
                className="flex items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <span className="font-medium text-gray-900">{item.title}</span>
                {item.children && item.children.length > 0 && (
                  <span className="ml-auto text-sm text-gray-500">
                    {item.children.length} items
                  </span>
                )}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export async function generateStaticParams() {
  return NAVIGATION_SECTIONS.map((section) => ({
    section,
  }));
}