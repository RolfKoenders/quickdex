.pragma library

// Text builders for the Hyprland bind that toggles the popup over shell IPC.
// Quickdex never writes Hyprland config itself; the settings view only shows
// these lines for the user to paste. See tests/test_keybind.js.

// Must match Panel.qml's ipcTarget.
var IPC_TARGET = "quickdex"

var LUA_BINDINGS_PATH = "~/.config/hypr/bindings.lua"
var CONF_BINDINGS_PATH = "~/.config/hypr/bindings.conf"

function toggleCommand() {
  return "omarchy-shell " + IPC_TARGET + " toggle"
}

// Omarchy's current (Lua) Hyprland config.
function luaBind() {
  return 'o.bind("SUPER + SHIFT + P", "Quickdex", "' + toggleCommand() + '")'
}

// Older Omarchy installs on the classic .conf syntax.
function confBind() {
  return "bindd = SUPER SHIFT, P, Quickdex, exec, " + toggleCommand()
}
