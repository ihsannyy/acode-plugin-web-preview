export interface PipState {
  visible: boolean;
  minimized: boolean;
  maximized: boolean;
  fullscreen: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  viewport: "mobile" | "tablet" | "desktop" | "custom";
  customViewportWidth: number;
  zoom: number;
  urlMode: boolean;
  url: string;
  consoleOpen: boolean;
  urlHistory: string[];
  urlHistoryIndex: number;
}

export interface PipElements {
  pip: HTMLElement;
  iframe: HTMLIFrameElement;
  header: HTMLElement;
  title: HTMLElement;
  urlInput: HTMLInputElement;
  urlBar: HTMLElement;
  vpSwitch: HTMLElement;
  consolePanel: HTMLElement;
  consoleBody: HTMLElement;
  loadingBar: HTMLElement;
  zoomLabel: HTMLElement;
}

export interface ViewportSize {
  width: number;
  height: number;
}
