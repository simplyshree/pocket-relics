import type { Relic } from "@/lib/relics/types";
import { RelicArt, paletteVar } from "./RelicArt";
import { RarityBadge } from "./RarityBadge";
import { cn } from "@/lib/utils";

export function RelicCard({
  relic,
  className,
  compact,
}: {
  relic: Relic;
  className?: string;
  compact?: boolean;
}) {
  return (
    <article
      className={cn("card-paper relative overflow-hidden p-5", className)}
      style={{
        background: `linear-gradient(180deg, color-mix(in oklab, ${paletteVar(relic.palette)} 9%, var(--card)), var(--card))`,
      }}
    >
      <span className="tape-strip -top-2 left-1/2 -translate-x-1/2 -rotate-2" aria-hidden />

      <div className="flex items-start gap-4">
        <div className="h-24 w-16 shrink-0">
          <RelicArt relic={relic} className="h-full w-full" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="label-caps">{relic.encounterName}</p>
          <h2 className="mt-1 font-display text-2xl leading-tight">{relic.title}</h2>
          <p className="mt-1 text-sm italic text-muted-foreground">{relic.subtitle}</p>
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <RarityBadge rarity={relic.rarity} />
            {relic.set && (
              <span className="label-caps rounded-full border border-dashed border-foreground/40 px-2 py-0.5">
                {relic.set}
              </span>
            )}
          </div>
        </div>
      </div>

      {!compact && (
        <dl className="mt-5 grid grid-cols-1 gap-x-6 gap-y-2 border-t border-dashed border-foreground/25 pt-4 sm:grid-cols-2">
          {relic.fields.map((f) => (
            <div key={f.label} className="flex flex-col">
              <dt className="label-caps">{f.label}</dt>
              <dd className="text-sm leading-snug">{f.value}</dd>
            </div>
          ))}
        </dl>
      )}

      <p className="mt-4 text-sm text-muted-foreground">{relic.description}</p>

      <div className="mt-4 flex items-center justify-between border-t border-dashed border-foreground/25 pt-3">
        <span className="label-caps">pocket relic #{String(relic.number).padStart(3, "0")}</span>
        <span className="label-caps">{relic.serial}</span>
      </div>
    </article>
  );
}
