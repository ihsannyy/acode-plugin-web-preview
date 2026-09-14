import type { PipElements, PipState } from "./types";

export function registerHeaderButton(
  toggle: () => void
): { remove: () => void } | null {
  try {
    const existingBtn = document.querySelector('[action="web-preview"]');
    if (existingBtn) existingBtn.remove();

    const btn = document.createElement("span");
    btn.className = "icon eye";
    btn.setAttribute("action", "web-preview");
    btn.title = "Web Preview PiP";
    btn.style.cssText = "padding:0 8px;cursor:pointer;user-select:none;";

    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      toggle();
    };

    const header = document.querySelector("header");
    if (!header) {
      console.warn("Web Preview PiP: No header found");
      return null;
    }

    const tail = header.querySelector(".tail");
    if (tail) {
      tail.insertBefore(btn, tail.firstChild);
    } else {
      header.appendChild(btn);
    }

    return { remove: () => btn.remove() };
  } catch (e) {
    console.error("Web Preview PiP: Failed to create header button", e);
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
