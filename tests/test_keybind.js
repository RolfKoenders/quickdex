#!/usr/bin/env node
// Unit tests for Keybind.js. Run: node tests/test_keybind.js

const fs = require("fs");
const path = require("path");

function load(name) {
  const source = fs.readFileSync(path.join(__dirname, "..", name), "utf8")
    .replace(/^\.pragma library\s*$/m, "");
  const names = [...source.matchAll(/^function\s+([A-Za-z0-9_]+)/gm)].map((m) => m[1]);
  const constants = [...source.matchAll(/^var\s+([A-Z][A-Z0-9_]*)/gm)].map((m) => m[1]);
  return new Function(`${source}\nreturn {${[...names, ...constants].join(",")}};`)();
}

const Keybind = load("Keybind.js");

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

section("toggleCommand", () => {
  eq("calls the plugin's own IPC target", Keybind.toggleCommand(), "omarchy-shell quickdex toggle");
});

section("IPC target stays in sync with Panel.qml", () => {
  const panel = fs.readFileSync(path.join(__dirname, "..", "Panel.qml"), "utf8");
  const match = /ipcTarget:\s*"([^"]*)"/.exec(panel);
  eq("Panel.qml declares an ipcTarget", !!match, true);
  eq("Keybind.IPC_TARGET matches it", Keybind.IPC_TARGET, match && match[1]);
});

section("luaBind", () => {
  eq("Omarchy Lua syntax", Keybind.luaBind(),
     'o.bind("SUPER + SHIFT + P", "Quickdex", "omarchy-shell quickdex toggle")');
});

section("confBind", () => {
  eq("classic bindd syntax", Keybind.confBind(),
     "bindd = SUPER SHIFT, P, Quickdex, exec, omarchy-shell quickdex toggle");
});

section("binding file paths", () => {
  eq("lua", Keybind.LUA_BINDINGS_PATH, "~/.config/hypr/bindings.lua");
  eq("conf", Keybind.CONF_BINDINGS_PATH, "~/.config/hypr/bindings.conf");
});

console.log();
if (failures) {
  console.log(`FAILED: ${failures} of ${checks} checks`);
  process.exit(1);
}
console.log(`all ${checks} checks passed`);
