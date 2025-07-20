import { notFound } from 'next/navigation';
import { getDocumentBySlug } from '@/lib/content-loader';
import DocumentPage from '@/components/content/DocumentPage';

export default async function FAQPage() {
  // Load the FAQ document
  const document = await getDocumentBySlug('faq/index');

  if (!document) {
    notFound();
  }

  return <DocumentPage document={document} section="faq" />;
}