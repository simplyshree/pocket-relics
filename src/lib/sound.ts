/** Tiny WebAudio blips. Nothing loud, nothing sampled. */

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC =
      window.AudioContext ??
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

function blip(
  freq: number,
  dur: number,
  type: OscillatorType = "sine",
  gain = 0.05,
  delay = 0,
) {
  const ac = audio();
  if (!ac) return;
  const t = ac.currentTime + delay;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.012);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  osc.connect(g).connect(ac.destination);
  osc.start(t);
  osc.stop(t + dur + 0.02);
}

export type SoundName = "tap" | "click" | "coin" | "print" | "bell" | "capsule";

export function playSound(name: SoundName, enabled: boolean) {
  if (!enabled) return;
  try {
    switch (name) {
      case "tap":
        blip(420, 0.06, "triangle", 0.035);
        break;
      case "click":
        blip(880, 0.04, "square", 0.02);
        break;
      case "coin":
        blip(988, 0.08, "triangle", 0.04);
        blip(1319, 0.12, "triangle", 0.035, 0.07);
        break;
      case "print":
        blip(220, 0.05, "sawtooth", 0.018);
        blip(240, 0.05, "sawtooth", 0.015, 0.06);
        blip(210, 0.06, "sawtooth", 0.014, 0.12);
        break;
      case "bell":
        blip(1568, 0.35, "sine", 0.035);
        blip(2093, 0.25, "sine", 0.02, 0.03);
        break;
      case "capsule":
        blip(523, 0.1, "sine", 0.04);
        blip(784, 0.14, "sine", 0.04, 0.1);
        blip(1046, 0.3, "sine", 0.045, 0.22);
        break;
    }
  } catch {
    /* audio is optional */
  }
}
