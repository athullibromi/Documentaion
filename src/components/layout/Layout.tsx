'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Header from './Header';
import Sidebar from './Sidebar';
import Footer from './Footer';
import { NavigationSection, NAVIGATION_SECTIONS } from '@/lib/constants';

interface LayoutProps {
  children: React.ReactNode;
  initialSection?: NavigationSection;
}

export default function Layout({ children, initialSection = 'quick-links' }: LayoutProps) {
  const pathname = usePathname();
  const [activeSection, setActiveSection] = useState<NavigationSection>(initialSection);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Update active section based on current pathname
  useEffect(() => {
    const pathSegments = pathname.split('/').filter(Boolean);
    if (pathSegments.length > 0) {
      const currentSection = pathSegments[0];
      if (NAVIGATION_SECTIONS.includes(currentSection as NavigationSection)) {
        setActiveSection(currentSection as NavigationSection);
      }
    } else {
      // Default to quick-links for home page
      setActiveSection('quick-links');
    }
  }, [pathname]);

  const handleSectionChange = (section: NavigationSection) => {
    setActiveSection(section);
    setIsSidebarOpen(false);
  };

  const handleSidebarToggle = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleSidebarClose = () => {
    setIsSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header
        activeSection={activeSection}
        onSectionChange={handleSectionChange}
      />

      {/* Main layout container */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Desktop Sidebar */}
        <aside className="hidden md:flex md:flex-shrink-0 md:w-64">
          <div className="w-full">
            <Sidebar
              activeSection={activeSection}
              isOpen={true}
              onClose={handleSidebarClose}
            />
          </div>
        </aside>

        {/* Mobile sidebar overlay */}
        <div className="md:hidden">
          <Sidebar
            activeSection={activeSection}
            isOpen={isSidebarOpen}
            onClose={handleSidebarClose}
          />
        </div>

        {/* Main content area */}
        <main className="flex-1 flex flex-col min-w-0 bg-white">
          {/* Mobile navigation toggle */}
          <div className="md:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 sm:px-6 py-3 shadow-sm">
            <div className="flex items-center justify-between">
              <button
                onClick={handleSidebarToggle}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                aria-label="Open navigation menu"
              >
                <svg
                  className="h-5 w-5 mr-2"
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
                Menu
              </button>
              
              <div className="text-sm text-gray-600 font-medium">
                {activeSection.charAt(0).toUpperCase() + activeSection.slice(1).replace('-', ' ')}
              </div>
            </div>
          </div>

          {/* Content wrapper */}
          <div className="flex-1 overflow-y-auto">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8 lg:py-12">
              <div className="text-gray-900">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}