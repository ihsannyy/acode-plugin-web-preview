import type { PipElements, PipState } from "./types";

export function registerSideButton(
  toggle: () => void
): { show: () => void; hide: () => void } | null {
  try {
    const SideButton = (window as any).acode.require("sideButton");
    if (!SideButton) return null;
    const btn = SideButton({
      text: "Web Preview",
      icon: "eye",
      onclick: toggle,
      action: toggle,
      backgroundColor: "var(--accent-color, #89b4fa)",
      textColor: "#1e1e2e",
    });
    if (btn && typeof btn.show === "function") {
      btn.show();
    }
    return btn;
  } catch {
    return null;
  }
}

export function registerCommands(
  elements: PipElements,
  state: PipState,
  callbacks: {
    onToggle: () => void;
    onForceClose: () => void;
    onForceReset: () => void;
    onZoomIn: () => void;
    onZoomOut: () => void;
    onToggleConsole: () => void;
    onFullscreen: () => void;
  }
): void {
  try {
    const commands = (window as any).acode.require("commands");
    if (!commands) return;

    commands.addCommand({
      name: "web-preview-pip.toggle",
      description: "Web Preview PiP: Toggle Preview",
      bindKey: { win: "Ctrl-Shift-P", mac: "Command-Shift-P" },
      exec: callbacks.onToggle,
    });

    commands.addCommand({
      name: "web-preview-pip.close",
      description: "Web Preview PiP: Force Close",
      bindKey: { win: "Ctrl-Shift-X", mac: "Command-Shift-X" },
      exec: callbacks.onForceClose,
    });

    commands.addCommand({
      name: "web-preview-pip.reset",
      description: "Web Preview PiP: Reset & Close",
      bindKey: { win: "Ctrl-Shift-R", mac: "Command-Shift-R" },
      exec: callbacks.onForceReset,
    });

    commands.addCommand({
      name: "web-preview-pip.zoomIn",
      description: "Web Preview PiP: Zoom In",
      bindKey: { win: "Ctrl-Shift-=", mac: "Command-Shift-=" },
      exec: callbacks.onZoomIn,
    });

    commands.addCommand({
      name: "web-preview-pip.zoomOut",
      description: "Web Preview PiP: Zoom Out",
      bindKey: { win: "Ctrl-Shift--", mac: "Command-Shift--" },
      exec: callbacks.onZoomOut,
    });

    commands.addCommand({
      name: "web-preview-pip.console",
      description: "Web Preview PiP: Toggle Console",
      bindKey: { win: "Ctrl-Shift-`", mac: "Command-Shift-`" },
      exec: callbacks.onToggleConsole,
    });

    commands.addCommand({
      name: "web-preview-pip.fullscreen",
      description: "Web Preview PiP: Toggle Fullscreen",
      bindKey: { win: "F11", mac: "F11" },
      exec: callbacks.onFullscreen,
    });
  } catch { /* commands not available */ }
}
