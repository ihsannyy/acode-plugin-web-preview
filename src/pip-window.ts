import type { PipState, PipElements } from "./types";
import { getStyles } from "./styles";

const svg = (inner: string) => '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';
const svgF = (inner: string) => '<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' + inner + '</svg>';

const ICO = {
  logo: svg('<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>'),
  mobile: svgF('<rect x="5" y="2" width="14" height="20" rx="2" ry="2"/><path d="M12 18h.01"/>'),
  tablet: svgF('<rect x="4" y="2" width="16" height="20" rx="2" ry="2"/><path d="M12 18h.01"/>'),
  desktop: svgF('<rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><path d="M8 21h8"/><path d="M12 17v4"/>'),
  custom: svgF('<path d="M4 21v-7"/><path d="M4 10V3"/><path d="M12 21v-9"/><path d="M12 8V3"/><path d="M20 21v-5"/><path d="M20 11V3"/><path d="M1 14h6"/><path d="M9 8h6"/><path d="M17 16h6"/>'),
  reload: svg('<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>'),
  external: svg('<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>'),
  minimize: svgF('<line x1="5" y1="12" x2="19" y2="12"/>'),
  maximize: svgF('<rect x="3" y="3" width="18" height="18" rx="2"/>'),
  restore: svgF('<rect x="3" y="3" width="18" height="18" rx="2"/><rect x="7" y="7" width="14" height="14" rx="2" fill="#1e1e2e"/>'),
  fullscreen: svg('<polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/><line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>'),
  close: svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
  go: svg('<line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/>'),
  clear: svg('<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>'),
  back: svg('<polyline points="15 18 9 12 15 6"/>'),
  forward: svg('<polyline points="9 18 15 12 9 6"/>'),
  console: svg('<polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/>'),
  zoomIn: svg('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="11" y1="8" x2="11" y2="14"/><line x1="8" y1="11" x2="14" y2="11"/>'),
  zoomOut: svg('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><line x1="8" y1="11" x2="14" y2="11"/>'),
  emptyPreview: '<svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/><path d="M9 10l2 2 4-4"/></svg>',
  resizeHandle: '<svg width="10" height="10" viewBox="0 0 10 10"><path d="M6 10L10 6M2 10L10 2" stroke="#6c7086" stroke-width="1.5" stroke-linecap="round"/></svg>',
};

export function createPipWindow(state: PipState): PipElements | null {
  const existing = document.getElementById("web-preview-pip");
  if (existing) existing.remove();

  const pip = document.createElement("div");
  pip.id = "web-preview-pip";
  pip.style.display = state.visible ? "flex" : "none";

  const zoomPct = state.zoom || 100;
  const cw = state.customViewportWidth || 480;
  const isMax = state.maximized;

  pip.innerHTML =
    '<style>' + getStyles() + '</style>' +

    /* Row 1: Title + Window Controls */
    '<div class="pip-header">' +
      '<span class="pip-title">' + ICO.logo + ' Web Preview</span>' +
      '<div class="pip-controls">' +
        '<button class="pip-btn pip-console-toggle ' + (state.consoleOpen ? "active-toggle" : "") + '" title="Console">' + ICO.console + '</button>' +
        '<button class="pip-btn pip-open-ext" title="Open in Browser">' + ICO.external + '</button>' +
        '<button class="pip-btn pip-minimize" title="Minimize">' + ICO.minimize + '</button>' +
        '<button class="pip-btn pip-maximize" title="Maximize">' + (isMax ? ICO.restore : ICO.maximize) + '</button>' +
        '<button class="pip-btn pip-close" title="Close">' + ICO.close + '</button>' +
      '</div>' +
    '</div>' +

    /* Row 2: Viewport + Zoom + Reload */
    '<div class="pip-toolbar">' +
      '<div class="pip-viewport-switch">' +
        '<button class="pip-vp-btn ' + (state.viewport === "mobile" ? "active" : "") + '" data-vp="mobile" title="Mobile (375px)">' + ICO.mobile + '</button>' +
        '<button class="pip-vp-btn ' + (state.viewport === "tablet" ? "active" : "") + '" data-vp="tablet" title="Tablet (768px)">' + ICO.tablet + '</button>' +
        '<button class="pip-vp-btn ' + (state.viewport === "desktop" ? "active" : "") + '" data-vp="desktop" title="Desktop (1280px)">' + ICO.desktop + '</button>' +
        '<button class="pip-vp-btn ' + (state.viewport === "custom" ? "active" : "") + '" data-vp="custom" title="Custom width">' + ICO.custom + '</button>' +
        '<input type="number" class="pip-vp-custom-input ' + (state.viewport === "custom" ? "" : "hidden") + '" value="' + cw + '" min="200" max="1920" step="10" title="Custom width (px)" />' +
      '</div>' +
      '<div class="pip-zoom-group">' +
        '<button class="pip-btn pip-zoom-out" title="Zoom Out (-10%)">' + ICO.zoomOut + '</button>' +
        '<span class="pip-zoom-label">' + zoomPct + '%</span>' +
        '<button class="pip-btn pip-zoom-in" title="Zoom In (+10%)">' + ICO.zoomIn + '</button>' +
        '<button class="pip-btn pip-reload" title="Reload">' + ICO.reload + '</button>' +
      '</div>' +
    '</div>' +

    /* URL Bar */
    '<div class="pip-sub-header">' +
      '<div class="pip-url-bar">' +
        '<button class="pip-btn pip-url-back" title="Back" disabled>' + ICO.back + '</button>' +
        '<button class="pip-btn pip-url-forward" title="Forward" disabled>' + ICO.forward + '</button>' +
        '<input type="text" class="pip-url-input" value="' + (state.urlMode && state.url ? state.url : "") + '" placeholder="Enter URL or leave empty for HTML file..." spellcheck="false" />' +
        '<button class="pip-btn pip-url-go ' + (state.urlMode && state.url ? "hidden" : "") + '" title="Go">' + ICO.go + '</button>' +
        '<button class="pip-btn pip-url-clear ' + (state.urlMode && state.url ? "" : "hidden") + '" title="Clear URL">' + ICO.clear + '</button>' +
      '</div>' +
    '</div>' +
    '<div class="pip-loading-bar"></div>' +

    /* Body */
    '<div class="pip-body">' +
      '<iframe id="pip-iframe" sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups allow-downloads allow-top-navigation-by-user-activation allow-pointer-lock"></iframe>' +
      '<div class="pip-empty-state">' +
        ICO.emptyPreview +
        '<p>Open an HTML file or enter a URL to preview</p>' +
      '</div>' +
    '</div>' +

    /* Console */
    '<div class="pip-console">' +
      '<div class="pip-console-header">' +
        '<span>Console</span>' +
        '<div style="display:flex;align-items:center;gap:6px;">' +
          '<span class="pip-console-count">0</span>' +
          '<button class="pip-btn pip-console-clear" title="Clear" style="width:18px;height:18px;">' + ICO.clear + '</button>' +
          '<button class="pip-btn pip-console-close" title="Close" style="width:18px;height:18px;">' + ICO.close + '</button>' +
        '</div>' +
      '</div>' +
      '<div class="pip-console-body"></div>' +
    '</div>' +

    '<div class="pip-resizer pip-resizer-r" data-dir="r"></div>' +
    '<div class="pip-resizer pip-resizer-b" data-dir="b"></div>' +
    '<div class="pip-resizer pip-resizer-se" data-dir="se" title="Resize">' + ICO.resizeHandle + '</div>';

  document.body.appendChild(pip);

  const elements: PipElements = {
    pip,
    iframe: pip.querySelector("#pip-iframe") as HTMLIFrameElement,
    header: pip.querySelector(".pip-header") as HTMLElement,
    title: pip.querySelector(".pip-title") as HTMLElement,
    urlInput: pip.querySelector(".pip-url-input") as HTMLInputElement,
    urlBar: pip.querySelector(".pip-url-bar") as HTMLElement,
    vpSwitch: pip.querySelector(".pip-viewport-switch") as HTMLElement,
    consolePanel: pip.querySelector(".pip-console") as HTMLElement,
    consoleBody: pip.querySelector(".pip-console-body") as HTMLElement,
    loadingBar: pip.querySelector(".pip-loading-bar") as HTMLElement,
    zoomLabel: pip.querySelector(".pip-zoom-label") as HTMLElement,
  };

  pip.style.display = state.visible ? "flex" : "none";
  if (state.minimized) pip.classList.add("minimized");
  if (state.maximized) pip.classList.add("maximized");
  if (state.consoleOpen) elements.consolePanel.classList.add("open");

  return elements;
}

export function removePipWindow(elements: PipElements | null): void {
  if (elements?.pip) {
    elements.pip.remove();
  }
}
