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

  const filename = activeFile.filename || "";
  if (!/\.(html?|htm)$/i.test(filename)) {
    showEmptyState(elements, true);
    return;
  }

  showEmptyState(elements, false);
  const doc = editorManager.editor?.state?.doc;
  if (!doc) return;
  renderToIframe(elements, state, doc.toString());
}

function renderToIframe(
  elements: PipElements,
  state: PipState,
  html: string
): void {
  const { iframe, pip } = elements;
  const vp = VIEWPORTS[state.viewport];
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

  iframe.srcdoc = content;
  if (state.maximized) {
    iframe.style.width = "100%";
    iframe.style.height = "100%";
  } else {
    iframe.style.width = `${vp.width}px`;
    iframe.style.height = "100%";
    pip.style.width = `${vp.width + 2}px`;
  }
}

function showEmptyState(elements: PipElements, show: boolean): void {
  const empty = elements.pip.querySelector(".pip-empty-state") as HTMLElement;
  if (empty) empty.style.display = show ? "" : "none";
  if (elements.iframe) elements.iframe.style.display = show ? "none" : "";
}
