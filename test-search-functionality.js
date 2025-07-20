// Test script to verify search functionality
const fs = require('fs');
const path = require('path');

// Load the search index
const searchIndexPath = path.join(__dirname, 'public', 'search-index.json');

if (!fs.existsSync(searchIndexPath)) {
  console.error('Search index not found. Run "npm run build:search" first.');
  process.exit(1);
}

const searchIndex = JSON.parse(fs.readFileSync(searchIndexPath, 'utf8'));

// Simple search function (mimicking the client-side search)
function searchDocuments(documents, query, options = {}) {
  const { limit = 10, threshold = 0.1 } = options;
  
  if (!query.trim()) {
    return [];
  }
  
  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 0);
  const results = [];
  
  for (const document of documents) {
    const matches = [];
    let totalScore = 0;
    
    // Search in title (highest weight)
    const titleMatches = findMatches(document.title.toLowerCase(), searchTerms);
    if (titleMatches.length > 0) {
      matches.push({
        field: 'title',
        text: document.title,
        indices: titleMatches
      });
      totalScore += titleMatches.length * 3;
    }
    
    // Search in content (base weight)
    const contentMatches = findMatches(document.content.toLowerCase(), searchTerms);
    if (contentMatches.length > 0) {
      matches.push({
        field: 'content',
        text: document.content,
        indices: contentMatches
      });
      totalScore += contentMatches.length;
    }
    
    // Calculate final score
    if (matches.length > 0) {
      const normalizedScore = totalScore / (document.content.length / 100) / searchTerms.length;
      
      if (normalizedScore >= threshold) {
        results.push({
          document,
          score: normalizedScore,
          matches
        });
      }
    }
  }
  
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function findMatches(text, searchTerms) {
  const matches = [];
  
  for (const term of searchTerms) {
    let index = 0;
    while ((index = text.indexOf(term, index)) !== -1) {
      matches.push([index, index + term.length]);
      index += term.length;
    }
  }
  
  return matches.sort((a, b) => a[0] - b[0]);
}

// Test search functionality
console.log('Search Functionality Test');
console.log('========================');
console.log(`Loaded ${searchIndex.length} documents\n`);

// Test cases
const testQueries = [
  'authentication',
  'API key',
  'getting started',
  'code examples',
  'javascript',
  'nonexistent term'
];

testQueries.forEach(query => {
  console.log(`Testing query: "${query}"`);
  const results = searchDocuments(searchIndex, query);
  
  if (results.length > 0) {
    console.log(`  Found ${results.length} results:`);
    results.forEach((result, index) => {
      console.log(`    ${index + 1}. ${result.document.title} (score: ${result.score.toFixed(2)})`);
      console.log(`       Category: ${result.document.category}`);
      console.log(`       Path: ${result.document.path}`);
    });
  } else {
    console.log('  No results found');
  }
  console.log();
});

console.log('Search functionality test completed successfully!');