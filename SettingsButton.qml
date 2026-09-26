import QtQuick
import qs.Commons

// A small pill button for the settings view. With needsConfirm, the first
// click only arms it (label swaps to confirmLabel, reverting after a few
// seconds); the second click emits activated().
Rectangle {
  id: button

  property string label: ""
  property string confirmLabel: "Click again to confirm"
  property bool needsConfirm: false
  property bool selected: false
  property color fg: Color.foreground
  property string family: Style.font.family

  property bool armed: false

  signal activated()

  radius: Style.cornerRadius
  implicitWidth: caption.implicitWidth + Style.spacing.xl * 2
  implicitHeight: caption.implicitHeight + Style.spacing.sm * 2

  color: button.selected
    ? Qt.rgba(Color.accent.r, Color.accent.g, Color.accent.b, 0.16)
    : Qt.rgba(button.fg.r, button.fg.g, button.fg.b, mouse.containsMouse ? 0.12 : 0.06)
  border.color: (button.selected || button.armed) ? Color.accent : "transparent"
  border.width: 1

  onVisibleChanged: if (!visible) armed = false

  Timer {
    id: disarmTimer
    interval: 3000
    onTriggered: button.armed = false
  }

  MouseArea {
    id: mouse
    anchors.fill: parent
    hoverEnabled: true
    cursorShape: Qt.PointingHandCursor
    onClicked: {
      if (button.needsConfirm && !button.armed) {
        button.armed = true
        disarmTimer.restart()
        return
      }
      button.armed = false
      disarmTimer.stop()
      button.activated()
    }
  }

  Text {
    id: caption
    anchors.centerIn: parent
    textFormat: Text.PlainText
    text: button.armed ? button.confirmLabel : button.label
    color: button.fg
    font.family: button.family
    font.pixelSize: Style.font.bodySmall
  }
}
