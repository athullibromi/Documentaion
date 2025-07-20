# Documentation Website

A comprehensive documentation website built with Next.js, featuring a modern design and powerful search capabilities.

## Features

- 📚 **Comprehensive Documentation**: Organized into sections including Quick Links, Panel Overview, API Reference, Tutorials, and more
- 🔍 **Powerful Search**: Fast, client-side search across all documentation
- 📱 **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- 🎨 **Modern UI**: Clean, professional design with Tailwind CSS
- 🚀 **Fast Performance**: Static site generation with Next.js
- 🤖 **AI Chatbot**: Integrated chatbot for user assistance
- 📊 **Analytics Ready**: Built-in analytics and reporting features

## Documentation Sections

### Quick Links
- Installation guides
- Common tasks
- Getting started resources

### Panel Overview
- Dashboard overview
- Team Inbox management
- Broadcast messaging
- Meta data management
- Contacts and CRM
- Team collaboration
- Analytics and reporting
- Billing and subscriptions
- System settings
- Chatbot configuration
- Account management

### API Reference
- Authentication
- User management endpoints
- Data management APIs
- Webhook integrations

### Tutorials
- Basic setup guides
- Advanced feature tutorials
- Third-party integrations

### Support
- FAQ section
- Troubleshooting guides
- Common issues resolution

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd documentation-website
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
npm start
```

## Deployment

### Vercel (Recommended)

This project is optimized for deployment on Vercel:

1. Push your code to a Git repository (GitHub, GitLab, or Bitbucket)
2. Import your project on [Vercel](https://vercel.com)
3. Vercel will automatically detect the Next.js framework and deploy your site

Alternatively, you can deploy using the Vercel CLI:

```bash
npm install -g vercel
vercel
```

### Other Platforms

The site can also be deployed on:
- Netlify
- AWS Amplify
- GitHub Pages (with static export)
- Any static hosting service

For static export:
```bash
npm run export
```

## Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── [section]/         # Dynamic routes for documentation sections
│   ├── api/               # API routes
│   └── search/            # Search functionality
├── components/            # React components
│   ├── content/           # Content-related components
│   ├── layout/            # Layout components
│   └── search/            # Search components
├── lib/                   # Utility functions and configurations
├── types/                 # TypeScript type definitions
└── contexts/              # React contexts

docs/                      # Documentation content (Markdown files)
├── quick-links/
├── panel-overview/
├── api-reference/
├── tutorials/
├── troubleshooting/
└── faq/
```

## Content Management

### Adding New Documentation

1. Create a new Markdown file in the appropriate `docs/` subdirectory
2. Add frontmatter with metadata:

```markdown
---
title: Page Title
description: Page description
category: section-name
order: 1
tags: [tag1, tag2]
---

# Your Content Here
```

3. The page will automatically appear in the navigation

### Updating Navigation

Navigation is automatically generated from the file structure and frontmatter. To customize navigation, edit:
- `src/lib/navigation.ts` - Static navigation configuration
- `src/lib/constants.ts` - Section labels and configuration

## Customization

### Styling

The site uses Tailwind CSS for styling. Customize the design by:
- Editing `tailwind.config.js`
- Modifying component styles in the `src/components/` directory
- Updating the color scheme in `src/app/globals.css`

### Branding

Update branding elements in:
- `src/lib/constants.ts` - Site configuration
- `src/components/layout/Header.tsx` - Logo and header
- `src/components/layout/Footer.tsx` - Footer content

### Search

The search functionality is powered by a client-side search index. To customize:
- Edit `scripts/build-search-index.js` - Search index generation
- Modify `src/components/search/SearchInput.tsx` - Search UI

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Commit your changes: `git commit -am 'Add some feature'`
5. Push to the branch: `git push origin feature-name`
6. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Check the FAQ section
- Review troubleshooting guides
- Contact support through the documentation site
- Open an issue in the repository

## Performance

The site is optimized for performance with:
- Static site generation
- Image optimization
- Code splitting
- Efficient caching strategies
- Minimal JavaScript bundle size

## SEO

Built-in SEO features include:
- Semantic HTML structure
- Meta tags and Open Graph support
- Sitemap generation
- Structured data markup
- Fast loading times