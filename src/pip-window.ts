import type { PipState, PipElements } from "./types";
import { getStyles } from "./styles";

export function createPipWindow(state: PipState): PipElements | null {
  const existing = document.getElementById("web-preview-pip");
  if (existing) existing.remove();

  const pip = document.createElement("div");
  pip.id = "web-preview-pip";
  pip.style.display = state.visible ? "flex" : "none";
  pip.innerHTML = `
    <style>${getStyles()}</style>
    <div class="pip-header">
      <span class="pip-title">Web Preview</span>
      <div class="pip-viewport-switch">
        <button class="pip-vp-btn ${state.viewport === "mobile" ? "active" : ""}" data-vp="mobile" title="Mobile (375px)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
        </button>
        <button class="pip-vp-btn ${state.viewport === "tablet" ? "active" : ""}" data-vp="tablet" title="Tablet (768px)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
        </button>
        <button class="pip-vp-btn ${state.viewport === "desktop" ? "active" : ""}" data-vp="desktop" title="Desktop (1280px)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </button>
      </div>
      <div class="pip-controls">
        <button class="pip-btn pip-reload" title="Reload Preview">🔄</button>
        <button class="pip-btn pip-open-ext" title="Open in External Browser">↗️</button>
        <button class="pip-btn pip-minimize" title="Minimize">_</button>
        <button class="pip-btn pip-maximize" title="Maximize">□</button>
        <button class="pip-btn pip-close" title="Close">×</button>
      </div>
    </div>
    <div class="pip-sub-header">
      <div class="pip-url-bar active">
        <input type="text" class="pip-url-input" value="${state.urlMode && state.url ? state.url : ""}" placeholder="Enter URL (or leave empty for HTML file)..." spellcheck="false" />
        <button class="pip-btn pip-url-go ${state.urlMode && state.url ? "hidden" : ""}" title="Go to URL">↵</button>
        <button class="pip-btn pip-url-clear ${state.urlMode && state.url ? "" : "hidden"}" title="Clear URL & return to HTML File preview">✕</button>
      </div>
    </div>
    <div class="pip-body">
      <iframe id="pip-iframe" sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups allow-downloads allow-top-navigation-by-user-activation allow-pointer-lock"></iframe>
      <div class="pip-empty-state">
        <p>Open an HTML file or enter a local URL to preview</p>
      </div>
    </div>
    <div class="pip-resizer pip-resizer-r" data-dir="r"></div>
    <div class="pip-resizer pip-resizer-b" data-dir="b"></div>
    <div class="pip-resizer pip-resizer-se" data-dir="se" title="Resize">
      <svg width="10" height="10" viewBox="0 0 10 10">
        <path d="M6 10L10 6M2 10L10 2" stroke="#6c7086" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>
  `;

  document.body.appendChild(pip);

  const elements: PipElements = {
    pip,
    iframe: pip.querySelector("#pip-iframe") as HTMLIFrameElement,
    header: pip.querySelector(".pip-header") as HTMLElement,
    title: pip.querySelector(".pip-title") as HTMLElement,
    urlInput: pip.querySelector(".pip-url-input") as HTMLInputElement,
    urlBar: pip.querySelector(".pip-url-bar") as HTMLElement,
    vpSwitch: pip.querySelector(".pip-viewport-switch") as HTMLElement,
  };

  pip.style.display = state.visible ? "flex" : "none";
  if (state.minimized) pip.classList.add("minimized");
  if (state.maximized) pip.classList.add("maximized");

  return elements;
}

export function removePipWindow(elements: PipElements | null): void {
  if (elements?.pip) {
    elements.pip.remove();
  }
}
