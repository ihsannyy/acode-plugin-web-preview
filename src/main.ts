import plugin from "../plugin.json";
import type { PipElements, PipState } from "./types";
import { loadState, saveState, resetState } from "./state";
import { createPipWindow, removePipWindow } from "./pip-window";
import { setupDrag, applyPosition } from "./drag";
import { setupControls, toggleMinimize, toggleMaximize, toggleFullscreen, forceClose } from "./controls";
import { setupViewport } from "./viewport";
import { refreshPreview, applyZoom, showLoading } from "./preview";
import { attachEditorListeners } from "./listeners";
import { registerSideButton, registerCommands } from "./commands";

class WebPreviewPip {
  private elements: PipElements | null = null;
  private state: PipState;
  private sideButton: { show: () => void; hide: () => void } | null = null;
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
      onSaveState: () => saveState(this.state),
      onRefresh: () => refreshPreview(this.elements!, this.state),
      onConsoleToggle: () => this.toggleConsole(),
    });
    setupViewport(this.elements, this.state, () => {
      saveState(this.state);
      refreshPreview(this.elements!, this.state);
    });
    this.setupUrlBar();
    this.cleanupListeners = attachEditorListeners(this.elements, this.state);
    this.sideButton = registerSideButton(() => this.toggle());
    registerCommands(this.elements, this.state, {
      onToggle: () => this.toggle(),
      onForceClose: () => this.forceClose(),
      onForceReset: () => this.forceReset(),
      onZoomIn: () => this.zoomIn(),
      onZoomOut: () => this.zoomOut(),
      onToggleConsole: () => this.toggleConsole(),
      onFullscreen: () => this.toggleFullscreen(),
    });
  }

  async destroy(): Promise<void> {
    this.cleanupListeners?.();
    if (this.elements) removePipWindow(this.elements);
    this.sideButton?.hide();
  }

  toggle(): void {
    if (this.state.visible) this.hide();
    else this.show();
  }

  show(): void {
    if (!this.elements) return;
    this.state.visible = true;
    applyPosition(this.elements, this.state);
    this.elements.pip.style.display = "flex";
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

  private toggleConsole(): void {
    if (!this.elements) return;
    this.state.consoleOpen = !this.state.consoleOpen;
    this.elements.consolePanel.classList.toggle("open", this.state.consoleOpen);
    const toggleBtn = this.elements.pip.querySelector(".pip-console-toggle");
    toggleBtn?.classList.toggle("active-toggle", this.state.consoleOpen);
    saveState(this.state);
  }

  private zoomIn(): void {
    if (!this.elements) return;
    this.state.zoom = Math.min(200, (this.state.zoom || 100) + 10);
    applyZoom(this.elements, this.state);
    saveState(this.state);
  }

  private zoomOut(): void {
    if (!this.elements) return;
    this.state.zoom = Math.max(50, (this.state.zoom || 100) - 10);
    applyZoom(this.elements, this.state);
    saveState(this.state);
  }

  private toggleFullscreen(): void {
    if (!this.elements) return;
    toggleFullscreen(this.elements, this.state);
    saveState(this.state);
  }

  private setupUrlBar(): void {
    if (!this.elements) return;
    const { urlInput, urlBar, pip } = this.elements;

    const urlToggle = pip.querySelector(".pip-url-go");
    const editorBtn = pip.querySelector(".pip-url-clear");

    const applyUrlMode = () => {
      urlBar.classList.toggle("active", this.state.urlMode);
      if (this.state.urlMode) {
        urlInput.value = this.state.url;
      } else {
        refreshPreview(this.elements!, this.state);
      }
    };

    const loadUrl = () => {
      let url = urlInput.value.trim();
      if (!url) return;
      if (!/^https?:\/\//i.test(url)) {
        if (/^(localhost|127\.0\.0\.1|0\.0\.0\.0)/i.test(url)) {
          url = "http://" + url;
        } else {
          url = "https://" + url;
        }
      }
      this.state.url = url;
      this.state.urlMode = true;
      saveState(this.state);
      if (this.elements) {
        showLoading(this.elements, true);
        this.elements.iframe.removeAttribute("srcdoc");
        this.elements.iframe.src = url;
      }
    };

    editorBtn?.addEventListener("click", () => {
      this.state.urlMode = false;
      this.state.url = "";
      applyUrlMode();
      saveState(this.state);
    });

    urlInput.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        e.preventDefault();
        loadUrl();
      }
      e.stopPropagation();
    });

    urlInput.addEventListener("keyup", (e) => e.stopPropagation());
    urlInput.addEventListener("keypress", (e) => e.stopPropagation());

    urlToggle?.addEventListener("click", loadUrl);

    if (this.state.urlMode) applyUrlMode();
  }
}

if (window.acode) {
  try { window.acode.clearBrokenPluginMark(plugin.id); } catch {}

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
