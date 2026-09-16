import type { PipElements, PipState } from "./types";
import { VIEWPORTS } from "./viewport";

export function refreshPreview(
  elements: PipElements,
  state: PipState
): void {
  if (!state.visible || !elements.iframe) return;

  const { urlInput } = elements;
  const editorManager = (window as any).editorManager;
  const activeFile = editorManager?.activeFile;
  const filename = activeFile?.filename || activeFile?.name || "";

  if (!state.urlMode || !state.url.trim()) {
    if (urlInput && document.activeElement !== urlInput) {
      urlInput.value = "";
      urlInput.placeholder = filename ? `${filename}` : "Enter URL or leave empty for HTML file...";
    }
    renderActiveFile(elements, state, editorManager, activeFile, filename);
    return;
  }

  if (urlInput && document.activeElement !== urlInput) {
    urlInput.value = state.url;
  }
  renderUrl(elements, state);
}

function renderActiveFile(
  elements: PipElements,
  state: PipState,
  editorManager: any,
  activeFile: any,
  filename: string
): void {
  if (!editorManager || !activeFile) {
    showEmptyState(elements, true);
    return;
  }

  const content = getEditorContent(editorManager);

  const isHtmlExtension = /\.(html?|htm)$/i.test(filename);
  const isHtmlContent = typeof content === "string" && (
    content.trim().toLowerCase().startsWith("<!doctype html") ||
    content.trim().toLowerCase().startsWith("<html") ||
    /<[a-z][\s\S]*>/i.test(content)
  );

  if (!isHtmlExtension && !isHtmlContent) {
    showEmptyState(elements, true);
    return;
  }

  let baseUri = "";
  const uri = activeFile.uri || activeFile.location || "";
  if (uri && uri.includes("/")) {
    baseUri = uri.substring(0, uri.lastIndexOf("/") + 1);
  }

  showEmptyState(elements, false);
  showLoading(elements, true);
  renderToIframe(elements, state, content || "", baseUri);
}

function renderUrl(elements: PipElements, state: PipState): void {
  const { iframe } = elements;
  let rawUrl = (state.url || "").trim();

  if (!rawUrl) {
    showEmptyState(elements, true);
    return;
  }

  let targetUrl = rawUrl;
  if (!/^https?:\/\//i.test(targetUrl) && !/^file:\/\//i.test(targetUrl)) {
    targetUrl = `http://${targetUrl}`;
  }

  showEmptyState(elements, false);
  showLoading(elements, true);

  iframe.removeAttribute("srcdoc");

  if (iframe.src !== targetUrl) {
    iframe.src = targetUrl;
  } else {
    try {
      iframe.contentWindow?.location.reload();
    } catch {
      iframe.src = targetUrl;
    }
  }
}

function getEditorContent(editorManager: any): string | null {
  if (!editorManager) return null;
  try {
    if (typeof editorManager.editor?.getValue === "function") {
      return editorManager.editor.getValue();
    }
    if (typeof editorManager.activeFile?.session?.getValue === "function") {
      return editorManager.activeFile.session.getValue();
    }
    if (editorManager.editor?.state?.doc) {
      return editorManager.editor.state.doc.toString();
    }
    if (typeof editorManager.activeFile?.content === "string") {
      return editorManager.activeFile.content;
    }
  } catch { /* ignore */ }
  return null;
}

export function getEditorContentForFile(activeFile: any): string | null {
  if (!activeFile) return null;
  try {
    if (typeof activeFile.session?.getValue === "function") {
      return activeFile.session.getValue();
    }
    if (typeof activeFile.content === "string") {
      return activeFile.content;
    }
  } catch { /* ignore */ }
  return null;
}

function renderToIframe(
  elements: PipElements,
  state: PipState,
  html: string,
  baseUri?: string
): void {
  const { iframe, pip } = elements;
  const vp = VIEWPORTS[state.viewport];

  iframe.removeAttribute("src");

  let content = html;
  let baseTag = "";
  if (baseUri && !/<base\s/i.test(html)) {
    baseTag = `<base href="${baseUri}">\n`;
  }

  if (!/<html/i.test(html)) {
    content = `<!DOCTYPE html>
<html>
<head>
  ${baseTag}<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { min-height: 100vh; }
  </style>
</head>
<body>
${html}
</body>
</html>`;
  } else if (baseTag) {
    content = html.replace(/<head([^>]*)>/i, `<head$1>\n${baseTag}`);
  }

  iframe.srcdoc = content;
  iframe.style.display = "block";

  if (!state.maximized && !state.fullscreen) {
    let targetW: number;
    if (state.viewport === "custom") {
      targetW = Math.min(state.customViewportWidth + 40, window.innerWidth - 20);
    } else {
      targetW = Math.min(vp.width + 40, window.innerWidth - 20);
    }
    pip.style.width = targetW + "px";
  }

  const zoom = state.zoom || 100;
  if (zoom !== 100) {
    setTimeout(function() { applyZoom(elements, state); }, 50);
  }
}

function showEmptyState(elements: PipElements, show: boolean): void {
  const empty = elements.pip.querySelector(".pip-empty-state") as HTMLElement;
  if (empty) empty.style.display = show ? "flex" : "none";
  if (elements.iframe) elements.iframe.style.display = show ? "none" : "block";
}

export function showLoading(elements: PipElements, show: boolean): void {
  if (elements.loadingBar) {
    elements.loadingBar.classList.toggle("active", show);
  }
}

export function applyZoom(elements: PipElements, state: PipState): void {
  const zoom = state.zoom || 100;
  const scale = zoom / 100;
  const { iframe, pip, zoomLabel } = elements;

  if (zoomLabel) zoomLabel.textContent = zoom + "%";

  const body = pip.querySelector(".pip-body") as HTMLElement;
  if (!body) return;

  if (scale !== 1) {
    body.style.overflow = "hidden";
    iframe.style.transform = "scale(" + scale + ")";
    iframe.style.transformOrigin = "top left";
    iframe.style.width = (100 / scale) + "%";
    iframe.style.height = (100 / scale) + "%";
  } else {
    iframe.style.transform = "";
    iframe.style.transformOrigin = "";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    body.style.overflow = "";
  }
}

export function injectJsToIframe(elements: PipElements, jsCode: string): void {
  if (!elements.iframe?.contentDocument) return;
  try {
    const iframeDoc = elements.iframe.contentDocument;
    let scriptEl = iframeDoc.getElementById("acode-hot-js");
    if (scriptEl) scriptEl.remove();
    scriptEl = iframeDoc.createElement("script");
    scriptEl.id = "acode-hot-js";
    scriptEl.textContent = jsCode;
    iframeDoc.head.appendChild(scriptEl);
  } catch { /* cross-origin or other issue */ }
}

export function injectCssToIframe(elements: PipElements, cssCode: string): void {
  if (!elements.iframe?.contentDocument) return;
  try {
    const iframeDoc = elements.iframe.contentDocument;
    let styleEl = iframeDoc.getElementById("acode-hot-css");
    if (!styleEl) {
      styleEl = iframeDoc.createElement("style");
      styleEl.id = "acode-hot-css";
      iframeDoc.head.appendChild(styleEl);
    }
    styleEl.textContent = cssCode;
  } catch { /* cross-origin or other issue */ }
}
