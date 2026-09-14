import plugin from "../plugin.json";
import type { PipElements, PipState } from "./types";
import { loadState, saveState, resetState } from "./state";
import { createPipWindow, removePipWindow } from "./pip-window";
import { setupDrag, applyPosition } from "./drag";
import { setupControls, toggleMinimize, toggleMaximize, forceClose } from "./controls";
import { setupViewport } from "./viewport";
import { refreshPreview } from "./preview";
import { attachEditorListeners } from "./listeners";

class WebPreviewPip {
  private elements: PipElements | null = null;
  private state: PipState;
  private cleanupListeners: (() => void) | null = null;

  constructor() {
    this.state = loadState();
  }

  async init(_page: Acode.WCPage, _cacheFile: Acode.FileSystem, _cacheFileUrl: string): Promise<void> {
    console.log("Web Preview PiP: init called");
    this.elements = createPipWindow(this.state);
    if (!this.elements) {
      console.error("Web Preview PiP: createPipWindow returned null");
      return;
    }

    applyPosition(this.elements, this.state);
    setupDrag(this.elements, this.state, () => saveState(this.state));
    setupControls(this.elements, this.state, {
      onMinimize: () => { toggleMinimize(this.elements!, this.state); saveState(this.state); },
      onMaximize: () => { toggleMaximize(this.elements!, this.state); saveState(this.state); },
      onClose: () => this.hide(),
    });
    setupViewport(this.elements, this.state, () => {
      saveState(this.state);
      refreshPreview(this.elements!, this.state);
    });
    this.cleanupListeners = attachEditorListeners(this.elements, this.state);

    // Force show PiP for testing
    this.state.visible = true;
    this.elements.pip.style.display = "";
    applyPosition(this.elements, this.state);
    saveState(this.state);

    try {
      const toast = (window as any).acode.require("toast");
      if (toast) toast("Web Preview PiP v1.0.8 loaded!", 5000);
    } catch { /* ignore */ }
  }

  async destroy(): Promise<void> {
    this.cleanupListeners?.();
    if (this.elements) removePipWindow(this.elements);
  }

  show(): void {
    if (!this.elements) return;
    this.state.visible = true;
    applyPosition(this.elements, this.state);
    this.elements.pip.style.display = "";
    refreshPreview(this.elements, this.state);
    saveState(this.state);
  }

  hide(): void {
    if (!this.elements) return;
    this.state.visible = false;
    this.elements.pip.style.display = "none";
    saveState(this.state);
  }

  forceClose(): void {
    if (!this.elements) return;
    forceClose(this.elements, this.state);
    saveState(this.state);
  }

  forceReset(): void {
    this.state = resetState();
    this.forceClose();
  }
}

if (window.acode) {
  console.log("Web Preview PiP: window.acode found");
  const acodePlugin = new WebPreviewPip();

  acode.setPluginInit(
    plugin.id,
    async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
      console.log("Web Preview PiP: setPluginInit callback called");
      (acodePlugin as any)["baseUrl"] = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      await acodePlugin.init($page, cacheFile, cacheFileUrl);
    },
  );

  acode.setPluginUnmount(plugin.id, () => {
    void acodePlugin.destroy();
  });
} else {
  console.error("Web Preview PiP: window.acode not found!");
}
