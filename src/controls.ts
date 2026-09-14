import type { PipElements, PipState } from "./types";
import { applyPosition } from "./drag";

export function setupControls(
  elements: PipElements,
  state: PipState,
  callbacks: {
    onMinimize: () => void;
    onMaximize: () => void;
    onClose: () => void;
  }
): void {
  const { pip } = elements;

  pip.querySelector(".pip-close")?.addEventListener("click", callbacks.onClose);
  pip.querySelector(".pip-minimize")?.addEventListener("click", callbacks.onMinimize);
  pip.querySelector(".pip-maximize")?.addEventListener("click", callbacks.onMaximize);
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
