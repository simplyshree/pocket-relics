import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { PressButton } from "@/components/PressButton";
import { RelicArt } from "@/components/relic/RelicArt";
import { RelicCard } from "@/components/relic/RelicCard";
import { RarityBadge } from "@/components/relic/RarityBadge";
import { useRelicState, type DisplayMode } from "@/lib/relics/storage";
import { SETS } from "@/lib/relics/generate";
import type { Relic } from "@/lib/relics/types";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/cabinet")({
  head: () => ({
    meta: [
      { title: "The Little Museum — your Pocket Relics cabinet" },
      {
        name: "description",
        content:
          "Every relic you've kept, on shelves, hooks and pinboards. Dates, choices, rarities and very small descriptions.",
      },
      { property: "og:title", content: "The Little Museum" },
      {
        property: "og:description",
        content: "a personal curiosity cabinet of tiny souvenirs.",
      },
    ],
  }),
  component: Cabinet,
});

const MODES: { id: DisplayMode; label: string }[] = [
  { id: "cabinet", label: "cabinet" },
  { id: "scrapbook", label: "scrapbook" },
  { id: "wall", label: "bedroom wall" },
  { id: "desk", label: "desk" },
  { id: "board", label: "postcard board" },
];

function Cabinet() {
  const { relics, display, setDisplay, toggleFavorite, ready } = useRelicState();
  const [open, setOpen] = useState<Relic | null>(null);

  const favorites = relics.filter((r) => r.favorite);
  const setProgress = useMemo(() => {
    const counts = new Map<string, number>();
    relics.forEach((r) => r.set && counts.set(r.set, (counts.get(r.set) ?? 0) + 1));
    return SETS.map((s) => ({ name: s, count: counts.get(s) ?? 0 }));
  }, [relics]);

  const shelfClasses: Record<DisplayMode, string> = {
    cabinet: "grid grid-cols-3 gap-x-3 gap-y-8",
    scrapbook: "grid grid-cols-2 gap-5",
    wall: "grid grid-cols-4 gap-4",
    desk: "flex flex-wrap items-end gap-5",
    board: "columns-2 gap-4 [&>*]:mb-4",
  };

  return (
    <main className="flex-1">
      <SiteHeader subtitle="the little museum" />

      <div className="mb-4 flex gap-2 overflow-x-auto pb-1">
        {MODES.map((m) => (
          <button
            key={m.id}
            onClick={() => setDisplay(m.id)}
            className={cn(
              "shrink-0 rounded-full border px-3 py-1.5 font-mono text-[11px]",
              display === m.id
                ? "border-foreground bg-accent"
                : "border-foreground/30 bg-card",
            )}
          >
            {m.label}
          </button>
        ))}
      </div>

      {ready && relics.length === 0 && (
        <div className="card-paper p-8 text-center">
          <p className="text-4xl">🗄</p>
          <p className="mt-3 font-display text-xl">your shelves are suspiciously empty</p>
          <p className="mt-1 text-sm text-muted-foreground">
            go find one small thing. it takes thirty seconds.
          </p>
          <Link to="/" className="mt-5 block">
            <PressButton tone="primary" className="w-full">
              FIND SOMETHING
            </PressButton>
          </Link>
        </div>
      )}

      {favorites.length > 0 && (
        <section className="mb-6">
          <p className="label-caps mb-2">things I would save in a fire</p>
          <div className="card-paper flex gap-4 overflow-x-auto p-4">
            {favorites.map((r) => (
              <button key={r.id} onClick={() => setOpen(r)} className="h-20 w-14 shrink-0">
                <RelicArt relic={r} className="h-full w-full" />
              </button>
            ))}
          </div>
        </section>
      )}

      {relics.length > 0 && (
        <section
          className={cn(
            "card-paper p-5",
            display === "wall" && "bg-secondary",
            display === "desk" && "bg-muted",
          )}
        >
          <p className="label-caps mb-4">
            {relics.length} relics · shelf view: {display}
          </p>
          <div className={shelfClasses[display]}>
            {relics.map((r) => (
              <button
                key={r.id}
                onClick={() => setOpen(r)}
                className={cn(
                  "group relative flex flex-col items-center break-inside-avoid text-center",
                  display === "scrapbook" && "rotate-[-1.5deg]",
                  display === "board" && "rotate-1",
                )}
              >
                {display === "board" && (
                  <span className="absolute -top-2 z-10 text-xs">📌</span>
                )}
                <div className="h-24 w-16 transition-transform group-hover:-translate-y-1">
                  <RelicArt relic={r} className="h-full w-full" />
                </div>
                {display !== "wall" && (
                  <span className="mt-1 w-full border-t border-foreground/20 pt-1 font-mono text-[8px] leading-tight">
                    {r.title.slice(0, 22)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </section>
      )}

      {relics.length > 0 && (
        <section className="mt-6">
          <p className="label-caps mb-2">sets</p>
          <div className="grid gap-2">
            {setProgress
              .filter((s) => s.count > 0)
              .map((s) => (
                <div
                  key={s.name}
                  className="card-paper flex items-center justify-between px-4 py-2"
                >
                  <span className="text-sm">{s.name}</span>
                  <span className="label-caps">
                    {s.count >= 5 ? "✦ you have been places" : `${s.count}/5`}
                  </span>
                </div>
              ))}
          </div>
        </section>
      )}

      <div className="mt-8 flex justify-between">
        <Link to="/" className="label-caps underline-offset-4 hover:underline">
          ← another encounter
        </Link>
        <Link to="/stats" className="label-caps underline-offset-4 hover:underline">
          statistics →
        </Link>
      </div>

      <Dialog open={!!open} onOpenChange={(v) => !v && setOpen(null)}>
        <DialogContent className="max-w-md border-none bg-transparent p-0 shadow-none">
          {open && (
            <div>
              <RelicCard relic={open} />
              <div className="mt-3 flex items-center justify-between gap-3">
                <span className="label-caps">
                  collected{" "}
                  {new Date(open.collectedAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
                <button
                  onClick={() => {
                    toggleFavorite(open.id);
                    setOpen({ ...open, favorite: !open.favorite });
                  }}
                  className="rounded-full border border-foreground/40 bg-card px-3 py-1.5 text-xs"
                >
                  {open.favorite ? "♥ saved in a fire" : "♡ save in a fire"}
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <RarityBadge rarity={open.rarity} />
                {open.choices.map((c, i) => (
                  <span
                    key={`${c}-${i}`}
                    className="label-caps rounded-full border border-dashed border-foreground/40 bg-card px-2 py-0.5"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
}
