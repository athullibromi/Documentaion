// Simple test script to verify search functionality
const fs = require('fs');
const path = require('path');

// Load the search index
const searchIndexPath = path.join(__dirname, 'public', 'search-index.json');

if (!fs.existsSync(searchIndexPath)) {
  console.error('Search index not found. Run "npm run build:search" first.');
  process.exit(1);
}

const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));

console.log('Search Index Test');
console.log('================');
console.log(`Loaded ${searchIndex.length} documents`);
console.log();

// Test basic structure
console.log('Sample document structure:');
if (searchIndex.length > 0) {
  const sample = searchIndex[0];
  console.log('- ID:', sample.id);
  console.log('- Title:', sample.title);
  console.log('- Category:', sample.category);
  console.log('- Tags:', sample.tags);
  console.log('- Headings count:', sample.headings.length);
  console.log('- Content length:', sample.content.length);
  console.log('- Content preview:', sample.content.substring(0, 100) + '...');
}

console.log();
console.log('All documents:');
searchIndex.forEach((doc, index) => {
  console.log(`${index + 1}. ${doc.title} (${doc.category})`);
});

console.log();
console.log('Search index generation completed successfully!');