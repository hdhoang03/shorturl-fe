import type { ReactNode } from 'react';
import { Header } from './Header';

// ─── Layout Wrapper ───────────────────────────────────────────────────────────

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col bg-muted-light">
      <Header />
      <main className="flex-1 max-w-5xl w-full mx-auto px-6 py-10">
        {children}
      </main>
      <footer className="border-t border-border bg-white py-4">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-xs text-muted">
            ShortURL &mdash; Built with Spring Boot &amp; React.
          </p>
        </div>
      </footer>
    </div>
  );
}
