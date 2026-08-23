#!/usr/bin/env node
// Unit tests for Favorites.js. Run: node tests/test_favorites.js

const fs = require("fs");
const path = require("path");

function load(name) {
  const source = fs.readFileSync(path.join(__dirname, "..", name), "utf8")
    .replace(/^\.pragma library\s*$/m, "");
  const names = [...source.matchAll(/^function\s+([A-Za-z0-9_]+)/gm)].map((m) => m[1]);
  const constants = [...source.matchAll(/^var\s+([A-Z][A-Z0-9_]*)/gm)].map((m) => m[1]);
  return new Function(`${source}\nreturn {${[...names, ...constants].join(",")}};`)();
}

const Favorites = load("Favorites.js");

let failures = 0;
let checks = 0;

function eq(label, actual, expected) {
  checks++;
  const ok = JSON.stringify(actual) === JSON.stringify(expected);
  if (!ok) {
    failures++;
    console.log(`  FAIL ${label}\n       got      ${JSON.stringify(actual)}` +
                `\n       expected ${JSON.stringify(expected)}`);
  }
}

function section(title, body) {
  console.log(title);
  const before = failures;
  body();
  console.log(before === failures ? "  ok" : "  ^^ failures above");
}

section("add: prepends to an empty list", () => {
  eq("first entry", Favorites.add([], "pikachu"), ["pikachu"]);
});

section("add: prepends, most-recently-favorited first", () => {
  eq("newest goes first", Favorites.add(["pikachu", "charizard"], "eevee"),
     ["eevee", "pikachu", "charizard"]);
});

section("add: no-op when already favorited (unlike Recents, never re-bumps)", () => {
  const list = ["charizard", "pikachu", "eevee"];
  eq("unchanged, no duplicate, no reordering", Favorites.add(list, "pikachu"), list);
});

section("add: no cap, ever", () => {
  var list = [];
  for (let i = 0; i < 50; i++) list = Favorites.add(list, "mon-" + i);
  eq("all 50 survive", list.length, 50);
});

section("remove: filters out the given slug", () => {
  eq("only the matching slug removed", Favorites.remove(["pikachu", "eevee"], "pikachu"), ["eevee"]);
});

section("remove: no-op for a slug that isn't favorited", () => {
  const list = ["pikachu"];
  eq("unchanged", Favorites.remove(list, "eevee"), list);
});

section("isFavorite", () => {
  const list = ["pikachu"];
  eq("present", Favorites.isFavorite(list, "pikachu"), true);
  eq("absent", Favorites.isFavorite(list, "eevee"), false);
  eq("empty list", Favorites.isFavorite([], "pikachu"), false);
});

console.log();
if (failures) {
  console.log(`FAILED: ${failures} of ${checks} checks`);
  process.exit(1);
}
console.log(`all ${checks} checks passed`);
