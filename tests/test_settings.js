#!/usr/bin/env node
// Unit tests for Settings.js. Run: node tests/test_settings.js

const fs = require("fs");
const path = require("path");

function load(name) {
  const source = fs.readFileSync(path.join(__dirname, "..", name), "utf8")
    .replace(/^\.pragma library\s*$/m, "");
  const names = [...source.matchAll(/^function\s+([A-Za-z0-9_]+)/gm)].map((m) => m[1]);
  const constants = [...source.matchAll(/^var\s+([A-Z][A-Z0-9_]*)/gm)].map((m) => m[1]);
  return new Function(`${source}\nreturn {${[...names, ...constants].join(",")}};`)();
}

const Settings = load("Settings.js");

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

section("normalize: missing or non-object input gives defaults", () => {
  eq("undefined", Settings.normalize(undefined), { defaultView: "recents" });
  eq("null", Settings.normalize(null), { defaultView: "recents" });
  eq("array", Settings.normalize(["favorites"]), { defaultView: "recents" });
  eq("string", Settings.normalize("favorites"), { defaultView: "recents" });
  eq("empty object", Settings.normalize({}), { defaultView: "recents" });
});

section("normalize: keeps valid values", () => {
  eq("favorites", Settings.normalize({ defaultView: "favorites" }), { defaultView: "favorites" });
  eq("recents", Settings.normalize({ defaultView: "recents" }), { defaultView: "recents" });
});

section("normalize: bad values fall back, unknown keys are dropped", () => {
  eq("unknown view", Settings.normalize({ defaultView: "search" }), { defaultView: "recents" });
  eq("wrong type", Settings.normalize({ defaultView: 3 }), { defaultView: "recents" });
  eq("extra key dropped", Settings.normalize({ defaultView: "favorites", evil: true }),
     { defaultView: "favorites" });
});

section("withValue: sets a known key, pure", () => {
  const before = { defaultView: "recents" };
  eq("updated", Settings.withValue(before, "defaultView", "favorites"), { defaultView: "favorites" });
  eq("input untouched", before, { defaultView: "recents" });
});

section("withValue: rejects bad values and unknown keys", () => {
  eq("bad value", Settings.withValue({ defaultView: "favorites" }, "defaultView", "nope"),
     { defaultView: "recents" });
  eq("unknown key ignored", Settings.withValue({ defaultView: "favorites" }, "other", 1),
     { defaultView: "favorites" });
  eq("prototype key ignored", Settings.withValue({}, "toString", 1), { defaultView: "recents" });
});

section("initialSecondaryView: maps to Panel's secondaryView", () => {
  eq("recents -> none (empty query already shows recents)",
     Settings.initialSecondaryView({ defaultView: "recents" }), "none");
  eq("favorites", Settings.initialSecondaryView({ defaultView: "favorites" }), "favorites");
  eq("garbage -> none", Settings.initialSecondaryView(null), "none");
});

console.log();
if (failures) {
  console.log(`FAILED: ${failures} of ${checks} checks`);
  process.exit(1);
}
console.log(`all ${checks} checks passed`);
