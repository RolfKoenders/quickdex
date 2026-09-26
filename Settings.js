.pragma library

// Pure user-settings logic. Dex.qml owns persistence (settings.json); this
// only defines the allowed keys/values and coerces whatever was on disk into
// a known-good shape. See tests/test_settings.js.

var DEFAULT_VIEWS = ["recents", "favorites"]
var DEFAULTS = { defaultView: "recents" }

// Unknown keys are dropped and bad/missing values fall back to DEFAULTS, so a
// hand-edited or older settings file can never put the panel in a bad state.
function normalize(raw) {
  var source = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {}
  return {
    defaultView: DEFAULT_VIEWS.indexOf(source.defaultView) !== -1
      ? source.defaultView : DEFAULTS.defaultView
  }
}

// Pure: returns a new normalized object. Keys that aren't settings are ignored.
function withValue(settings, key, value) {
  var next = normalize(settings)
  if (Object.prototype.hasOwnProperty.call(DEFAULTS, key)) next[key] = value
  return normalize(next)
}

// Panel.qml's secondaryView value the popup should start on. "none" with an
// empty query already shows Recents, so that's what "recents" maps to.
function initialSecondaryView(settings) {
  return normalize(settings).defaultView === "favorites" ? "favorites" : "none"
}
