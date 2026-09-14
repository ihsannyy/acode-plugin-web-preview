import type { PipElements, PipState } from "./types";
import { refreshPreview } from "./preview";

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
  } catch { /* commands not available */ }
}
