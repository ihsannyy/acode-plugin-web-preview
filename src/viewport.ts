import type { PipElements, PipState, ViewportSize } from "./types";
import { applyPosition } from "./drag";

export const VIEWPORTS: Record<string, ViewportSize> = {
  mobile: { width: 375, height: 667 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 800 },
  custom: { width: 480, height: 800 },
};

export type ViewportKey = "mobile" | "tablet" | "desktop" | "custom";

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

  const customInput = elements.pip.querySelector(".pip-vp-custom-input") as HTMLInputElement;
  if (customInput) {
    customInput.addEventListener("input", () => {
      const val = parseInt(customInput.value, 10);
      if (!isNaN(val) && val >= 200 && val <= 1920) {
        state.customViewportWidth = val;
        if (state.viewport === "custom") {
          VIEWPORTS.custom.width = val;
          if (!state.maximized) {
            state.width = Math.min(val + 40, window.innerWidth - 20);
            applyPosition(elements, state);
          }
          onRefresh();
        }
      }
    });
    customInput.addEventListener("keydown", (e) => {
      e.stopPropagation();
    });
    customInput.addEventListener("keyup", (e) => {
      e.stopPropagation();
    });
  }
}

export function setViewport(
  elements: PipElements,
  state: PipState,
  vp: ViewportKey,
  onRefresh: () => void
): void {
  state.viewport = vp;
  const customInput = elements.pip.querySelector(".pip-vp-custom-input") as HTMLInputElement;

  elements.pip.querySelectorAll(".pip-vp-btn").forEach((btn) => {
    btn.classList.toggle("active", (btn as HTMLElement).dataset.vp === vp);
  });

  if (customInput) {
    customInput.classList.toggle("hidden", vp !== "custom");
    if (vp === "custom") {
      customInput.value = String(state.customViewportWidth || 480);
      customInput.focus();
      customInput.select();
    }
  }

  if (!state.maximized) {
    let w: number;
    let h: number;
    if (vp === "custom") {
      w = state.customViewportWidth || 480;
      h = 800;
      VIEWPORTS.custom.width = w;
    } else {
      ({ width: w, height: h } = VIEWPORTS[vp]);
    }
    state.width = Math.min(w + 40, window.innerWidth - 20);
    state.height = Math.min(h + 80, window.innerHeight - 20);
    applyPosition(elements, state);
  }
  onRefresh();
}
