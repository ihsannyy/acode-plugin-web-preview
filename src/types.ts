export interface PipState {
  visible: boolean;
  minimized: boolean;
  maximized: boolean;
  x: number;
  y: number;
  width: number;
  height: number;
  viewport: "mobile" | "tablet" | "desktop";
}

export interface PipElements {
  pip: HTMLElement;
  iframe: HTMLIFrameElement;
  header: HTMLElement;
  title: HTMLElement;
}

export interface ViewportSize {
  width: number;
  height: number;
}
