import type { PipElements, PipState } from "./types";
import { VIEWPORTS } from "./viewport";

export function refreshPreview(
  elements: PipElements,
  state: PipState
): void {
  if (!state.visible || !elements.iframe) return;

  // Handle URL mode (Local Dev Server, e.g. http://localhost:3000)
  if (state.urlMode) {
    renderUrl(elements, state);
    return;
  }

  // Handle File mode
  const editorManager = (window as any).editorManager;
  if (!editorManager) return;

  const activeFile = editorManager.activeFile;
  if (!activeFile) {
    showEmptyState(elements, true, "Open an HTML file to preview");
    return;
  }

  const filename = activeFile.filename || activeFile.name || "";
  const content = getEditorContent(editorManager);

  const isHtmlExtension = /\.(html?|htm)$/i.test(filename);
  const isHtmlContent = typeof content === "string" && (
    content.trim().toLowerCase().startsWith("<!doctype html") ||
    content.trim().toLowerCase().startsWith("<html") ||
    /<[a-z][\s\S]*>/i.test(content)
  );

  if (!isHtmlExtension && !isHtmlContent) {
    showEmptyState(elements, true, "Open an HTML file or switch to URL mode");
    return;
  }

  // Extract base URI for relative assets (CSS, JS, images)
  let baseUri = "";
  const uri = activeFile.uri || activeFile.location || "";
  if (uri && uri.includes("/")) {
    baseUri = uri.substring(0, uri.lastIndexOf("/") + 1);
  }

  showEmptyState(elements, false);
  renderToIframe(elements, state, content || "", baseUri);
}

function renderUrl(elements: PipElements, state: PipState): void {
  const { iframe } = elements;
  let rawUrl = (state.url || "").trim();

  if (!rawUrl) {
    showEmptyState(elements, true, "Enter a URL to preview (e.g. http://localhost:3000)");
    return;
  }

  let targetUrl = rawUrl;
  if (!/^https?:\/\//i.test(targetUrl) && !/^file:\/\//i.test(targetUrl)) {
    targetUrl = `http://${targetUrl}`;
  }

  showEmptyState(elements, false);

  // CRITICAL: Must remove srcdoc so browser renders iframe.src!
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

function renderToIframe(
  elements: PipElements,
  state: PipState,
  html: string,
  baseUri?: string
): void {
  const { iframe, pip } = elements;
  const vp = VIEWPORTS[state.viewport];

  // CRITICAL: Must remove src so browser renders iframe.srcdoc!
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
  iframe.style.width = "100%";
  iframe.style.height = "100%";

  if (!state.maximized) {
    const targetW = Math.min(vp.width, window.innerWidth - 20);
    pip.style.width = `${targetW}px`;
  }
}

function showEmptyState(elements: PipElements, show: boolean, message?: string): void {
  const empty = elements.pip.querySelector(".pip-empty-state") as HTMLElement;
  if (empty) {
    empty.style.display = show ? "flex" : "none";
    if (message) {
      const p = empty.querySelector("p");
      if (p) p.textContent = message;
    }
  }
  if (elements.iframe) elements.iframe.style.display = show ? "none" : "block";
}
