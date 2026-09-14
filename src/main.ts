import plugin from "../plugin.json";
import type { PipElements, PipState } from "./types";
import { loadState, saveState, resetState } from "./state";
import { createPipWindow, removePipWindow } from "./pip-window";
import { setupDrag, applyPosition } from "./drag";
import { setupControls, toggleMinimize, toggleMaximize, forceClose } from "./controls";
import { setupViewport } from "./viewport";
import { refreshPreview } from "./preview";
import { attachEditorListeners } from "./listeners";
import { registerSidebarApp, registerCommands } from "./commands";

class WebPreviewPip {
  private elements: PipElements | null = null;
  private state: PipState;
  private sidebarApp: { remove: () => void } | null = null;
  private cleanupListeners: (() => void) | null = null;

  constructor() {
    this.state = loadState();
  }

  async init(_page: Acode.WCPage, _cacheFile: Acode.FileSystem, _cacheFileUrl: string): Promise<void> {
    this.elements = createPipWindow(this.state);
    if (!this.elements) return;

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
    this.sidebarApp = registerSidebarApp(() => this.toggle());
    registerCommands(this.elements, this.state, {
      onToggle: () => this.toggle(),
      onForceClose: () => this.forceClose(),
      onForceReset: () => this.forceReset(),
    });
  }

  async destroy(): Promise<void> {
    this.cleanupListeners?.();
    if (this.elements) removePipWindow(this.elements);
    this.sidebarApp?.remove();
  }

  toggle(): void {
    if (this.state.visible) this.hide();
    else this.show();
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
  const acodePlugin = new WebPreviewPip();

  acode.setPluginInit(
    plugin.id,
    async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
      (acodePlugin as any)["baseUrl"] = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      await acodePlugin.init($page, cacheFile, cacheFileUrl);
    },
  );

  acode.setPluginUnmount(plugin.id, () => {
    void acodePlugin.destroy();
  });
}
