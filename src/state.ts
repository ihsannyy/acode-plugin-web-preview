import type { PipState } from "./types";

const STORAGE_KEY = "web-preview-pip-state";

const DEFAULT_STATE: PipState = {
  visible: false,
  minimized: false,
  maximized: false,
  fullscreen: false,
  x: 20,
  y: 80,
  width: 350,
  height: 250,
  viewport: "mobile",
  customViewportWidth: 480,
  zoom: 100,
  urlMode: false,
  url: "",
  consoleOpen: false,
  urlHistory: [],
  urlHistoryIndex: -1,
};

export function loadState(): PipState {
  const state = { ...DEFAULT_STATE };
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      const parsed = JSON.parse(saved);
      Object.assign(state, parsed);
    }
  } catch { /* use defaults */ }

  state.visible = false;
  state.minimized = false;
  state.maximized = false;
  state.fullscreen = false;

  const maxW = window.innerWidth - 20;
  const maxH = window.innerHeight - 20;
  state.width = Math.max(200, Math.min(state.width || 350, maxW));
  state.height = Math.max(150, Math.min(state.height || 250, maxH));
  state.x = Math.max(0, Math.min(state.x || 20, maxW - 100));
  state.y = Math.max(0, Math.min(state.y || 80, maxH - 50));
  state.zoom = Math.max(50, Math.min(state.zoom || 100, 200));
  state.customViewportWidth = Math.max(200, Math.min(state.customViewportWidth || 480, 1920));
  if (!Array.isArray(state.urlHistory)) state.urlHistory = [];
  if (typeof state.urlHistoryIndex !== "number") state.urlHistoryIndex = -1;

  return state;
}

export function saveState(state: PipState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch { /* ignore */ }
}

export function resetState(): PipState {
  try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
  return { ...DEFAULT_STATE };
}
