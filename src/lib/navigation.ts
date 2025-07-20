import { NavigationItem } from '@/types';

// Static navigation configuration
export const STATIC_NAVIGATION: Record<string, NavigationItem[]> = {
  'quick-links': [
    {
      title: 'Getting Started',
      path: '/quick-links/getting-started',
      order: 1,
      category: 'quick-links',
    },
    {
      title: 'Installation',
      path: '/quick-links/installation',
      order: 2,
      category: 'quick-links',
    },
    {
      title: 'Common Tasks',
      path: '/quick-links/common-tasks',
      order: 3,
      category: 'quick-links',
    },
  ],
  'panel-overview': [
    {
      title: 'Dashboard',
      path: '/panel-overview/dashboard',
      order: 1,
      category: 'panel-overview',
    },
    {
      title: 'Team Inbox',
      path: '/panel-overview/team-inbox',
      order: 2,
      category: 'panel-overview',
    },
    {
      title: 'Broadcast',
      path: '/panel-overview/broadcast',
      order: 3,
      category: 'panel-overview',
    },
    {
      title: 'Meta',
      path: '/panel-overview/meta',
      order: 4,
      category: 'panel-overview',
    },
    {
      title: 'Contacts',
      path: '/panel-overview/contacts',
      order: 5,
      category: 'panel-overview',
    },
    {
      title: 'Teams',
      path: '/panel-overview/teams',
      order: 6,
      category: 'panel-overview',
    },
    {
      title: 'Analytics',
      path: '/panel-overview/analytics',
      order: 7,
      category: 'panel-overview',
    },
    {
      title: 'Billing',
      path: '/panel-overview/billing',
      order: 8,
      category: 'panel-overview',
    },
    {
      title: 'Settings',
      path: '/panel-overview/settings',
      order: 9,
      category: 'panel-overview',
    },
    {
      title: 'Chatbot',
      path: '/panel-overview/chatbot',
      order: 10,
      category: 'panel-overview',
    },
    {
      title: 'My Account',
      path: '/panel-overview/my-account',
      order: 11,
      category: 'panel-overview',
    },
    {
      title: 'Features',
      path: '/panel-overview/features',
      order: 12,
      category: 'panel-overview',
    },
    {
      title: 'Navigation',
      path: '/panel-overview/navigation',
      order: 13,
      category: 'panel-overview',
    },
  ],
  'api-reference': [
    {
      title: 'Authentication',
      path: '/api-reference/authentication',
      order: 1,
      category: 'api-reference',
    },
    {
      title: 'Code Examples',
      path: '/api-reference/code-examples',
      order: 2,
      category: 'api-reference',
    },
    {
      title: 'Endpoints',
      path: '/api-reference/endpoints',
      order: 3,
      category: 'api-reference',
      children: [
        {
          title: 'Users API',
          path: '/api-reference/endpoints/users',
          order: 1,
          category: 'api-reference',
        },
        {
          title: 'Data API',
          path: '/api-reference/endpoints/data',
          order: 2,
          category: 'api-reference',
        },
        {
          title: 'Webhooks API',
          path: '/api-reference/endpoints/webhooks',
          order: 3,
          category: 'api-reference',
        },
      ],
    },
  ],
  'tutorials': [
    {
      title: 'Basic Setup',
      path: '/tutorials/basic-setup',
      order: 1,
      category: 'tutorials',
      children: [
        {
          title: 'Installation Tutorial',
          path: '/tutorials/basic-setup/installation',
          order: 1,
          category: 'tutorials',
        },
        {
          title: 'Configuration Guide',
          path: '/tutorials/basic-setup/configuration',
          order: 2,
          category: 'tutorials',
        },
      ],
    },
    {
      title: 'Advanced Features',
      path: '/tutorials/advanced-features',
      order: 2,
      category: 'tutorials',
      children: [
        {
          title: 'Customization Guide',
          path: '/tutorials/advanced-features/customization',
          order: 1,
          category: 'tutorials',
        },
      ],
    },
    {
      title: 'Integrations',
      path: '/tutorials/integrations',
      order: 3,
      category: 'tutorials',
      children: [
        {
          title: 'Third-Party Tools',
          path: '/tutorials/integrations/third-party-tools',
          order: 1,
          category: 'tutorials',
        },
      ],
    },
  ],
  'chatbot': [
    {
      title: 'Overview',
      path: '/chatbot/overview',
      order: 1,
      category: 'chatbot',
    },
  ],
  'troubleshooting': [
    {
      title: 'Common Issues',
      path: '/troubleshooting/common-issues',
      order: 1,
      category: 'troubleshooting',
    },
  ],
  'faq': [
    {
      title: 'Frequently Asked Questions',
      path: '/faq',
      order: 1,
      category: 'faq',
    },
  ],
};

export function getNavigationForSection(section: string): NavigationItem[] {
  return STATIC_NAVIGATION[section] || [];
}