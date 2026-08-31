import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { SiteHeader } from "@/components/SiteHeader";
import { PressButton } from "@/components/PressButton";
import { RelicCard } from "@/components/relic/RelicCard";
import { getEncounter } from "@/lib/relics/encounters";
import { generateRelic, generateSecretRelic } from "@/lib/relics/generate";
import { useRelicState } from "@/lib/relics/storage";
import { playSound } from "@/lib/sound";
import { decodeFriend, relicImageBlob, relicLine, relicUrl } from "@/lib/relics/share";
import type { Relic } from "@/lib/relics/types";

export const Route = createFileRoute("/play/$encounter")({
  validateSearch: (search: Record<string, unknown>) => ({
    from: typeof search["from"] === "string" ? search["from"] : undefined,
    daily: typeof search["daily"] === "string" ? search["daily"] : undefined,
  }),
  head: ({ params }) => {
    const e = getEncounter(params.encounter);
    const title = e ? `${e.name} — Pocket Relics` : "An encounter — Pocket Relics";
    const desc = e ? `“${e.teaser}” Play it, keep the souvenir.` : "Play a tiny encounter.";
    return {
      meta: [
        { title },
        { name: "description", content: desc },
        { property: "og:title", content: title },
        { property: "og:description", content: desc },
      ],
    };
  },
  component: Play,
});

type Phase = "choosing" | "suspense" | "revealed";

function Play() {
  const { encounter: encounterId } = Route.useParams();
  const { from, daily } = Route.useSearch();
  const navigate = useNavigate();
  const encounter = getEncounter(encounterId);
  const { relics, soundOn, addRelic, markDailyDone } = useRelicState();

  const [step, setStep] = useState(0);
  const [choices, setChoices] = useState<string[]>([]);
  const [phase, setPhase] = useState<Phase>("choosing");
  const [relic, setRelic] = useState<Relic | null>(null);
  const [kept, setKept] = useState(false);
  const friend = decodeFriend(from);

  const reveal = useCallback(
    (finalChoices: string[]) => {
      setPhase("suspense");
      playSound("capsule", soundOn);
      const made =
        encounterId === "secret"
          ? generateSecretRelic(relics.length + 1)
          : generateRelic(encounterId as never, finalChoices, {
              number: relics.length + 1,
              daily: daily === "1",
            });
      window.setTimeout(() => {
        setRelic(made);
        setPhase("revealed");
        playSound("bell", soundOn);
      }, 1400);
    },
    [encounterId, relics.length, soundOn, daily],
  );

  useEffect(() => {
    setStep(0);
    setChoices([]);
    setPhase("choosing");
    setRelic(null);
    setKept(false);
  }, [encounterId]);

  if (!encounter) {
    return (
      <main className="flex-1">
        <SiteHeader />
        <p className="card-paper p-6 text-center">this encounter wandered off.</p>
      </main>
    );
  }

  const choose = (label: string) => {
    playSound("tap", soundOn);
    const next = [...choices, label];
    setChoices(next);
    if (step + 1 >= encounter.steps.length) reveal(next);
    else setStep(step + 1);
  };

  const keep = () => {
    if (!relic || kept) return;
    addRelic(relic);
    if (daily === "1") markDailyDone();
    setKept(true);
    playSound("coin", soundOn);
    toast("that's… yours now.", { description: "your cabinet grows." });
  };

  const again = () => {
    setStep(0);
    setChoices([]);
    setRelic(null);
    setKept(false);
    setPhase("choosing");
  };

  const share = async () => {
    if (!relic) return;
    playSound("print", soundOn);
    const url = relicUrl(relic);
    const text = relicLine(relic);
    if (navigator.share) {
      try {
        await navigator.share({ title: "Pocket Relics", text, url });
        return;
      } catch {
        /* cancelled */
      }
    }
    await navigator.clipboard.writeText(`${text}\n${url}`);
    toast("copied. someone else should see this.");
  };

  const copyLink = async () => {
    if (!relic) return;
    await navigator.clipboard.writeText(relicUrl(relic));
    playSound("click", soundOn);
    toast("relic link copied.");
  };

  const saveImage = async () => {
    if (!relic) return;
    const blob = await relicImageBlob(relic);
    if (!blob) return;
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `pocket-relic-${relic.serial}.png`;
    a.click();
    URL.revokeObjectURL(a.href);
    playSound("click", soundOn);
  };

  const current = encounter.steps[Math.min(step, encounter.steps.length - 1)]!;

  return (
    <main className="flex-1">
      <SiteHeader />

      {friend && phase !== "revealed" && (
        <div className="card-paper mb-4 bg-accent/60 p-4">
          <p className="label-caps">a friend sent you this encounter</p>
          <p className="mt-1 text-sm">
            they found <strong>{friend.t}</strong> {friend.m} — you probably won't.
          </p>
        </div>
      )}

      {phase === "choosing" && (
        <section key={step} className="animate-rise">
          <div className="card-paper relative p-6 text-center">
            <span className="tape-strip -top-3 left-1/2 -translate-x-1/2 rotate-3" aria-hidden />
            <p className="label-caps">{encounter.name}</p>
            <p className="mt-3 text-6xl">{encounter.emoji}</p>
            <p className="mt-4 font-display text-2xl leading-snug">
              {step === 0 ? encounter.intro : current.prompt}
            </p>
            {step === 0 && encounter.steps.length > 0 && (
              <p className="mt-2 text-sm text-muted-foreground">{current.prompt}</p>
            )}
          </div>

          <div className="mt-4 grid gap-3">
            {current.options.map((o) => (
              <PressButton
                key={o.label}
                onClick={() => choose(o.label)}
                className="w-full justify-between text-left text-base"
              >
                <span>
                  {o.emoji} {o.label}
                </span>
                {o.note && (
                  <span className="font-mono text-[10px] opacity-60">{o.note}</span>
                )}
              </PressButton>
            ))}
          </div>

          <p className="label-caps mt-4 text-center">
            step {step + 1} of {encounter.steps.length} · there is no wrong answer
          </p>
        </section>
      )}

      {phase === "suspense" && (
        <section className="flex min-h-[50vh] flex-col items-center justify-center text-center">
          <p className="animate-float text-5xl">✦</p>
          <p className="mt-6 animate-fade-in font-display text-2xl">
            YOU FOUND SOMETHING…
          </p>
          <p className="mt-2 text-sm text-muted-foreground">something is inside.</p>
        </section>
      )}

      {phase === "revealed" && relic && (
        <section className="animate-pop">
          <RelicCard relic={relic} />

          {friend && (
            <div className="card-paper mt-4 p-4">
              <div className="grid grid-cols-2 gap-3 text-center">
                <div>
                  <p className="label-caps">you found</p>
                  <p className="mt-1 text-sm font-medium">{relic.title}</p>
                </div>
                <div>
                  <p className="label-caps">your friend found</p>
                  <p className="mt-1 text-sm font-medium">{friend.t}</p>
                </div>
              </div>
              <p className="mt-3 text-center text-xs italic text-muted-foreground">
                same night. different universe.
              </p>
            </div>
          )}

          <div className="mt-5 grid gap-3">
            <PressButton
              tone={kept ? "accent" : "primary"}
              onClick={keep}
              className="w-full text-base"
            >
              {kept ? "KEPT ✓ — it's in your cabinet" : "KEEP IT"}
            </PressButton>
            <div className="grid grid-cols-2 gap-3">
              <PressButton onClick={share}>SEND TO SOMEONE</PressButton>
              <PressButton onClick={saveImage}>SAVE IMAGE</PressButton>
              <PressButton onClick={copyLink} tone="ghost">
                COPY RELIC LINK
              </PressButton>
              <PressButton onClick={again} tone="ghost">
                TRY ANOTHER
              </PressButton>
            </div>
            <button
              onClick={() => navigate({ to: "/cabinet" })}
              className="text-center text-sm underline underline-offset-4"
            >
              open my cabinet
            </button>
            <Link to="/" className="text-center text-xs text-muted-foreground">
              ← back to the hallway
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
