import { makeRng, pick, chance, pad, type Rng } from "./random";
import type { EncounterId, PaletteName, Rarity, Relic, RelicKind } from "./types";
import { getEncounter } from "./encounters";

const RARITY_TABLE: { rarity: Rarity; weight: number }[] = [
  { rarity: "Common", weight: 30 },
  { rarity: "Uncommon", weight: 22 },
  { rarity: "Odd", weight: 16 },
  { rarity: "Very Odd", weight: 12 },
  { rarity: "Suspicious", weight: 9 },
  { rarity: "Extremely Specific", weight: 6 },
  { rarity: "Probably Haunted", weight: 3 },
  { rarity: "One in a Million", weight: 1.2 },
  { rarity: "????", weight: 0.8 },
];

export const RARITY_ORDER: Rarity[] = RARITY_TABLE.map((r) => r.rarity);

export function isRare(r: Rarity) {
  return RARITY_ORDER.indexOf(r) >= 5;
}

function rollRarity(rng: Rng): Rarity {
  const total = RARITY_TABLE.reduce((s, r) => s + r.weight, 0);
  let n = rng() * total;
  for (const row of RARITY_TABLE) {
    n -= row.weight;
    if (n <= 0) return row.rarity;
  }
  return "Common";
}

const PALETTES: PaletteName[] = [
  "red",
  "forest",
  "blue",
  "pink",
  "butter",
  "lavender",
  "night",
];

export const SETS = [
  "NIGHT DRIVE",
  "RAINY DAY",
  "SPACE TOURIST",
  "TINY CREATURES",
  "MYSTERY VENDING MACHINE",
  "GHOST EMPLOYMENT",
  "FRIDGE DIMENSION",
  "STRANGE VACATION",
  "FROG BUSINESS DISTRICT",
  "LOST & FOUND",
] as const;

const fmtDate = (d: Date) =>
  d.toLocaleDateString("en-GB", { day: "numeric", month: "long" });

/* ---------------------------------- banks --------------------------------- */

const DRINK_NAMES = [
  "MOON JUICE",
  "STARDUST SODA",
  "SLEEP CIDER",
  "TELEVISION COLA",
  "QUIET LEMONADE",
  "GHOST FIZZ",
  "POCKET NECTAR",
  "SECOND BREAKFAST TONIC",
  "ELEVATOR SPRING WATER",
  "FROG BRAND ICED TEA",
];
const FLAVORS = [
  "Blueberry Static",
  "Peach Meteor",
  "Radio Static",
  "Cold Library",
  "Melon & Rain",
  "Very Distant Cherry",
  "Grape, Allegedly",
  "Warm Vending Machine",
  "Salt & Small Stars",
  "Lavender Batteries",
];
const SIDE_EFFECTS = [
  "You remember a dream you never had.",
  "Mild urge to write a letter.",
  "You can suddenly whistle.",
  "Nearby clocks become polite.",
  "Temporary fondness for Tuesdays.",
  "You smell rain that isn't happening.",
  "Your shoelaces stay tied all week.",
  "One frog now trusts you.",
];
const BEST_CONSUMED = [
  "During thunderstorms.",
  "On a bus, going nowhere.",
  "At 2:14am, obviously.",
  "While pretending to read.",
  "Between Tuesday and Wednesday.",
  "In a stairwell.",
];

const MOTELS = {
  "Moonlight Motel": { palette: "night" as PaletteName, weather: ["Light Rain", "Clear & Cold", "Fog"] },
  "Cactus Inn": { palette: "butter" as PaletteName, weather: ["Very Dry", "Heat Shimmer", "Wind"] },
  "Rainy Pines Lodge": { palette: "forest" as PaletteName, weather: ["Rain", "Heavy Rain", "Pine Mist"] },
};
const ADVICE = [
  "don't answer the phone after midnight.",
  "the vending machine knows your name.",
  "room 12 does not exist.",
  "ignore the ducks.",
  "do not feed the elevator.",
  "the ice machine is very sorry.",
  "if the hallway is longer, take the stairs.",
  "the pool closed in 1994. it is still open.",
];
const GUESTS = [
  "Certified Overthinker",
  "Professional Passenger",
  "Small Hours Enthusiast",
  "Person With One Bag",
  "Amateur Ghost",
  "Frog Adjacent",
  "Unreliable Narrator",
];
const FOUND = [
  "One suspicious key",
  "A postcard nobody sent",
  "Three coins, wrong country",
  "A shell, very far from the sea",
  "Half a map",
];

const DOOR_SCENES = [
  { title: "THE MOON'S LOST & FOUND", line: "everything you misplaced, alphabetised.", motif: "🌙" },
  { title: "A FROG RUNNING A BAKERY", line: "the croissants are damp but sincere.", motif: "🐸" },
  { title: "THE ENDLESS LAUNDROMAT", line: "cycle 3 of ∞. bring socks.", motif: "🧺" },
  { title: "SIX CHAIRS HAVING A MEETING", line: "no agenda. tremendous focus.", motif: "🪑" },
  { title: "A VENDING MACHINE SELLING MEMORIES", line: "row C is mostly summers.", motif: "🥤" },
  { title: "A TINY FOREST INSIDE A FRIDGE", line: "seasonal. cold. absolutely thriving.", motif: "🌲" },
  { title: "THE DEPARTMENT OF SMALL WEATHER", line: "issuing one cloud, per person, per day.", motif: "☁️" },
  { title: "A LIBRARY FOR UNFINISHED SONGS", line: "hum quietly. they are shy.", motif: "🎵" },
];
const POSTCARD_NOTES = [
  "wish you were slightly here.",
  "the light is doing something strange.",
  "stayed longer than planned. no regrets.",
  "everyone here is very kind and slightly damp.",
  "bought nothing. brought back everything.",
];

const FORTUNES = [
  "You will find exactly the snack you were thinking about.",
  "A duck will respect you.",
  "Your next idea deserves a second look.",
  "Something you lost will return in a slightly weirder form.",
  "Beware of unnecessarily confident pigeons.",
  "You are entering your tiny spoon era.",
  "Say the thing. It's a good thing.",
  "A door you assumed was locked simply isn't.",
  "Tuesday owes you one and it knows it.",
];
const LUCKY_OBJECTS = [
  "a bent paperclip",
  "the last good pen",
  "a smooth grey stone",
  "somebody else's umbrella",
  "a warm mug",
  "one unmatched sock",
  "a bus ticket",
];
const SYMBOLS = ["✦", "☾", "❋", "◈", "☂", "✿", "☼", "❖", "✧", "☕︎"];

const OBJECTS = [
  { name: "Key labelled “cloud storage”", desc: "Doesn't fit anything you own.", motif: "🔑" },
  { name: "Photograph of a frog", desc: "You have never met this frog.", motif: "📷" },
  { name: "Tiny Silver Spoon", desc: "Suspiciously well cared for.", motif: "🥄" },
  { name: "Receipt dated 2047", desc: "Two coffees. Still cheaper than now.", motif: "🧾" },
  { name: "Ticket to Somewhere Nicer", desc: "One way. No platform listed.", motif: "🎟" },
  { name: "Employee Badge: THE MOON", desc: "Night shift. Expired, probably.", motif: "🪪" },
  { name: "Pressed Daisy", desc: "Found somewhere between Tuesday and Wednesday.", motif: "🌼" },
  { name: "Moon Coin", desc: "Worth absolutely nothing on Earth.", motif: "🪙" },
  { name: "Tiny Cassette", desc: "Side A contains rain. Side B contains more rain.", motif: "📼" },
  { name: "Matchbox, half full", desc: "From a diner that closes at an unclear time.", motif: "🔥" },
  { name: "Small Blue Marble", desc: "Warm. Refuses to explain itself.", motif: "🔵" },
];

const TINY_DETAILS = [
  "smells faintly of rain",
  "slightly warm",
  "one corner is bent",
  "hums when nobody is looking",
  "there is glitter in the seams",
  "signed by someone illegible",
  "weighs less than it should",
  "makes a small click",
];

/* -------------------------------- generator ------------------------------- */

export function generateRelic(
  encounterId: EncounterId,
  choices: string[],
  opts: { number: number; daily?: boolean; seed?: string } = { number: 1 },
): Relic {
  const rng = makeRng(opts.seed);
  const encounter = getEncounter(encounterId)!;
  const now = new Date();
  const rarity = rollRarity(rng);
  const detail = pick(rng, TINY_DETAILS);
  const base = {
    id: `${Date.now().toString(36)}-${Math.floor(rng() * 1e6).toString(36)}`,
    encounterId,
    encounterName: encounter.name,
    rarity,
    choices,
    collectedAt: Date.now(),
    number: opts.number,
    daily: opts.daily,
  };

  const dateStr = fmtDate(now);

  switch (encounter.kind as RelicKind) {
    case "drink-can": {
      const name = pick(rng, DRINK_NAMES);
      const flavor =
        choices[0]?.includes("DO NOT") ? pick(rng, ["Forbidden Grape", "Static & Regret", "Unlabelled"]) : pick(rng, FLAVORS);
      return {
        ...base,
        kind: "drink-can",
        title: `${name}™`,
        subtitle: flavor,
        palette: choices[0]?.includes("PINK") ? "pink" : choices[0]?.includes("BLUE") ? "blue" : "red",
        motif: "🥤",
        serial: `${name.slice(0, 2)}-${pad(Math.floor(rng() * 9999))}`,
        set: "MYSTERY VENDING MACHINE",
        description: `Fell out sideways. It is ${detail}.`,
        fields: [
          { label: "Flavor", value: flavor },
          { label: "Side Effect", value: pick(rng, SIDE_EFFECTS) },
          { label: "Best consumed", value: pick(rng, BEST_CONSUMED) },
          { label: "Paid with", value: choices[1] ?? "coins" },
          { label: "Date", value: dateStr },
        ],
      };
    }
    case "motel-key": {
      const motelName = (choices[0] ?? "Moonlight Motel") as keyof typeof MOTELS;
      const motel = MOTELS[motelName] ?? MOTELS["Moonlight Motel"];
      const room = choices[1] ?? "17";
      return {
        ...base,
        kind: "motel-key",
        title: motelName.toUpperCase(),
        subtitle: `Room ${room}`,
        palette: motel.palette,
        motif: "🔑",
        serial: `RM-${room.replace(/\D/g, "") || "08"}${pad(Math.floor(rng() * 99), 2)}`,
        set: "NIGHT DRIVE",
        description: `A key on a plastic fob. It is ${detail}.`,
        fields: [
          { label: "Guest", value: pick(rng, GUESTS) },
          { label: "Weather", value: pick(rng, motel.weather) },
          { label: "Advice", value: `“${pick(rng, ADVICE)}”` },
          { label: "Found", value: pick(rng, FOUND) },
          { label: "Date", value: dateStr },
        ],
      };
    }
    case "postcard": {
      const scene = pick(rng, DOOR_SCENES);
      return {
        ...base,
        kind: "postcard",
        title: `I VISITED ${scene.title}`,
        subtitle: scene.line,
        palette: choices[0]?.includes("red") ? "red" : choices[0]?.includes("green") ? "forest" : "lavender",
        motif: scene.motif,
        serial: `PC-${pad(Math.floor(rng() * 999), 3)}`,
        set: pick(rng, ["STRANGE VACATION", "FRIDGE DIMENSION", "FROG BUSINESS DISTRICT", "SPACE TOURIST"]),
        description: `Postcard, unstamped. It is ${detail}.`,
        fields: [
          { label: "Note", value: pick(rng, POSTCARD_NOTES) },
          { label: "Entered by", value: choices[1] ?? "peeking" },
          { label: "Stay", value: pick(rng, ["4 minutes", "one afternoon", "longer than planned", "unclear"]) },
          { label: "Date", value: dateStr },
        ],
      };
    }
    case "fortune-ticket": {
      return {
        ...base,
        kind: "fortune-ticket",
        title: "TODAY'S FORTUNE",
        subtitle: pick(rng, FORTUNES),
        palette: pick(rng, PALETTES),
        motif: pick(rng, SYMBOLS),
        serial: `FT-${pad(Math.floor(rng() * 9999))}`,
        set: pick(rng, ["RAINY DAY", "GHOST EMPLOYMENT", "TINY CREATURES"]),
        description: `Printed slightly crooked. It is ${detail}.`,
        fields: [
          { label: "Lucky object", value: pick(rng, LUCKY_OBJECTS) },
          { label: "Lucky number", value: String(Math.floor(rng() * 99) + 1) },
          { label: "Tiny symbol", value: pick(rng, SYMBOLS) },
          { label: "Asked", value: choices[0]?.toLowerCase() ?? "asked the machine" },
          { label: "Date", value: dateStr },
        ],
      };
    }
    default: {
      const obj = pick(rng, OBJECTS);
      return {
        ...base,
        kind: "object-card",
        title: obj.name.toUpperCase(),
        subtitle: obj.desc,
        palette: pick(rng, PALETTES),
        motif: obj.motif,
        serial: `LF-${pad(Math.floor(rng() * 9999))}`,
        set: encounterId === "secret" ? "GHOST EMPLOYMENT" : "LOST & FOUND",
        description: `Found under a seat. It is ${detail}.`,
        fields: [
          { label: "Found", value: choices[0] ?? "the small one" },
          { label: "You", value: choices[1] ?? "pocketed it immediately" },
          { label: "Condition", value: pick(rng, ["Loved", "Barely used", "Older than it looks", "Fine, honestly"]) },
          { label: "Date", value: dateStr },
        ],
      };
    }
  }
}

export function generateSecretRelic(number: number): Relic {
  const rng = makeRng();
  const base = generateRelic("secret", ["knocked back"], { number });
  if (chance(rng, 0.5)) {
    return {
      ...base,
      title: "TINY DOOR",
      subtitle: "It was not there yesterday.",
      motif: "🚪",
      rarity: "Probably Haunted",
      secret: true,
      description: "Small. Closed. Warm to the touch.",
    };
  }
  return { ...base, secret: true, rarity: "One in a Million" };
}
