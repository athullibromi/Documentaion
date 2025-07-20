'use client';

import { ThemeProvider } from '@/contexts/ThemeContext';

interface ClientProvidersProps {
  children: React.ReactNode;
}

export default function ClientProviders({ children }: ClientProvidersProps) {
  return (
    <ThemeProvider>
      {children}
    </ThemeProvider>
  );
}