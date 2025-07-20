'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Load theme from localStorage on mount
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('theme') as Theme;
      if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
        setTheme(savedTheme);
      }
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;

    // Save theme to localStorage
    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
    }

    // Determine resolved theme
    let resolved: 'light' | 'dark' = 'light';
    
    if (theme === 'system' && typeof window !== 'undefined') {
      resolved = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } else if (theme !== 'system') {
      resolved = theme;
    }

    setResolvedTheme(resolved);

    // Apply theme to document
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      root.classList.remove('light', 'dark');
      root.classList.add(resolved);
      
      // Update CSS variables
      if (resolved === 'dark') {
        root.style.setProperty('--background', '#0a0a0a');
        root.style.setProperty('--foreground', '#ededed');
      } else {
        root.style.setProperty('--background', '#ffffff');
        root.style.setProperty('--foreground', '#171717');
      }
    }
  }, [theme, mounted]);

  // Listen for system theme changes
  useEffect(() => {
    if (!mounted || theme !== 'system' || typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      const resolved = mediaQuery.matches ? 'dark' : 'light';
      setResolvedTheme(resolved);
      
      if (typeof document !== 'undefined') {
        const root = document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(resolved);
        
        if (resolved === 'dark') {
          root.style.setProperty('--background', '#0a0a0a');
          root.style.setProperty('--foreground', '#ededed');
        } else {
          root.style.setProperty('--background', '#ffffff');
          root.style.setProperty('--foreground', '#171717');
        }
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme, mounted]);

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return <div className="min-h-screen bg-white">{children}</div>;
  }

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}