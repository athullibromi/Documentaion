import Link from 'next/link';
import { SITE_CONFIG } from '@/lib/constants';

export default function Footer() {
  return (
    <footer className="bg-gray-50 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-4">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                {SITE_CONFIG.name}
              </span>
            </div>
            <p className="text-gray-600 text-sm max-w-md">
              {SITE_CONFIG.description}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/quick-links/installation"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  Installation
                </Link>
              </li>
              <li>
                <Link
                  href="/quick-links/quick-start"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  Quick Start
                </Link>
              </li>
              <li>
                <Link
                  href="/api-reference"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  API Reference
                </Link>
              </li>
              <li>
                <Link
                  href="/tutorials"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-4">
              Support
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/faq"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  href="/troubleshooting"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  Troubleshooting
                </Link>
              </li>
              <li>
                <a
                  href="mailto:support@example.com"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  Contact Support
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/example/docs"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-gray-900 text-sm transition-colors duration-200"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="mt-8 pt-8 border-t border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              © {new Date().getFullYear()} {SITE_CONFIG.name}. All rights reserved.
            </p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <Link
                href="/privacy"
                className="text-gray-500 hover:text-gray-900 text-sm transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms"
                className="text-gray-500 hover:text-gray-900 text-sm transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}