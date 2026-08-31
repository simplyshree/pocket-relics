import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { useRelicState } from "@/lib/relics/storage";
import { isRare } from "@/lib/relics/generate";

export const Route = createFileRoute("/stats")({
  head: () => ({
    meta: [
      { title: "Your Very Important Statistics — Pocket Relics" },
      {
        name: "description",
        content:
          "Frogs encountered, motel rooms survived, objects probably haunted, and other numbers nobody asked for.",
      },
      { property: "og:title", content: "Your Very Important Statistics" },
      {
        property: "og:description",
        content: "numbers about your tiny souvenirs. mostly useless. very important.",
      },
    ],
  }),
  component: Stats,
});

function Stats() {
  const { relics, streak, secretsFound, ready } = useRelicState();

  const stats = useMemo(() => {
    const text = relics
      .map((r) => `${r.title} ${r.subtitle} ${r.description} ${r.fields.map((f) => f.value).join(" ")}`)
      .join(" ")
      .toLowerCase();
    const colorCounts = new Map<string, number>();
    relics.forEach((r) => colorCounts.set(r.palette, (colorCounts.get(r.palette) ?? 0) + 1));
    const topColor =
      [...colorCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "nothing yet";
    const kindCounts = new Map<string, number>();
    relics.forEach((r) =>
      kindCounts.set(r.encounterName, (kindCounts.get(r.encounterName) ?? 0) + 1),
    );
    const topKind =
      [...kindCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "undecided";

    return [
      ["Relics collected", relics.length],
      ["Objects probably haunted", relics.filter((r) => r.rarity === "Probably Haunted").length],
      ["Rare relics", relics.filter((r) => isRare(r.rarity)).length],
      ["Frogs encountered", (text.match(/frog/g) ?? []).length],
      ["Motel rooms survived", relics.filter((r) => r.kind === "motel-key").length],
      ["Unknown transmissions", relics.filter((r) => r.rarity === "????").length],
      ["Times you ignored instructions", relics.filter((r) => r.choices.some((c) => c.includes("DO NOT"))).length],
      ["Fortunes requested", relics.filter((r) => r.kind === "fortune-ticket").length],
      ["Doors opened", relics.filter((r) => r.kind === "postcard").length],
      ["Secret things found", secretsFound],
      ["Most common colour", topColor],
      ["Favourite category", topKind],
    ] as [string, string | number][];
  }, [relics, secretsFound]);

  return (
    <main className="flex-1">
      <SiteHeader subtitle="your very important statistics" />

      <div className="card-paper relative p-6">
        <span className="tape-strip -top-3 right-8 rotate-6" aria-hidden />
        <p className="label-caps">curiosity streak</p>
        <p className="mt-1 font-display text-3xl">
          🔥 {ready ? streak : 0} day{streak === 1 ? "" : "s"}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          {streak > 0 ? "keep being nosy." : "you were busy being mysterious."}
        </p>
      </div>

      <dl className="mt-5 card-paper divide-y divide-dashed divide-foreground/20 p-2">
        {stats.map(([label, value]) => (
          <div key={label} className="flex items-baseline justify-between gap-4 px-3 py-2.5">
            <dt className="text-sm">{label}</dt>
            <dd className="font-display text-xl">{ready ? value : 0}</dd>
          </div>
        ))}
      </dl>

      <p className="mt-4 text-center text-xs italic text-muted-foreground">
        none of these numbers mean anything. that is the point.
      </p>

      <div className="mt-8 flex justify-between">
        <Link to="/cabinet" className="label-caps underline-offset-4 hover:underline">
          ← the little museum
        </Link>
        <Link to="/" className="label-caps underline-offset-4 hover:underline">
          play something →
        </Link>
      </div>
    </main>
  );
}
