// Tiny seeded RNG so daily encounters can be stable per-day if needed.
export function makeRng(seed?: string) {
  let h = 2166136261 >>> 0;
  const s = seed ?? String(Math.random());
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return function rng() {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Rng = () => number;

export const pick = <T,>(rng: Rng, arr: readonly T[]): T =>
  arr[Math.floor(rng() * arr.length)]!;

export const chance = (rng: Rng, p: number) => rng() < p;

export const pad = (n: number, len = 4) => String(n).padStart(len, "0");
