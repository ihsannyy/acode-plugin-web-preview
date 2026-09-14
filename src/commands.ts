import type { PipElements, PipState } from "./types";
import { refreshPreview } from "./preview";

export function registerSideButton(
  toggle: () => void
): { show: () => void; hide: () => void } | null {
  try {
    const acode = (window as any).acode;
    if (!acode) return null;
    const SideButton = acode.require("sidebutton");
    if (!SideButton) return null;
    const btn = SideButton({
      text: "Web Preview",
      icon: "eye",
      onclick: toggle,
      backgroundColor: "var(--accent-color, #89b4fa)",
      textColor: "#1e1e2e",
    });
    if (btn) {
      btn.show();
      return btn;
    }
    return null;
  } catch (e) {
    console.error("Web Preview PiP: Failed to create side button", e);
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
      bindKey: { win: "Ctrl-Shift-V", mac: "Command-Shift-V" },
      exec: callbacks.onToggle,
    });

    commands.addCommand({
      name: "web-preview-pip.close",
      description: "Web Preview PiP: Force Close",
      bindKey: { win: "Ctrl-Shift-Q", mac: "Command-Shift-Q" },
      exec: callbacks.onForceClose,
    });

    commands.addCommand({
      name: "web-preview-pip.reset",
      description: "Web Preview PiP: Reset & Close",
      bindKey: { win: "Ctrl-Shift-;", mac: "Command-Shift-;" },
      exec: callbacks.onForceReset,
    });
  } catch { /* commands not available */ }
}
