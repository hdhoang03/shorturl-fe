// ─── Header Component ─────────────────────────────────────────────────────────

export function Header() {
  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        {/* Logo / Wordmark */}
        <a
          href="/"
          className="text-sm font-bold tracking-tight text-accent no-underline hover:no-underline"
        >
          SHORT<span className="text-accent-blue">URL</span>
        </a>

        {/* Nav */}
        <nav className="flex items-center gap-6">
          <a
            href="#history"
            className="text-xs font-medium text-muted hover:text-accent transition-colors no-underline"
          >
            History
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-medium text-muted hover:text-accent transition-colors no-underline"
          >
            Docs
          </a>
        </nav>
      </div>
    </header>
  );
}
