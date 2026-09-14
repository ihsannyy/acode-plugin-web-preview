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

  const onFileSwitch = () => refreshPreview(elements, state);

  const onContentChange = () => {
    if (updateTimer) clearTimeout(updateTimer);
    updateTimer = setTimeout(() => refreshPreview(elements, state), 300);
  };

  editorManager.on("switch-file", onFileSwitch);
  editorManager.on("file-content-changed", onContentChange);

  return () => {
    if (updateTimer) clearTimeout(updateTimer);
    editorManager.off("switch-file", onFileSwitch);
    editorManager.off("file-content-changed", onContentChange);
  };
}
