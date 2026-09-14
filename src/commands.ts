import type { PipElements, PipState } from "./types";

export function registerSidebarApp(
  toggle: () => void
): { remove: () => void } | null {
  try {
    const acode = (window as any).acode;
    if (!acode) return null;
    const sideBarApps = acode.require("sidebarApps");
    if (!sideBarApps) return null;

    sideBarApps.add(
      "eye",
      "web-preview-pip",
      "Web Preview",
      (container: HTMLElement) => {
        container.innerHTML = `<div style="padding:8px;text-align:center;cursor:pointer;">
          <span class="icon eye" style="font-size:24px;"></span>
          <div style="font-size:11px;margin-top:4px;">Preview</div>
        </div>`;
        container.style.cursor = "pointer";
        container.addEventListener("click", toggle);
      },
      false,
      () => {}
    );

    return {
      remove: () => {
        try {
          sideBarApps.remove("web-preview-pip");
        } catch { /* ignore */ }
      },
    };
  } catch (e) {
    console.error("Web Preview PiP: Failed to register sidebar app", e);
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
