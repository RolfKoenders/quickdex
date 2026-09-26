.pragma library

// The IPC command that toggles the popup, shown in settings. The Hyprland
// bind lines that wrap it live in README.md, which tests/test_keybind.js
// checks still contains this command. Quickdex never writes Hyprland config.

// Must match Panel.qml's ipcTarget.
var IPC_TARGET = "quickdex"

function toggleCommand() {
  return "omarchy-shell " + IPC_TARGET + " toggle"
}
