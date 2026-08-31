import type { PaletteName, Relic } from "@/lib/relics/types";
import { isRare } from "@/lib/relics/generate";
import { cn } from "@/lib/utils";

export const paletteVar = (p: PaletteName) => `var(--relic-${p})`;

/** Small hand-drawn-ish object illustrations, one per relic kind. */
export function RelicArt({
  relic,
  className,
}: {
  relic: Relic;
  className?: string;
}) {
  const c = paletteVar(relic.palette);
  const rare = isRare(relic.rarity);

  const shell = (children: React.ReactNode, extra?: string) => (
    <div className={cn("relative", className, extra)}>
      {rare && (
        <span
          aria-hidden
          className="pointer-events-none absolute -inset-2 rounded-2xl opacity-70 animate-shimmer"
          style={{
            background:
              "linear-gradient(110deg, transparent 35%, oklch(1 0 0 / 0.55) 50%, transparent 65%)",
            backgroundSize: "200% 100%",
          }}
        />
      )}
      {children}
    </div>
  );

  switch (relic.kind) {
    case "drink-can":
      return shell(
        <div
          className="mx-auto flex h-full w-[52%] flex-col items-center justify-between rounded-[14px] border-[1.5px] border-foreground px-1 py-1.5 text-center"
          style={{ background: `color-mix(in oklab, ${c} 22%, var(--card))` }}
        >
          <span className="h-1.5 w-8 rounded-full bg-foreground/25" />
          <span
            className="w-full py-1 font-mono text-[7px] leading-tight tracking-tight"
            style={{ background: c, color: "var(--card)" }}
          >
            {relic.title.replace("™", "").slice(0, 12)}
          </span>
          <span className="text-[10px]">{relic.motif}</span>
          <span className="h-1 w-6 rounded-full bg-foreground/20" />
        </div>,
      );

    case "motel-key":
      return shell(
        <div className="flex h-full flex-col items-center">
          <span className="h-3 w-[1.5px] bg-foreground/50" />
          <div
            className="flex w-[78%] flex-1 flex-col items-center justify-center rounded-[10px] border-[1.5px] border-foreground px-1 text-center"
            style={{ background: `color-mix(in oklab, ${c} 30%, var(--card))` }}
          >
            <span className="font-mono text-[7px] uppercase leading-none opacity-70">
              room
            </span>
            <span className="font-display text-base leading-tight">
              {relic.subtitle.replace("Room ", "")}
            </span>
          </div>
          <span className="mt-0.5 text-[11px]">🔑</span>
        </div>,
        "animate-sway origin-top",
      );

    case "postcard":
      return shell(
        <div
          className="flex h-full w-full -rotate-2 flex-col justify-between rounded-[8px] border-[1.5px] border-foreground p-1"
          style={{ background: `color-mix(in oklab, ${c} 16%, var(--card))` }}
        >
          <div className="flex items-start justify-between">
            <span className="text-[13px]">{relic.motif}</span>
            <span className="rounded-[2px] border border-dashed border-foreground/50 px-1 font-mono text-[6px]">
              ✦
            </span>
          </div>
          <div className="space-y-[2px]">
            <span className="block h-[1.5px] w-3/4 bg-foreground/25" />
            <span className="block h-[1.5px] w-1/2 bg-foreground/20" />
          </div>
        </div>,
      );

    case "fortune-ticket":
      return shell(
        <div
          className="perforated flex h-full w-full rotate-1 items-center justify-between gap-1 rounded-[6px] border-[1.5px] border-foreground px-2"
          style={{ background: `color-mix(in oklab, ${c} 14%, var(--card))` }}
        >
          <span className="font-mono text-[7px] tracking-widest opacity-70">
            {relic.serial}
          </span>
          <span className="text-[13px]">{relic.motif}</span>
        </div>,
      );

    default:
      return shell(
        <div
          className="flex h-full w-full flex-col items-center justify-center gap-0.5 rounded-[6px] border-[1.5px] border-foreground"
          style={{ background: `color-mix(in oklab, ${c} 14%, var(--card))` }}
        >
          <span className="text-lg">{relic.motif}</span>
          <span className="font-mono text-[6px] tracking-[0.18em] opacity-60">
            {relic.serial}
          </span>
        </div>,
      );
  }
}
