export type RelicKind =
  | "drink-can"
  | "motel-key"
  | "postcard"
  | "fortune-ticket"
  | "object-card";

export type Rarity =
  | "Common"
  | "Uncommon"
  | "Odd"
  | "Very Odd"
  | "Suspicious"
  | "Extremely Specific"
  | "Probably Haunted"
  | "One in a Million"
  | "????";

export type PaletteName =
  | "red"
  | "forest"
  | "blue"
  | "pink"
  | "butter"
  | "lavender"
  | "night";

export interface RelicField {
  label: string;
  value: string;
}

export interface Relic {
  id: string;
  kind: RelicKind;
  encounterId: EncounterId;
  encounterName: string;
  title: string;
  subtitle: string;
  fields: RelicField[];
  description: string;
  rarity: Rarity;
  palette: PaletteName;
  serial: string;
  motif: string;
  set: string | null;
  choices: string[];
  collectedAt: number;
  number: number;
  favorite?: boolean;
  daily?: boolean;
  secret?: boolean;
}

export type EncounterId =
  | "vending"
  | "motel"
  | "door"
  | "fortune"
  | "lost-found"
  | "secret";

export interface EncounterStep {
  prompt: string;
  options: { label: string; emoji?: string; note?: string }[];
}

export interface Encounter {
  id: EncounterId;
  name: string;
  teaser: string;
  emoji: string;
  intro: string;
  steps: EncounterStep[];
  kind: RelicKind;
}
