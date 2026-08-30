import type { Encounter } from "./types";

export const ENCOUNTERS: Encounter[] = [
  {
    id: "vending",
    name: "The Mystery Vending Machine",
    teaser: "there's a vending machine glowing at the end of the hallway.",
    emoji: "🥤",
    intro: "you find a vending machine at 2:14am.",
    kind: "drink-can",
    steps: [
      {
        prompt: "it hums. three buttons are lit.",
        options: [
          { label: "PINK BUTTON", emoji: "🩷" },
          { label: "BLUE BUTTON", emoji: "🔵" },
          { label: "“DO NOT PRESS”", emoji: "⛔", note: "obviously" },
        ],
      },
      {
        prompt: "the machine asks how much change you have.",
        options: [
          { label: "exact coins", emoji: "🪙" },
          { label: "a crumpled note", emoji: "💵" },
          { label: "a button off your coat", emoji: "🧵" },
        ],
      },
    ],
  },
  {
    id: "motel",
    name: "Strange Motel",
    teaser: "the vacancy sign is still buzzing.",
    emoji: "🔑",
    intro: "you need a room for one night.",
    kind: "motel-key",
    steps: [
      {
        prompt: "pick somewhere to sleep.",
        options: [
          { label: "Moonlight Motel", emoji: "🌙" },
          { label: "Cactus Inn", emoji: "🌵" },
          { label: "Rainy Pines Lodge", emoji: "🌧" },
        ],
      },
      {
        prompt: "the keys are on hooks. take one.",
        options: [
          { label: "17", emoji: "🗝" },
          { label: "404", emoji: "🗝", note: "not found" },
          { label: "8½", emoji: "🗝" },
        ],
      },
      {
        prompt: "the receptionist has one piece of advice.",
        options: [
          { label: "listen carefully", emoji: "👂" },
          { label: "nod politely", emoji: "🙂" },
          { label: "pretend you already know", emoji: "😎" },
        ],
      },
    ],
  },
  {
    id: "door",
    name: "Pick A Door",
    teaser: "three doors. none of them were here yesterday.",
    emoji: "🚪",
    intro: "you are standing in a hallway that is slightly too long.",
    kind: "postcard",
    steps: [
      {
        prompt: "choose a door.",
        options: [
          { label: "tiny red door", emoji: "🚪" },
          { label: "suspicious green door", emoji: "🚪" },
          { label: "door floating in space", emoji: "🚪" },
        ],
      },
      {
        prompt: "how do you enter?",
        options: [
          { label: "knock first", emoji: "✊" },
          { label: "walk in like you live there", emoji: "🚶" },
          { label: "peek", emoji: "👀" },
        ],
      },
    ],
  },
  {
    id: "fortune",
    name: "Today's Fortune Machine",
    teaser: "a small machine would like a word.",
    emoji: "🔮",
    intro: "it has one button, and it is already warm.",
    kind: "fortune-ticket",
    steps: [
      {
        prompt: "the machine is waiting.",
        options: [
          { label: "ASK THE MACHINE", emoji: "✦" },
          { label: "ASK IT NICELY", emoji: "🙏" },
          { label: "ASK IT SOMETHING ELSE", emoji: "❓" },
        ],
      },
    ],
  },
  {
    id: "lost-found",
    name: "Lost & Found",
    teaser: "something is under the train seat.",
    emoji: "🧳",
    intro: "the train is empty. you find something under the seat.",
    kind: "object-card",
    steps: [
      {
        prompt: "three shapes under a folded coat.",
        options: [
          { label: "the small one", emoji: "▪️" },
          { label: "the heavy one", emoji: "⬛" },
          { label: "the one that is warm", emoji: "🟧" },
        ],
      },
      {
        prompt: "what do you do with it?",
        options: [
          { label: "pocket it immediately", emoji: "🧥" },
          { label: "hand it in (you don't)", emoji: "🤷" },
          { label: "ask it a question", emoji: "💬" },
        ],
      },
    ],
  },
];

export const SECRET_ENCOUNTER: Encounter = {
  id: "secret",
  name: "Something Behind The Shelf",
  teaser: "wait.",
  emoji: "✦",
  intro: "something fell behind the shelf.",
  kind: "object-card",
  steps: [
    {
      prompt: "you hear knocking from inside your cabinet.",
      options: [
        { label: "reach in", emoji: "🫳" },
        { label: "knock back", emoji: "✊" },
      ],
    },
  ],
};

export const getEncounter = (id: string) =>
  [...ENCOUNTERS, SECRET_ENCOUNTER].find((e) => e.id === id);
