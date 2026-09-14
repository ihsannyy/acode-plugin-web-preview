import type { PipElements, PipState } from "./types";
import { VIEWPORTS } from "./viewport";

export function refreshPreview(
  elements: PipElements,
  state: PipState
): void {
  if (!state.visible || !elements.iframe) return;

  const editorManager = (window as any).editorManager;
  if (!editorManager) return;

  const activeFile = editorManager.activeFile;
  if (!activeFile) {
    showEmptyState(elements, true);
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
    showEmptyState(elements, true);
    return;
  }

  showEmptyState(elements, false);
  renderToIframe(elements, state, content || "");
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
  html: string
): void {
  const { iframe, pip } = elements;
  const vp = VIEWPORTS[state.viewport];

  let content = html;
  if (!/<html/i.test(html)) {
    content = `<!DOCTYPE html>
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

function showEmptyState(elements: PipElements, show: boolean): void {
  const empty = elements.pip.querySelector(".pip-empty-state") as HTMLElement;
  if (empty) empty.style.display = show ? "flex" : "none";
  if (elements.iframe) elements.iframe.style.display = show ? "none" : "block";
}
