import '@testing-library/jest-dom'

// Mock Prism.js to avoid issues in test environment
jest.mock('prismjs', () => ({
  highlight: jest.fn((code) => code),
  languages: {
    javascript: {},
    typescript: {},
    css: {},
    json: {},
    bash: {},
    python: {},
    plaintext: {},
  },
}));

// Mock Prism.js components
jest.mock('prismjs/components/prism-core', () => {});
jest.mock('prismjs/components/prism-clike', () => {});
jest.mock('prismjs/components/prism-javascript', () => {});
jest.mock('prismjs/components/prism-typescript', () => {});
jest.mock('prismjs/components/prism-jsx', () => {});
jest.mock('prismjs/components/prism-tsx', () => {});
jest.mock('prismjs/components/prism-css', () => {});
jest.mock('prismjs/components/prism-scss', () => {});
jest.mock('prismjs/components/prism-json', () => {});
jest.mock('prismjs/components/prism-bash', () => {});
jest.mock('prismjs/components/prism-shell-session', () => {});
jest.mock('prismjs/components/prism-python', () => {});
jest.mock('prismjs/components/prism-java', () => {});
jest.mock('prismjs/components/prism-php', () => {});
jest.mock('prismjs/components/prism-sql', () => {});
jest.mock('prismjs/components/prism-yaml', () => {});
jest.mock('prismjs/components/prism-markdown', () => {});
jest.mock('prismjs/components/prism-markup', () => {});
jest.mock('prismjs/components/prism-xml-doc', () => {});