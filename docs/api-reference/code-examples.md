---
title: "Code Examples"
description: "Examples of code blocks with syntax highlighting"
category: "api-reference"
order: 2
tags: ["examples", "code", "syntax"]
---

# Code Examples

This page demonstrates various code block examples with syntax highlighting.

## JavaScript Example

```javascript
// Example JavaScript function
function greetUser(name) {
  if (!name) {
    throw new Error('Name is required');
  }
  
  return `Hello, ${name}! Welcome to our documentation.`;
}

// Usage
const message = greetUser('Developer');
console.log(message);
```

## TypeScript with Interface

```typescript
interface User {
  id: number;
  name: string;
  email: string;
  isActive: boolean;
}

class UserService {
  private users: User[] = [];
  
  addUser(user: Omit<User, 'id'>): User {
    const newUser: User = {
      id: this.users.length + 1,
      ...user
    };
    
    this.users.push(newUser);
    return newUser;
  }
  
  findUserById(id: number): User | undefined {
    return this.users.find(user => user.id === id);
  }
}
```

## JSON Configuration

```json
{
  "name": "documentation-website",
  "version": "1.0.0",
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.0.0",
    "prismjs": "^1.30.0"
  }
}
```

## CSS Styling

```css
.code-block {
  position: relative;
  margin: 1rem 0;
  border-radius: 0.5rem;
  overflow: hidden;
}

.code-block pre {
  background: #1f2937;
  color: #f3f4f6;
  padding: 1rem;
  overflow-x: auto;
}

.copy-button {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  cursor: pointer;
}
```

## Shell Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

## Python Example

```python
class DocumentationSite:
    def __init__(self, title, description):
        self.title = title
        self.description = description
        self.pages = []
    
    def add_page(self, page):
        """Add a new page to the documentation site"""
        if not isinstance(page, dict):
            raise ValueError("Page must be a dictionary")
        
        required_fields = ['title', 'content', 'slug']
        for field in required_fields:
            if field not in page:
                raise ValueError(f"Page must have '{field}' field")
        
        self.pages.append(page)
        return len(self.pages)
    
    def get_page_by_slug(self, slug):
        """Retrieve a page by its slug"""
        for page in self.pages:
            if page['slug'] == slug:
                return page
        return None

# Usage example
site = DocumentationSite("My Docs", "Comprehensive documentation")
site.add_page({
    'title': 'Getting Started',
    'content': 'Welcome to our documentation...',
    'slug': 'getting-started'
})
```

## Plain Text

```
This is a plain text code block without syntax highlighting.
It should still have the copy functionality and proper styling.

You can use this for:
- Configuration files without specific syntax
- Plain text examples
- ASCII art or diagrams
```