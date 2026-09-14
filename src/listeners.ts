import type { PipElements, PipState } from "./types";
import { refreshPreview } from "./preview";

type Cleanup = () => void;

export function attachEditorListeners(
  elements: PipElements,
  state: PipState
): Cleanup {
  const editorManager = (window as any).editorManager;
  if (!editorManager) return () => {};

  let updateTimer: ReturnType<typeof setTimeout> | null = null;

  const triggerRefresh = () => {
    if (state.urlMode) return;
    if (updateTimer) clearTimeout(updateTimer);
    updateTimer = setTimeout(() => refreshPreview(elements, state), 200);
  };

  const onFileSwitch = () => {
    if (state.urlMode) return;
    refreshPreview(elements, state);
  };

  const onCssChange = () => {
    if (state.urlMode) return;
    const activeFile = editorManager.activeFile;
    if (!activeFile) return;
    const filename = activeFile.filename || activeFile.name || "";
    if (/\.css$/i.test(filename)) {
      injectCssToIframe(elements, activeFile);
    }
  };

  try {
    editorManager.on("switch-file", onFileSwitch);
    editorManager.on("rename-file", onFileSwitch);
    editorManager.on("save-file", triggerRefresh);
    editorManager.on("file-content-changed", onCssChange);
    editorManager.on("update", triggerRefresh);
  } catch { /* ignore */ }

  let boundSession: any = null;
  const attachToSession = () => {
    try {
      if (boundSession && typeof boundSession.off === "function") {
        boundSession.off("change", onCssChange);
      }
      if (editorManager.activeFile?.session && typeof editorManager.activeFile.session.on === "function") {
        boundSession = editorManager.activeFile.session;
        boundSession.on("change", onCssChange);
      } else if (editorManager.editor && typeof editorManager.editor.on === "function") {
        editorManager.editor.on("change", onCssChange);
      }
    } catch { /* ignore */ }
  };

  attachToSession();
  try {
    editorManager.on("switch-file", attachToSession);
  } catch { /* ignore */ }

  return () => {
    if (updateTimer) clearTimeout(updateTimer);
    try {
      editorManager.off("switch-file", onFileSwitch);
      editorManager.off("switch-file", attachToSession);
      editorManager.off("rename-file", onFileSwitch);
      editorManager.off("save-file", triggerRefresh);
      editorManager.off("file-content-changed", onCssChange);
      editorManager.off("update", triggerRefresh);

      if (editorManager.editor && typeof editorManager.editor.off === "function") {
        editorManager.editor.off("change", onCssChange);
      }
      if (boundSession && typeof boundSession.off === "function") {
        boundSession.off("change", onCssChange);
      }
    } catch { /* ignore */ }
  };
}

function injectCssToIframe(elements: PipElements, activeFile: any): void {
  if (!elements.iframe?.contentDocument) return;
  try {
    const content = typeof activeFile.session?.getValue === "function"
      ? activeFile.session.getValue()
      : typeof activeFile.content === "string"
        ? activeFile.content
        : null;
    if (!content) return;

    const iframeDoc = elements.iframe.contentDocument;
    let styleEl = iframeDoc.getElementById("acode-hot-css");
    if (!styleEl) {
      styleEl = iframeDoc.createElement("style");
      styleEl.id = "acode-hot-css";
      iframeDoc.head.appendChild(styleEl);
    }
    styleEl.textContent = content;
  } catch { /* cross-origin or other issue, fallback to full refresh */ }
}
