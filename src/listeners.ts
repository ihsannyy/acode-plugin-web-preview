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
    if (updateTimer) clearTimeout(updateTimer);
    updateTimer = setTimeout(() => refreshPreview(elements, state), 200);
  };

  const onFileSwitch = () => refreshPreview(elements, state);

  try {
    editorManager.on("switch-file", onFileSwitch);
    editorManager.on("rename-file", onFileSwitch);
    editorManager.on("save-file", triggerRefresh);
    editorManager.on("file-content-changed", triggerRefresh);
    editorManager.on("update", triggerRefresh);
  } catch { /* ignore */ }

  let boundSession: any = null;
  const attachToSession = () => {
    try {
      if (boundSession && typeof boundSession.off === "function") {
        boundSession.off("change", triggerRefresh);
      }
      if (editorManager.activeFile?.session && typeof editorManager.activeFile.session.on === "function") {
        boundSession = editorManager.activeFile.session;
        boundSession.on("change", triggerRefresh);
      } else if (editorManager.editor && typeof editorManager.editor.on === "function") {
        editorManager.editor.on("change", triggerRefresh);
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
      editorManager.off("file-content-changed", triggerRefresh);
      editorManager.off("update", triggerRefresh);

      if (editorManager.editor && typeof editorManager.editor.off === "function") {
        editorManager.editor.off("change", triggerRefresh);
      }
      if (boundSession && typeof boundSession.off === "function") {
        boundSession.off("change", triggerRefresh);
      }
    } catch { /* ignore */ }
  };
}
