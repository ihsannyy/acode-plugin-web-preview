import type { PipElements, PipState } from "./types";
import { applyPosition } from "./drag";
import { applyZoom, showLoading } from "./preview";

export function setupControls(
  elements: PipElements,
  state: PipState,
  callbacks: {
    onMinimize: () => void;
    onMaximize: () => void;
    onClose: () => void;
    onSaveState: () => void;
    onRefresh: () => void;
    onConsoleToggle: () => void;
  }
): void {
  const { pip, urlInput } = elements;

  pip.querySelector(".pip-close")?.addEventListener("click", callbacks.onClose);
  pip.querySelector(".pip-minimize")?.addEventListener("click", callbacks.onMinimize);
  pip.querySelector(".pip-maximize")?.addEventListener("click", callbacks.onMaximize);

  const urlClearBtn = pip.querySelector(".pip-url-clear");
  const urlGoBtn = pip.querySelector(".pip-url-go");

  const clearUrlMode = () => {
    state.urlMode = false;
    state.url = "";
    if (urlInput) urlInput.value = "";
    urlClearBtn?.classList.add("hidden");
    urlGoBtn?.classList.remove("hidden");
    callbacks.onSaveState();
    callbacks.onRefresh();
  };

  urlClearBtn?.addEventListener("click", clearUrlMode);

  const handleUrlSubmit = () => {
    if (!urlInput) return;
    let val = urlInput.value.trim();
    if (val) {
      if (!/^https?:\/\//i.test(val) && !/^file:\/\//i.test(val)) {
        val = `http://${val}`;
        urlInput.value = val;
      }
      state.urlMode = true;
      state.url = val;

      if (state.urlHistory[state.urlHistoryIndex] !== val) {
        state.urlHistory = state.urlHistory.slice(0, state.urlHistoryIndex + 1);
        state.urlHistory.push(val);
        state.urlHistoryIndex = state.urlHistory.length - 1;
        if (state.urlHistory.length > 50) {
          state.urlHistory.shift();
          state.urlHistoryIndex--;
        }
      }

      urlClearBtn?.classList.remove("hidden");
      urlGoBtn?.classList.add("hidden");
    } else {
      clearUrlMode();
      return;
    }
    callbacks.onSaveState();
    callbacks.onRefresh();
    updateHistoryButtons(elements, state);
  };

  urlInput?.addEventListener("keydown", (e) => {
    e.stopPropagation();
    if (e.key === "Enter") {
      e.preventDefault();
      handleUrlSubmit();
    }
  });
  urlInput?.addEventListener("keyup", (e) => e.stopPropagation());
  urlInput?.addEventListener("keypress", (e) => e.stopPropagation());

  urlGoBtn?.addEventListener("click", handleUrlSubmit);

  pip.querySelector(".pip-reload")?.addEventListener("click", () => {
    callbacks.onRefresh();
  });

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

  pip.querySelector(".pip-console-toggle")?.addEventListener("click", callbacks.onConsoleToggle);
  pip.querySelector(".pip-console-close")?.addEventListener("click", callbacks.onConsoleToggle);
  pip.querySelector(".pip-console-clear")?.addEventListener("click", () => {
    elements.consoleBody.innerHTML = "";
    updateConsoleCount(elements, 0);
  });

  pip.querySelector(".pip-zoom-in")?.addEventListener("click", () => {
    state.zoom = Math.min(200, (state.zoom || 100) + 10);
    applyZoom(elements, state);
    callbacks.onSaveState();
  });

  pip.querySelector(".pip-zoom-out")?.addEventListener("click", () => {
    state.zoom = Math.max(50, (state.zoom || 100) - 10);
    applyZoom(elements, state);
    callbacks.onSaveState();
  });

  pip.querySelector(".pip-fullscreen")?.addEventListener("click", () => {
    toggleFullscreen(elements, state);
    callbacks.onSaveState();
  });

  const backBtn = pip.querySelector(".pip-url-back") as HTMLElement;
  const fwdBtn = pip.querySelector(".pip-url-forward") as HTMLElement;

  backBtn?.addEventListener("click", () => {
    if (state.urlHistoryIndex > 0) {
      state.urlHistoryIndex--;
      const url = state.urlHistory[state.urlHistoryIndex];
      if (url && urlInput) {
        state.url = url;
        state.urlMode = true;
        urlInput.value = url;
        urlClearBtn?.classList.remove("hidden");
        urlGoBtn?.classList.add("hidden");
        callbacks.onRefresh();
        updateHistoryButtons(elements, state);
        callbacks.onSaveState();
      }
    }
  });

  fwdBtn?.addEventListener("click", () => {
    if (state.urlHistoryIndex < state.urlHistory.length - 1) {
      state.urlHistoryIndex++;
      const url = state.urlHistory[state.urlHistoryIndex];
      if (url && urlInput) {
        state.url = url;
        state.urlMode = true;
        urlInput.value = url;
        urlClearBtn?.classList.remove("hidden");
        urlGoBtn?.classList.add("hidden");
        callbacks.onRefresh();
        updateHistoryButtons(elements, state);
        callbacks.onSaveState();
      }
    }
  });

  updateHistoryButtons(elements, state);

  elements.iframe?.addEventListener("load", () => {
    showLoading(elements, false);
  });
}

export function toggleMinimize(elements: PipElements, state: PipState): void {
  state.minimized = !state.minimized;
  elements.pip.classList.toggle("minimized", state.minimized);
  if (state.minimized) {
    state.maximized = false;
    state.fullscreen = false;
    elements.pip.classList.remove("maximized", "fullscreen");
  }
}

export function toggleMaximize(elements: PipElements, state: PipState): void {
  state.maximized = !state.maximized;
  state.minimized = false;
  state.fullscreen = false;
  elements.pip.classList.toggle("maximized", state.maximized);
  elements.pip.classList.remove("minimized", "fullscreen");
  applyPosition(elements, state);
}

export function toggleFullscreen(elements: PipElements, state: PipState): void {
  state.fullscreen = !state.fullscreen;
  state.minimized = false;
  state.maximized = false;
  elements.pip.classList.toggle("fullscreen", state.fullscreen);
  elements.pip.classList.remove("minimized", "maximized");
  applyPosition(elements, state);
}

export function forceClose(elements: PipElements, state: PipState): void {
  state.visible = false;
  state.minimized = false;
  state.maximized = false;
  state.fullscreen = false;
  elements.pip.style.display = "none";
  elements.pip.classList.remove("minimized", "maximized", "fullscreen");
  applyPosition(elements, state);
}

function updateHistoryButtons(elements: PipElements, state: PipState): void {
  const backBtn = elements.pip.querySelector(".pip-url-back") as HTMLButtonElement;
  const fwdBtn = elements.pip.querySelector(".pip-url-forward") as HTMLButtonElement;
  if (backBtn) backBtn.disabled = state.urlHistoryIndex <= 0;
  if (fwdBtn) fwdBtn.disabled = state.urlHistoryIndex >= state.urlHistory.length - 1;
}

export function updateConsoleCount(elements: PipElements, count: number): void {
  const badge = elements.pip.querySelector(".pip-console-count");
  if (badge) {
    badge.textContent = String(count);
    badge.classList.toggle("has-errors", count > 0);
  }
}
