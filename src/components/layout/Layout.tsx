import type { ReactNode } from 'react';
import { useEffect } from 'react';
import { Header } from './Header';

// ─── Layout Wrapper ───────────────────────────────────────────────────────────

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  // Apply dark mode class on initial load (before Header mounts)
  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark') {
      document.documentElement.classList.add('dark');
    }
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-muted-light">
      <Header />
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-10">
        {children}
      </main>
      <footer className="border-t border-border bg-white py-4">
        <div className="max-w-5xl mx-auto px-6 flex items-center justify-between">
          <p className="text-xs text-muted">
            SHORT/URL &mdash; Built with Spring Boot &amp; React.
          </p>
          <p className="text-xs text-muted/60">v1.0</p>
        </div>
      </footer>
    </div>
  );
}

