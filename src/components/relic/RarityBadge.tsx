import { isRare } from "@/lib/relics/generate";
import type { Rarity } from "@/lib/relics/types";
import { cn } from "@/lib/utils";

export function RarityBadge({
  rarity,
  className,
}: {
  rarity: Rarity;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border border-foreground/70 px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.14em]",
        isRare(rarity) ? "bg-accent" : "bg-muted",
        className,
      )}
    >
      {isRare(rarity) && <span aria-hidden>✦</span>}
      {rarity}
    </span>
  );
}
