import type { PipElements, PipState } from "./types";
import { refreshPreview } from "./preview";

export function registerSideButton(
  _toggle: () => void
): { show: () => void; hide: () => void } | null {
  return null;
}

export function registerCommands(
  _elements: PipElements,
  _state: PipState,
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
