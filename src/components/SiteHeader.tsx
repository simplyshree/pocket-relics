import { Link } from "@tanstack/react-router";
import { useRelicState } from "@/lib/relics/storage";

export function SiteHeader({ subtitle }: { subtitle?: string }) {
  const { soundOn, setSound, ready } = useRelicState();

  return (
    <header className="mb-6 flex items-start justify-between gap-3">
      <div>
        <Link to="/" className="font-display text-2xl leading-none tracking-tight">
          POCKET RELICS <span className="text-primary">✦</span>
        </Link>
        {subtitle && (
          <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>
        )}
      </div>
      <button
        onClick={() => setSound(!soundOn)}
        aria-label={soundOn ? "turn sound off" : "turn sound on"}
        className="rounded-full border border-foreground/40 bg-card px-3 py-1.5 font-mono text-[11px]"
      >
        {ready && soundOn ? "🔊 on" : "🔇 off"}
      </button>
    </header>
  );
}
