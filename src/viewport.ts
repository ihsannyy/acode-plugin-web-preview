import type { PipElements, PipState, ViewportSize } from "./types";
import { applyPosition } from "./drag";

export const VIEWPORTS = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
} as const;

export type ViewportKey = keyof typeof VIEWPORTS;

export function setupViewport(
  elements: PipElements,
  state: PipState,
  onRefresh: () => void
): void {
  elements.pip.querySelectorAll(".pip-vp-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const vp = (btn as HTMLElement).dataset.vp;
      if (vp && vp in VIEWPORTS) {
        setViewport(elements, state, vp as ViewportKey, onRefresh);
      }
    });
  });
}

export function setViewport(
  elements: PipElements,
  state: PipState,
  vp: ViewportKey,
  onRefresh: () => void
): void {
  state.viewport = vp;
  elements.pip.querySelectorAll(".pip-vp-btn").forEach((btn) => {
    btn.classList.toggle("active", (btn as HTMLElement).dataset.vp === vp);
  });
  if (!state.maximized) {
    const { width, height } = VIEWPORTS[vp];
    state.width = Math.min(width, window.innerWidth - 20);
    state.height = Math.min(height, window.innerHeight - 20);
    applyPosition(elements, state);
  }
  onRefresh();
}
