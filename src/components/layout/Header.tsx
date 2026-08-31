import { useState, useEffect } from 'react';

// ─── Header Component ─────────────────────────────────────────────────────────

function useDarkMode() {
  const [dark, setDark] = useState(() => {
    return localStorage.getItem('theme') === 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (dark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [dark]);

  return { dark, toggle: () => setDark((v) => !v) };
}

export function Header() {
  const { dark, toggle } = useDarkMode();

  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Logo / Wordmark */}
        <a
          href="/"
          className="text-sm font-bold tracking-tight text-accent no-underline hover:no-underline"
        >
          SHORT<span className="text-accent-blue">/</span>URL
        </a>

        {/* Nav */}
        <nav className="flex items-center gap-5">
          <a
            href="#history"
            className="hidden sm:inline text-xs font-medium text-muted hover:text-accent transition-colors no-underline"
          >
            History
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline text-xs font-medium text-muted hover:text-accent transition-colors no-underline"
          >
            Docs
          </a>
          <button
            onClick={toggle}
            className="text-xs font-medium text-muted hover:text-accent border border-border rounded px-2.5 py-1 transition-colors cursor-pointer"
            title="Toggle dark mode"
          >
            {dark ? 'Light' : 'Dark'}
          </button>
        </nav>
      </div>
    </header>
  );
}

