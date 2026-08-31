import type { Relic } from "./types";

const PALETTE_HEX: Record<string, string> = {
  red: "#a8503f",
  forest: "#41694f",
  blue: "#5878a0",
  pink: "#c98f96",
  butter: "#e2c069",
  lavender: "#9b8bc0",
  night: "#3b4467",
};

export function relicLine(relic: Relic) {
  return `POCKET RELICS — I found this today: ${relic.title} (${relic.rarity})`;
}

export function relicUrl(relic: Relic) {
  if (typeof window === "undefined") return "";
  const payload = btoa(
    encodeURIComponent(
      JSON.stringify({
        t: relic.title,
        s: relic.subtitle,
        r: relic.rarity,
        m: relic.motif,
      }),
    ),
  );
  return `${window.location.origin}/play/${relic.encounterId}?from=${payload}`;
}

export interface SharedFriend {
  t: string;
  s: string;
  r: string;
  m: string;
}

export function decodeFriend(param: string | undefined): SharedFriend | null {
  if (!param) return null;
  try {
    return JSON.parse(decodeURIComponent(atob(param))) as SharedFriend;
  } catch {
    return null;
  }
}

/** Draws a share card on a canvas so people can save a real image. */
export async function relicImageBlob(relic: Relic): Promise<Blob | null> {
  const W = 1080;
  const H = 1350;
  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;
  const accent = PALETTE_HEX[relic.palette] ?? "#a8503f";

  ctx.fillStyle = "#f7f2e6";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "rgba(60,45,30,0.05)";
  for (let y = 0; y < H; y += 22)
    for (let x = 0; x < W; x += 22) ctx.fillRect(x, y, 2, 2);

  ctx.strokeStyle = "#3a2f26";
  ctx.lineWidth = 5;
  ctx.strokeRect(56, 56, W - 112, H - 112);

  ctx.fillStyle = accent;
  ctx.fillRect(56, 56, W - 112, 18);

  const center = (text: string, y: number, font: string, color: string) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.fillText(text, W / 2, y);
  };

  const wrap = (text: string, y: number, font: string, color: string, max = 820, lh = 52) => {
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    const words = text.split(" ");
    let line = "";
    let yy = y;
    for (const w of words) {
      const test = line ? `${line} ${w}` : w;
      if (ctx.measureText(test).width > max) {
        ctx.fillText(line, W / 2, yy);
        line = w;
        yy += lh;
      } else line = test;
    }
    ctx.fillText(line, W / 2, yy);
    return yy;
  };

  center("P O C K E T   R E L I C S", 160, "34px monospace", "#7a6a58");
  center("I FOUND THIS TODAY", 230, "30px monospace", "#7a6a58");

  ctx.font = "200px serif";
  ctx.textAlign = "center";
  ctx.fillText(relic.motif, W / 2, 470);

  let y = wrap(relic.title, 600, "76px Georgia, serif", "#33291f", 860, 84);
  y = wrap(relic.subtitle, y + 80, "italic 40px Georgia, serif", "#5c4c3c", 800, 54);

  y += 90;
  ctx.textAlign = "left";
  for (const f of relic.fields.slice(0, 4)) {
    ctx.font = "24px monospace";
    ctx.fillStyle = "#8a7a66";
    ctx.fillText(f.label.toUpperCase(), 140, y);
    ctx.font = "34px Georgia, serif";
    ctx.fillStyle = "#33291f";
    ctx.fillText(f.value.length > 42 ? `${f.value.slice(0, 40)}…` : f.value, 140, y + 42);
    y += 96;
  }

  center(`RARITY: ${relic.rarity.toUpperCase()}`, H - 190, "34px monospace", accent);
  center(
    `pocket relic #${String(relic.number).padStart(3, "0")} · ${relic.serial}`,
    H - 130,
    "26px monospace",
    "#8a7a66",
  );

  return new Promise((resolve) => canvas.toBlob(resolve, "image/png"));
}
