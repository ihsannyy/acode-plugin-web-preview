import type { PipElements, PipState } from "./types";
import { applyPosition } from "./drag";

export function setupControls(
  elements: PipElements,
  state: PipState,
  callbacks: {
    onMinimize: () => void;
    onMaximize: () => void;
    onClose: () => void;
    onSaveState: () => void;
    onRefresh: () => void;
  }
): void {
  const { pip, urlInput } = elements;

  pip.querySelector(".pip-close")?.addEventListener("click", callbacks.onClose);
  pip.querySelector(".pip-minimize")?.addEventListener("click", callbacks.onMinimize);
  pip.querySelector(".pip-maximize")?.addEventListener("click", callbacks.onMaximize);

  // URL input enter key & Go button
  const handleUrlSubmit = () => {
    if (!urlInput) return;
    let val = urlInput.value.trim();
    if (val) {
      if (!/^https?:\/\//i.test(val) && !/^file:\/\//i.test(val)) {
        val = `http://${val}`;
        urlInput.value = val;
      }
      state.url = val;
    } else {
      state.url = "";
    }
    callbacks.onSaveState();
    callbacks.onRefresh();
  };

  urlInput?.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUrlSubmit();
    }
  });

  pip.querySelector(".pip-url-go")?.addEventListener("click", handleUrlSubmit);

  // Reload button
  pip.querySelector(".pip-reload")?.addEventListener("click", () => {
    callbacks.onRefresh();
  });

  // Open in external browser button
  pip.querySelector(".pip-open-ext")?.addEventListener("click", () => {
    let targetUrl = state.url ? state.url.trim() : "";
    if (!targetUrl) {
      const editorManager = (window as any).editorManager;
      targetUrl = editorManager?.activeFile?.uri || editorManager?.activeFile?.location || "";
    }
    if (!targetUrl) return;

    if (!/^https?:\/\//i.test(targetUrl) && !/^file:\/\//i.test(targetUrl)) {
      targetUrl = `http://${targetUrl}`;
    }

    try {
      const system = (window as any).acode?.require("system");
      if (system?.openUrl) {
        system.openUrl(targetUrl);
      } else {
        window.open(targetUrl, "_blank");
      }
    } catch {
      window.open(targetUrl, "_blank");
    }
  });
}

export function toggleMinimize(elements: PipElements, state: PipState): void {
  state.minimized = !state.minimized;
  elements.pip.classList.toggle("minimized", state.minimized);
  if (state.minimized) {
    state.maximized = false;
    elements.pip.classList.remove("maximized");
  }
}

export function toggleMaximize(elements: PipElements, state: PipState): void {
  state.maximized = !state.maximized;
  state.minimized = false;
  elements.pip.classList.toggle("maximized", state.maximized);
  elements.pip.classList.remove("minimized");
  applyPosition(elements, state);
}

export function forceClose(elements: PipElements, state: PipState): void {
  state.visible = false;
  state.minimized = false;
  state.maximized = false;
  elements.pip.style.display = "none";
  elements.pip.classList.remove("minimized", "maximized");
  applyPosition(elements, state);
}
