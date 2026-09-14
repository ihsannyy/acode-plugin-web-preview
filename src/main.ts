import plugin from "../plugin.json";

interface PipState {
  visible: boolean;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  viewport: "mobile" | "tablet" | "desktop";
}

const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
};

const STORAGE_KEY = "web-preview-pip-state";

class WebPreviewPip {
  private baseUrl = "";
  private $pip: HTMLElement | null = null;
  private $iframe: HTMLIFrameElement | null = null;
  private $header: HTMLElement | null = null;
  private $title: HTMLElement | null = null;
  private sideButton: { show: () => void; hide: () => void } | null = null;
  private updateTimer: ReturnType<typeof setTimeout> | null = null;
  private isDragging = false;
  private dragOffset = { x: 0, y: 0 };
  private state: PipState = {
    visible: false,
    minimized: false,
    maximized: false,
    x: 20,
    y: 80,
    width: 350,
    height: 250,
    viewport: "mobile",
  };
  private boundOnFileSwitch: (() => void) | null = null;
  private boundOnContentChange: (() => void) | null = null;

  async init(_page: Acode.WCPage, _cacheFile: Acode.FileSystem, _cacheFileUrl: string): Promise<void> {
    this.loadState();
    this.createPipWindow();
    this.registerSideButton();
    this.registerCommands();
    this.attachEditorListeners();
  }

  async destroy(): Promise<void> {
    if (this.updateTimer) clearTimeout(this.updateTimer);
    this.removeEditorListeners();
    this.removePipWindow();
    this.sideButton?.hide();
  }

  private loadState(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.state = { ...this.state, ...parsed };
      }
    } catch { /* use defaults */ }
    this.state.visible = false;
    this.state.minimized = false;
    this.state.maximized = false;
    const maxW = window.innerWidth - 20;
    const maxH = window.innerHeight - 20;
    this.state.width = Math.max(200, Math.min(this.state.width || 350, maxW));
    this.state.height = Math.max(150, Math.min(this.state.height || 250, maxH));
    this.state.x = Math.max(0, Math.min(this.state.x || 20, maxW - 100));
    this.state.y = Math.max(0, Math.min(this.state.y || 80, maxH - 50));
  }

  private saveState(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state));
    } catch { /* ignore */ }
  }

  private createPipWindow(): void {
    if (this.$pip) return;
    const pip = document.createElement("div");
    pip.id = "web-preview-pip";
    pip.style.display = "none";
    pip.innerHTML = `
      <style>${this.getStyles()}</style>
      <div class="pip-header">
        <span class="pip-title">Web Preview</span>
        <div class="pip-viewport-switch">
          <button class="pip-vp-btn active" data-vp="mobile" title="Mobile (375px)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
          </button>
          <button class="pip-vp-btn" data-vp="tablet" title="Tablet (768px)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
          </button>
          <button class="pip-vp-btn" data-vp="desktop" title="Desktop (1280px)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
          </button>
        </div>
        <div class="pip-controls">
          <button class="pip-btn pip-minimize" title="Minimize">_</button>
          <button class="pip-btn pip-maximize" title="Maximize">□</button>
          <button class="pip-btn pip-close" title="Close">×</button>
        </div>
      </div>
      <div class="pip-body">
        <iframe id="pip-iframe" sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"></iframe>
        <div class="pip-empty-state">
          <p>Open an HTML file to preview</p>
        </div>
      </div>
    `;
    document.body.appendChild(pip);
    this.$pip = pip;
    this.$iframe = pip.querySelector("#pip-iframe") as HTMLIFrameElement;
    this.$header = pip.querySelector(".pip-header") as HTMLElement;
    this.$title = pip.querySelector(".pip-title") as HTMLElement;
    this.applyPosition();
    this.setupDrag();
    this.setupControls();
    if (this.state.visible) pip.style.display = "";
    if (this.state.minimized) pip.classList.add("minimized");
    if (this.state.maximized) pip.classList.add("maximized");
  }

  private removePipWindow(): void {
    if (this.$pip) {
      this.$pip.remove();
      this.$pip = null;
      this.$iframe = null;
      this.$header = null;
      this.$title = null;
    }
  }

  private getStyles(): string {
    return `
      #web-preview-pip {
        position: fixed;
        z-index: 99999;
        background: #1e1e2e;
        border: 1px solid #45475a;
        border-radius: 10px;
        box-shadow: 0 8px 32px rgba(0,0,0,0.5);
        overflow: hidden;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        color: #cdd6f4;
        transition: border-radius 0.2s;
        min-width: 200px;
        min-height: 150px;
        display: none;
      }
      #web-preview-pip.minimized {
        width: 180px !important;
        height: auto !important;
        min-width: 180px;
        min-height: auto;
        resize: none;
        border-radius: 8px;
      }
      #web-preview-pip.minimized .pip-body {
        display: none;
      }
      #web-preview-pip.maximized {
        width: 100vw !important;
        height: 100vh !important;
        top: 0 !important;
        left: 0 !important;
        border-radius: 0;
        border: none;
        resize: none;
      }
      .pip-header {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 6px 8px;
        background: #181825;
        cursor: move;
        user-select: none;
        -webkit-user-select: none;
      }
      .pip-title {
        flex: 1;
        font-size: 11px;
        font-weight: 600;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        color: #a6adc8;
      }
      .pip-viewport-switch {
        display: flex;
        gap: 2px;
      }
      .pip-vp-btn {
        background: transparent;
        border: none;
        color: #6c7086;
        cursor: pointer;
        padding: 3px;
        border-radius: 4px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
      }
      .pip-vp-btn:hover {
        background: #313244;
        color: #cdd6f4;
      }
      .pip-vp-btn.active {
        color: #89b4fa;
        background: #313244;
      }
      .pip-controls {
        display: flex;
        gap: 2px;
      }
      .pip-btn {
        background: transparent;
        border: none;
        color: #6c7086;
        cursor: pointer;
        width: 22px;
        height: 22px;
        border-radius: 4px;
        font-size: 12px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.15s;
        font-weight: bold;
      }
      .pip-btn:hover {
        background: #313244;
        color: #cdd6f4;
      }
      .pip-close:hover {
        background: #f38ba8;
        color: #1e1e2e;
      }
      .pip-body {
        position: relative;
        width: 100%;
        height: calc(100% - 34px);
      }
      #web-preview-pip.maximized .pip-body {
        height: calc(100vh - 34px);
      }
      #pip-iframe {
        width: 100%;
        height: 100%;
        border: none;
        background: #fff;
      }
      .pip-empty-state {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        color: #6c7086;
        font-size: 13px;
        pointer-events: none;
      }
    `;
  }

  private setupDrag(): void {
    if (!this.$header) return;
    const onStart = (clientX: number, clientY: number) => {
      if (this.state.maximized) return;
      this.isDragging = true;
      this.dragOffset.x = clientX - this.state.x;
      this.dragOffset.y = clientY - this.state.y;
    };
    this.$header.addEventListener("mousedown", (e) => {
      if ((e.target as HTMLElement).closest(".pip-controls") || (e.target as HTMLElement).closest(".pip-viewport-switch")) return;
      onStart(e.clientX, e.clientY);
    });
    this.$header.addEventListener("touchstart", (e) => {
      if ((e.target as HTMLElement).closest(".pip-controls") || (e.target as HTMLElement).closest(".pip-viewport-switch")) return;
      onStart(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    const onMove = (clientX: number, clientY: number) => {
      if (!this.isDragging) return;
      this.state.x = clientX - this.dragOffset.x;
      this.state.y = clientY - this.dragOffset.y;
      this.applyPosition();
    };
    document.addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY));
    document.addEventListener("touchmove", (e) => {
      onMove(e.touches[0].clientX, e.touches[0].clientY);
    }, { passive: true });
    const onEnd = () => {
      if (this.isDragging) {
        this.isDragging = false;
        this.saveState();
      }
    };
    document.addEventListener("mouseup", onEnd);
    document.addEventListener("touchend", onEnd);
  }

  private applyPosition(): void {
    if (!this.$pip) return;
    if (this.state.maximized) {
      this.$pip.style.top = "0";
      this.$pip.style.left = "0";
      this.$pip.style.width = "100vw";
      this.$pip.style.height = "100vh";
      return;
    }
    const x = isNaN(this.state.x) ? 20 : this.state.x;
    const y = isNaN(this.state.y) ? 80 : this.state.y;
    const w = isNaN(this.state.width) ? 350 : this.state.width;
    const h = isNaN(this.state.height) ? 250 : this.state.height;
    this.$pip.style.top = `${y}px`;
    this.$pip.style.left = `${x}px`;
    this.$pip.style.width = `${w}px`;
    this.$pip.style.height = `${h}px`;
  }

  private setupControls(): void {
    if (!this.$pip) return;
    const closeBtn = this.$pip.querySelector(".pip-close");
    const minBtn = this.$pip.querySelector(".pip-minimize");
    const maxBtn = this.$pip.querySelector(".pip-maximize");
    const vpBtns = this.$pip.querySelectorAll(".pip-vp-btn");
    closeBtn?.addEventListener("click", () => this.hide());
    minBtn?.addEventListener("click", () => this.toggleMinimize());
    maxBtn?.addEventListener("click", () => this.toggleMaximize());
    vpBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const vp = (btn as HTMLElement).dataset.vp as keyof typeof VIEWPORTS;
        if (vp) this.setViewport(vp);
      });
    });
  }

  private setViewport(vp: keyof typeof VIEWPORTS): void {
    this.state.viewport = vp;
    this.$pip?.querySelectorAll(".pip-vp-btn").forEach((btn) => {
      btn.classList.toggle("active", (btn as HTMLElement).dataset.vp === vp);
    });
    if (!this.state.maximized) {
      const { width, height } = VIEWPORTS[vp];
      this.state.width = Math.min(width, window.innerWidth - 20);
      this.state.height = Math.min(height, window.innerHeight - 20);
      this.applyPosition();
    }
    this.saveState();
    this.refreshPreview();
  }

  private toggleMinimize(): void {
    if (!this.$pip) return;
    this.state.minimized = !this.state.minimized;
    this.$pip.classList.toggle("minimized", this.state.minimized);
    if (this.state.minimized) {
      this.state.maximized = false;
      this.$pip.classList.remove("maximized");
    }
    this.saveState();
  }

  private toggleMaximize(): void {
    if (!this.$pip) return;
    this.state.maximized = !this.state.maximized;
    this.state.minimized = false;
    this.$pip.classList.toggle("maximized", this.state.maximized);
    this.$pip.classList.remove("minimized");
    this.applyPosition();
    this.saveState();
  }

  toggle(): void {
    if (this.state.visible) this.hide();
    else this.show();
  }

  show(): void {
    if (!this.$pip) return;
    this.state.visible = true;
    this.applyPosition();
    this.$pip.style.display = "";
    this.refreshPreview();
    this.saveState();
  }

  hide(): void {
    if (!this.$pip) return;
    this.state.visible = false;
    this.$pip.style.display = "none";
    this.saveState();
  }

  private refreshPreview(): void {
    if (!this.state.visible || !this.$iframe) return;
    const editorManager = (window as any).editorManager;
    if (!editorManager) return;
    const activeFile = editorManager.activeFile;
    if (!activeFile) {
      this.showEmptyState(true);
      return;
    }
    const filename = activeFile.filename || "";
    if (!/\.(html?|htm)$/i.test(filename)) {
      this.showEmptyState(true);
      return;
    }
    this.showEmptyState(false);
    const doc = editorManager.editor?.state?.doc;
    if (!doc) return;
    this.renderToIframe(doc.toString());
  }

  private renderToIframe(html: string): void {
    if (!this.$iframe) return;
    const vp = VIEWPORTS[this.state.viewport];
    const content = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { min-height: 100vh; }
  </style>
</head>
<body>
${html}
</body>
</html>`;
    this.$iframe.srcdoc = content;
    if (this.state.maximized) {
      this.$iframe.style.width = "100%";
      this.$iframe.style.height = "100%";
    } else {
      this.$iframe.style.width = `${vp.width}px`;
      this.$iframe.style.height = "100%";
      this.$pip!.style.width = `${vp.width + 2}px`;
    }
  }

  private showEmptyState(show: boolean): void {
    if (!this.$pip) return;
    const empty = this.$pip.querySelector(".pip-empty-state") as HTMLElement;
    if (empty) empty.style.display = show ? "" : "none";
    if (this.$iframe) this.$iframe.style.display = show ? "none" : "";
  }

  private attachEditorListeners(): void {
    const editorManager = (window as any).editorManager;
    if (!editorManager) return;
    this.boundOnFileSwitch = () => this.refreshPreview();
    this.boundOnContentChange = () => {
      if (this.updateTimer) clearTimeout(this.updateTimer);
      this.updateTimer = setTimeout(() => this.refreshPreview(), 300);
    };
    editorManager.on("switch-file", this.boundOnFileSwitch);
    editorManager.on("file-content-changed", this.boundOnContentChange);
  }

  private removeEditorListeners(): void {
    const editorManager = (window as any).editorManager;
    if (!editorManager) return;
    if (this.boundOnFileSwitch) editorManager.off("switch-file", this.boundOnFileSwitch);
    if (this.boundOnContentChange) editorManager.off("file-content-changed", this.boundOnContentChange);
  }

  private registerSideButton(): void {
    try {
      const SideButton = (window as any).acode.require("sideButton");
      if (!SideButton) return;
      const btn = SideButton({
        text: "Web Preview",
        icon: "eye",
        onclick: () => this.toggle(),
        backgroundColor: "var(--accent-color, #89b4fa)",
        textColor: "#1e1e2e",
      });
      this.sideButton = btn;
      btn.show();
    } catch { /* sideButton not available */ }
  }

  private registerCommands(): void {
    try {
      const commands = (window as any).acode.require("commands");
      if (!commands) return;
      commands.addCommand({
        name: "web-preview-pip.toggle",
        description: "Web Preview PiP: Toggle Preview",
        bindKey: { win: "Ctrl-Shift-V", mac: "Command-Shift-V" },
        exec: () => this.toggle(),
      });
      commands.addCommand({
        name: "web-preview-pip.close",
        description: "Web Preview PiP: Force Close",
        bindKey: { win: "Ctrl-Shift-Q", mac: "Command-Shift-Q" },
        exec: () => this.forceClose(),
      });
      commands.addCommand({
        name: "web-preview-pip.reset",
        description: "Web Preview PiP: Reset & Close",
        bindKey: { win: "Ctrl-Shift-;", mac: "Command-Shift-;" },
        exec: () => this.forceReset(),
      });
    } catch { /* commands not available */ }
  }

  forceClose(): void {
    if (!this.$pip) return;
    this.state.visible = false;
    this.state.minimized = false;
    this.state.maximized = false;
    this.$pip.style.display = "none";
    this.$pip.classList.remove("minimized", "maximized");
    this.applyPosition();
    this.saveState();
  }

  forceReset(): void {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
    this.state = {
      visible: false,
      minimized: false,
      maximized: false,
      x: 20,
      y: 80,
      width: 350,
      height: 250,
      viewport: "mobile",
    };
    this.forceClose();
  }
}

if (window.acode) {
  const acodePlugin = new WebPreviewPip();
  acode.setPluginInit(
    plugin.id,
    async (baseUrl, $page, { cacheFileUrl, cacheFile }) => {
      acodePlugin["baseUrl"] = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
      await acodePlugin.init($page, cacheFile, cacheFileUrl);
    },
  );
  acode.setPluginUnmount(plugin.id, () => {
    void acodePlugin.destroy();
  });
}
