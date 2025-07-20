// Site-wide constants and configuration

export const SITE_CONFIG = {
  name: 'Documentation',
  description: 'Comprehensive documentation and guides for our software platform',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
} as const;

export const NAVIGATION_SECTIONS = [
  'quick-links',
  'panel-overview',
  'chatbot',
  'api-reference',
  'tutorials',
  'troubleshooting',
  'faq',
] as const;

export const SECTION_LABELS = {
  'quick-links': 'Quick Links',
  'panel-overview': 'Panel Overview',
  'chatbot': 'Chatbot',
  'api-reference': 'API Reference',
  'tutorials': 'Tutorials',
  'troubleshooting': 'Troubleshooting',
  'faq': 'FAQ',
} as const;

export type NavigationSection = typeof NAVIGATION_SECTIONS[number];