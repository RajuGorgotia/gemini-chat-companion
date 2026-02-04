import { Link } from "react-router-dom";

export function Header() {
  return (
    <header className="h-14 border-b border-border bg-card flex items-center px-4 gap-6 shrink-0">
      {/* Morgan Stanley Logo */}
      <Link to="/" className="flex items-center gap-2 shrink-0">
        <div className="flex items-center justify-center">
          <svg
            viewBox="0 0 100 24"
            className="h-6 w-auto text-foreground"
            fill="currentColor"
          >
            <text
              x="0"
              y="18"
              fontFamily="Space Grotesk, sans-serif"
              fontSize="12"
              fontWeight="600"
            >
              JPMogranChase
            </text>
          </svg>
        </div>
      </Link>

      {/* Divider */}
      <div className="h-6 w-px bg-border" />

      {/* Smart Proxy Logo & Name */}
      <Link to="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
          <svg
            viewBox="0 0 24 24"
            className="h-5 w-5 text-primary-foreground"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M12 2L2 7l10 5 10-5-10-5z" />
            <path d="M2 17l10 5 10-5" />
            <path d="M2 12l10 5 10-5" />
          </svg>
        </div>
        <span className="font-display font-semibold text-lg text-foreground">
          RDAAS
        </span>
      </Link>

      {/* Spacer */}
      <div className="flex-1" />
    </header>
  );
}
