// Simple test to verify markdown files exist and can be read
const fs = require('fs');
const path = require('path');

function testMarkdownFiles() {
  try {
    console.log('Testing markdown files...');
    
    const docsDir = path.join(__dirname, 'docs');
    
    // Check if docs directory exists
    if (!fs.existsSync(docsDir)) {
      console.log('Docs directory does not exist');
      return;
    }
    
    // Recursively find all markdown files
    function findMarkdownFiles(dir) {
      const files = [];
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const fullPath = path.join(dir, item);
        const stat = fs.statSync(fullPath);
        
        if (stat.isDirectory()) {
          files.push(...findMarkdownFiles(fullPath));
        } else if (item.endsWith('.md')) {
          files.push(fullPath);
        }
      }
      
      return files;
    }
    
    const markdownFiles = findMarkdownFiles(docsDir);
    console.log(`Found ${markdownFiles.length} markdown files:`);
    
    markdownFiles.forEach(file => {
      const relativePath = path.relative(docsDir, file);
      console.log(`  - ${relativePath}`);
      
      // Test reading the file
      const content = fs.readFileSync(file, 'utf8');
      console.log(`    Content length: ${content.length} characters`);
    });
    
    console.log('Markdown files test completed successfully!');
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testMarkdownFiles();