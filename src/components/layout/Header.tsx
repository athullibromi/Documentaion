'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { NAVIGATION_SECTIONS, SECTION_LABELS, SITE_CONFIG, type NavigationSection } from '@/lib/constants';
import SearchInput from '@/components/search/SearchInput';

interface HeaderProps {
  activeSection?: NavigationSection;
  onSectionChange?: (section: NavigationSection) => void;
}

export default function Header({ activeSection, onSectionChange }: HeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const router = useRouter();

  const handleSectionClick = (section: NavigationSection) => {
    onSectionChange?.(section);
    setIsMenuOpen(false);
    router.push(`/${section}`);
  };

  const handleMobileSearchClick = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top section with logo and search */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center">
              <div className="h-8 w-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">D</span>
              </div>
              <span className="ml-2 text-xl font-semibold text-gray-900">
                {SITE_CONFIG.name}
              </span>
            </Link>
          </div>

          {/* Search bar - hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <SearchInput className="w-full" />
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMenuOpen ? (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              ) : (
                <svg
                  className="block h-6 w-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Section tabs - desktop */}
        <div className="hidden md:block">
          <nav className="flex space-x-8" aria-label="Tabs">
            {NAVIGATION_SECTIONS.map((section) => (
              <button
                key={section}
                onClick={() => handleSectionClick(section)}
                className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${activeSection === section
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
              >
                {SECTION_LABELS[section]}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
            {/* Mobile search */}
            <div className="px-3 py-2">
              <SearchInput onResultClick={handleMobileSearchClick} />
            </div>

            {/* Mobile navigation sections */}
            {NAVIGATION_SECTIONS.map((section) => (
              <button
                key={section}
                onClick={() => handleSectionClick(section)}
                className={`block px-3 py-2 text-base font-medium w-full text-left transition-colors duration-200 ${activeSection === section
                  ? 'text-blue-600 bg-blue-50'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                  }`}
              >
                {SECTION_LABELS[section]}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}