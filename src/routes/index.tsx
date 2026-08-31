import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteHeader } from "@/components/SiteHeader";
import { PressButton } from "@/components/PressButton";
import { ENCOUNTERS } from "@/lib/relics/encounters";
import { useRelicState, todayKey } from "@/lib/relics/storage";
import { makeRng, pick } from "@/lib/relics/random";
import { RelicArt } from "@/components/relic/RelicArt";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Pocket Relics — tiny souvenirs from places that don't exist" },
      {
        name: "description",
        content:
          "Play a 30-second encounter, keep a strange little souvenir. A vending machine at 2:14am, a motel with no room 12, a fortune machine that already knows.",
      },
      { property: "og:title", content: "Pocket Relics ✦" },
      {
        property: "og:description",
        content: "tiny things from places that probably don't exist. play, keep, collect.",
      },
    ],
  }),
  component: Home,
});

function Home() {
  const { relics, streak, dailyDoneDay, ready } = useRelicState();
  const navigate = useNavigate();
  const [secret, setSecret] = useState(false);

  const daily = pick(makeRng(`daily-${todayKey()}`), ENCOUNTERS);

  useEffect(() => {
    if (relics.length >= 2 && Math.random() < 0.14) setSecret(true);
  }, [relics.length]);

  const randomPlay = () => {
    const e = pick(makeRng(), ENCOUNTERS);
    navigate({ to: "/play/$encounter", params: { encounter: e.id } });
  };

  return (
    <main className="flex-1">
      <SiteHeader subtitle="tiny things from places that probably don't exist." />

      {secret && (
        <Link
          to="/play/$encounter"
          params={{ encounter: "secret" }}
          className="card-paper mb-4 block animate-rise bg-accent p-4 text-center"
        >
          <p className="font-display text-xl">wait.</p>
          <p className="text-sm text-muted-foreground">
            something fell behind the shelf. →
          </p>
        </Link>
      )}

      <section className="card-paper relative animate-rise p-6">
        <span className="tape-strip -top-3 left-6 -rotate-6" aria-hidden />
        <p className="label-caps">
          today's encounter {dailyDoneDay === todayKey() && ready ? "· done ✓" : ""}
        </p>
        <h1 className="mt-2 font-display text-3xl leading-tight">{daily.name}</h1>
        <p className="mt-2 text-[15px] text-muted-foreground">“{daily.teaser}”</p>
        <p className="mt-4 text-sm">
          everyone gets the same encounter today. nobody gets the same thing.
        </p>
        <Link
          to="/play/$encounter"
          params={{ encounter: daily.id }}
          search={{ daily: "1" }}
          className="mt-5 block"
        >
          <PressButton tone="primary" className="w-full text-base">
            SEE WHAT HAPPENS
          </PressButton>
        </Link>
        <button
          onClick={randomPlay}
          className="mt-3 w-full rounded-xl border border-dashed border-foreground/40 py-2.5 text-sm"
        >
          🎲 random encounter
        </button>
      </section>

      <section className="mt-5 card-paper p-5">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="label-caps">your cabinet</p>
            <p className="font-display text-2xl">
              {ready ? relics.length : 0} relic{relics.length === 1 ? "" : "s"} collected
            </p>
            {ready && streak > 0 && (
              <p className="mt-1 text-xs text-muted-foreground">
                🔥 {streak} day curiosity streak — or, you know, whenever.
              </p>
            )}
          </div>
          <div className="flex -space-x-2">
            {relics.slice(0, 3).map((r) => (
              <div key={r.id} className="h-12 w-8">
                <RelicArt relic={r} className="h-full w-full" />
              </div>
            ))}
          </div>
        </div>
        <Link to="/cabinet" className="mt-4 block">
          <PressButton className="w-full">OPEN CABINET</PressButton>
        </Link>
      </section>

      <section className="mt-6">
        <p className="label-caps mb-2">all encounters</p>
        <div className="grid grid-cols-2 gap-3">
          {ENCOUNTERS.map((e) => (
            <Link
              key={e.id}
              to="/play/$encounter"
              params={{ encounter: e.id }}
              className="card-paper flex flex-col gap-1 p-3 transition-transform active:translate-y-[2px]"
            >
              <span className="text-xl">{e.emoji}</span>
              <span className="font-display text-base leading-tight">{e.name}</span>
              <span className="text-xs text-muted-foreground">{e.teaser}</span>
            </Link>
          ))}
        </div>
      </section>

      <footer className="mt-8 flex items-center justify-between border-t border-dashed border-foreground/25 pt-4">
        <Link to="/stats" className="label-caps underline-offset-4 hover:underline">
          your very important statistics
        </Link>
        <span className="label-caps">no login. ever.</span>
      </footer>
    </main>
  );
}
