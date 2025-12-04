#!/usr/bin/env bun

import fs from "node:fs";

const YEAR = 2025;

// --- parse day argument ---
const dayArg = Bun.argv[2];
if (!dayArg) {
  console.error("Error: missing day argument. Usage: fetch-aoc <day>");
  process.exit(1);
}

const day = Number(dayArg);
if (!Number.isInteger(day) || day < 1 || day > 25) {
  console.error("Error: day must be an integer 1–25.");
  process.exit(1);
}

// --- session cookie ---
const SESSION = Bun.env.AOC_SESSION;
if (!SESSION) {
  console.error("Error: AOC_SESSION env var not set.");
  process.exit(1);
}

// zero-pad day
const dayStr = String(day).padStart(2, "0");

const url = `https://adventofcode.com/${YEAR}/day/${day}/input`;

const resp = await fetch(url, {
  headers: {
    Cookie: `session=${SESSION}`,
    "User-Agent": "captain-aoc-bun-fetch (github.com/yourname)",
  },
});

if (!resp.ok) {
  const body = await resp.text();
  console.error("Request failed:", resp.status, resp.statusText);
  console.error(body.slice(0, 300));
  process.exit(1);
}

const text = (await resp.text()).trimEnd();

// ensure output directory (Node-compatible fs)
fs.mkdirSync("inputs", { recursive: true });

const path = `inputs/day${dayStr}.txt`;

fs.writeFileSync(path, text);

console.log(`Saved input to ${path}`);
