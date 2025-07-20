'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { NavigationItem } from '@/types';
import { NavigationSection, SECTION_LABELS } from '@/lib/constants';
import { STATIC_NAVIGATION } from '@/lib/navigation';

interface SidebarProps {
  activeSection: NavigationSection;
  isOpen: boolean;
  onClose: () => void;
}

interface NavigationTreeProps {
  items: NavigationItem[];
  currentPath: string;
  level?: number;
  onLinkClick?: () => void;
}

function NavigationTree({ items, currentPath, level = 0, onLinkClick }: NavigationTreeProps) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());

  useEffect(() => {
    // Auto-expand items that contain the current path
    const newExpanded = new Set<string>();
    items.forEach((item) => {
      if (item.children && item.children.some(child => currentPath.startsWith(child.path))) {
        newExpanded.add(item.path);
      }
    });
    setExpandedItems(newExpanded);
  }, [currentPath, items]);

  const toggleExpanded = (path: string) => {
    const newExpanded = new Set(expandedItems);
    if (newExpanded.has(path)) {
      newExpanded.delete(path);
    } else {
      newExpanded.add(path);
    }
    setExpandedItems(newExpanded);
  };

  return (
    <ul className={`space-y-1 ${level > 0 ? 'ml-3 sm:ml-4 mt-2' : ''}`}>
      {items.map((item) => {
        const isActive = currentPath === item.path;
        const isExpanded = expandedItems.has(item.path);
        const hasChildren = item.children && item.children.length > 0;

        return (
          <li key={item.path}>
            <div className="flex items-center">
              <Link
                href={item.path}
                onClick={onLinkClick}
                className={`flex-1 block px-3 py-2.5 sm:py-2 text-sm font-medium rounded-md transition-colors duration-200 ${isActive
                  ? 'bg-blue-100 text-blue-700 border-r-2 border-blue-500'
                  : 'text-gray-700 hover:text-gray-900 hover:bg-gray-50'
                  }`}
              >
                <span className="truncate">{item.title}</span>
              </Link>
              {hasChildren && (
                <button
                  onClick={() => toggleExpanded(item.path)}
                  className="p-2 ml-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
                  aria-label={`${isExpanded ? 'Collapse' : 'Expand'} ${item.title}`}
                >
                  <svg
                    className={`h-4 w-4 transform transition-transform duration-200 ${isExpanded ? 'rotate-90' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>
            {hasChildren && isExpanded && (
              <NavigationTree
                items={item.children!}
                currentPath={currentPath}
                level={level + 1}
                onLinkClick={onLinkClick}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
}

export default function Sidebar({ activeSection, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const navigationItems = STATIC_NAVIGATION[activeSection] || [];

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 md:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 sm:w-80 md:w-64 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
      >
        <div className="flex flex-col h-full">
          {/* Mobile sidebar header */}
          <div className="flex items-center justify-between px-4 py-3 sm:py-4 border-b border-gray-200 md:hidden">
            <h2 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              {SECTION_LABELS[activeSection]}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-md transition-colors duration-200"
              aria-label="Close sidebar"
            >
              <svg className="h-5 w-5 sm:h-6 sm:w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Desktop header */}
          <div className="hidden md:block px-4 py-3 xl:py-4 border-b border-gray-200">
            <h2 className="text-base xl:text-lg font-semibold text-gray-900 truncate">
              {SECTION_LABELS[activeSection]}
            </h2>
          </div>

          {/* Navigation content */}
          <div className="flex-1 overflow-y-auto px-3 sm:px-4 py-3 sm:py-4">
            {navigationItems.length > 0 ? (
              <NavigationTree items={navigationItems} currentPath={pathname} onLinkClick={onClose} />
            ) : (
              <div className="text-sm text-gray-500 text-center py-8 px-4">
                <div className="mb-2">
                  <svg className="mx-auto h-8 w-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <p>No content available for this section yet.</p>
              </div>
            )}
          </div>

          {/* Sidebar footer */}
          <div className="px-3 sm:px-4 py-3 sm:py-4 border-t border-gray-200 bg-gray-50">
            <div className="text-xs sm:text-sm text-gray-500">
              <p className="mb-1 font-medium">Need help?</p>
              <Link
                href="/support"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-200 rounded px-1 py-0.5 -mx-1"
              >
                Contact Support
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}