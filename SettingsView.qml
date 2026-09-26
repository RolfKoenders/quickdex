import QtQuick
import qs.Ui
import qs.Commons
import "Keybind.js" as Keybind

// Settings surface swapped in for the search UI by the cogwheel. Shows the
// toggle-keybind helper, the default view, and the clear-data actions.
// Persistence and side effects all live in Dex; this only renders and calls.
Column {
  id: view

  property var dex: null
  property QtObject bar: null

  readonly property color fg: bar ? bar.foreground : Color.foreground
  readonly property string family: bar ? bar.fontFamily : Style.font.family
  readonly property color dim: Qt.darker(fg, 1.4)

  spacing: Style.spacing.panelGap

  PanelSectionHeader {
    width: parent.width
    text: "KEYBIND"
    foreground: view.fg
    fontFamily: view.family
  }

  Text {
    textFormat: Text.PlainText
    width: parent.width
    text: "Bind a key to this command in your Hyprland config to toggle Quickdex "
      + "without clicking the bar icon. Examples are in the README."
    wrapMode: Text.WordWrap
    color: view.dim
    font.family: view.family
    font.pixelSize: Style.font.bodySmall
  }

  Row {
    width: parent.width
    spacing: Style.spacing.xs

    Text {
      textFormat: Text.PlainText
      width: parent.width - copyButton.width - Style.spacing.xs
      anchors.verticalCenter: copyButton.verticalCenter
      text: Keybind.toggleCommand()
      wrapMode: Text.WrapAnywhere
      color: view.fg
      font.family: view.family
      font.pixelSize: Style.font.bodySmall
    }

    SettingsButton {
      id: copyButton
      fg: view.fg
      family: view.family
      label: view.dex && view.dex.copiedText === Keybind.toggleCommand() ? "Copied" : "Copy"
      onActivated: view.dex.copyToClipboard(Keybind.toggleCommand())
    }
  }

  PanelSeparator { width: parent.width; foreground: view.fg }

  PanelSectionHeader {
    width: parent.width
    text: "OPENS ON"
    foreground: view.fg
    fontFamily: view.family
  }

  Row {
    spacing: Style.spacing.xs

    SettingsButton {
      fg: view.fg
      family: view.family
      label: "Recents"
      selected: !!view.dex && view.dex.settings.defaultView === "recents"
      onActivated: view.dex.setSetting("defaultView", "recents")
    }

    SettingsButton {
      fg: view.fg
      family: view.family
      label: "Favorites"
      selected: !!view.dex && view.dex.settings.defaultView === "favorites"
      onActivated: view.dex.setSetting("defaultView", "favorites")
    }
  }

  PanelSeparator { width: parent.width; foreground: view.fg }

  PanelSectionHeader {
    width: parent.width
    text: "DATA"
    foreground: view.fg
    fontFamily: view.family
  }

  Flow {
    width: parent.width
    spacing: Style.spacing.xs

    SettingsButton {
      fg: view.fg
      family: view.family
      label: "Clear recents"
      confirmLabel: "Confirm clear"
      needsConfirm: true
      onActivated: view.dex.clearRecents()
    }

    SettingsButton {
      fg: view.fg
      family: view.family
      label: "Clear favorites"
      confirmLabel: "Confirm clear"
      needsConfirm: true
      onActivated: view.dex.clearFavorites()
    }

    SettingsButton {
      fg: view.fg
      family: view.family
      label: "Clear cached data"
      confirmLabel: "Confirm clear"
      needsConfirm: true
      onActivated: view.dex.clearCache()
    }
  }

  Text {
    textFormat: Text.PlainText
    width: parent.width
    text: "Cached data is downloaded again the next time you look a Pokémon up. "
      + "Recents, favorites and these settings are kept."
    wrapMode: Text.WordWrap
    color: view.dim
    font.family: view.family
    font.pixelSize: Style.font.caption
  }
}
