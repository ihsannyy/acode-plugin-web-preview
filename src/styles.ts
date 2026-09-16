export function getStyles(): string {
  return `
    #web-preview-pip {
      position: fixed;
      z-index: 99999;
      background: #1e1e2e;
      border: 1px solid #45475a;
      border-radius: 10px;
      box-shadow: 0 8px 32px rgba(0,0,0,0.5);
      overflow: hidden;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      color: #cdd6f4;
      transition: border-radius 0.2s;
      min-width: 240px;
      min-height: 150px;
      display: flex;
      flex-direction: column;
    }
    #web-preview-pip.minimized {
      width: 200px !important;
      height: auto !important;
      min-width: 200px;
      min-height: auto;
      resize: none;
      border-radius: 8px;
    }
    #web-preview-pip.minimized .pip-body,
    #web-preview-pip.minimized .pip-console,
    #web-preview-pip.minimized .pip-toolbar {
      display: none !important;
    }
    #web-preview-pip.maximized {
      width: 100vw !important;
      height: 100vh !important;
      top: 0 !important;
      left: 0 !important;
      border-radius: 0;
      border: none;
      resize: none;
    }
    #web-preview-pip.fullscreen {
      width: 100vw !important;
      height: 100vh !important;
      top: 0 !important;
      left: 0 !important;
      border-radius: 0;
      border: none;
      z-index: 999999;
    }

    /* Header */
    .pip-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0 6px;
      background: #181825;
      cursor: move;
      user-select: none;
      -webkit-user-select: none;
      height: 30px;
      box-sizing: border-box;
      border-bottom: 1px solid #313244;
      flex-shrink: 0;
    }
    .pip-title {
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
      color: #a6adc8;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .pip-title svg {
      width: 14px;
      height: 14px;
      color: #89b4fa;
      flex-shrink: 0;
    }
    .pip-controls {
      display: flex;
      gap: 1px;
      align-items: center;
    }

    /* Toolbar row */
    .pip-toolbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 6px;
      background: #181825;
      border-bottom: 1px solid #313244;
      flex-shrink: 0;
      gap: 4px;
    }

    /* Viewport Switch */
    .pip-viewport-switch {
      display: flex;
      gap: 2px;
      align-items: center;
    }
    .pip-vp-btn {
      width: 22px;
      height: 22px;
      background: transparent;
      border: none;
      color: #6c7086;
      cursor: pointer;
      padding: 3px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
      flex-shrink: 0;
      box-sizing: border-box;
    }
    .pip-vp-btn svg {
      width: 14px;
      height: 14px;
      display: block;
      flex-shrink: 0;
    }
    .pip-vp-btn:hover {
      background: #313244;
      color: #cdd6f4;
    }
    .pip-vp-btn.active {
      color: #89b4fa;
      background: #313244;
    }
    .pip-vp-custom-input {
      width: 48px;
      background: #1e1e2e;
      border: 1px solid #45475a;
      border-radius: 4px;
      color: #cdd6f4;
      font-size: 10px;
      padding: 1px 3px;
      text-align: center;
      outline: none;
      font-family: inherit;
      height: 20px;
    }
    .pip-vp-custom-input:focus {
      border-color: #89b4fa;
    }

    /* Buttons */
    .pip-btn {
      background: transparent;
      border: none;
      color: #6c7086;
      cursor: pointer;
      width: 22px;
      height: 22px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
      flex-shrink: 0;
    }
    .pip-btn svg {
      width: 13px;
      height: 13px;
    }
    .pip-btn:hover {
      background: #313244;
      color: #cdd6f4;
    }
    .pip-btn:active {
      transform: scale(0.92);
    }
    .pip-close:hover {
      background: #f38ba8;
      color: #1e1e2e;
    }
    .pip-btn.active-toggle {
      color: #89b4fa;
      background: rgba(137, 180, 250, 0.15);
    }

    /* Zoom group */
    .pip-zoom-group {
      display: flex;
      align-items: center;
      gap: 2px;
    }
    .pip-zoom-label {
      font-size: 10px;
      color: #6c7086;
      min-width: 30px;
      text-align: center;
      font-variant-numeric: tabular-nums;
    }

    /* URL Bar */
    .pip-sub-header {
      display: flex;
      align-items: center;
      padding: 3px 6px;
      background: #1e1e2e;
      border-bottom: 1px solid #313244;
      gap: 4px;
      flex-shrink: 0;
    }
    .pip-url-bar {
      display: flex;
      flex: 1;
      gap: 3px;
      align-items: center;
      width: 100%;
    }
    .pip-url-input {
      flex: 1;
      background: #181825;
      border: 1px solid #45475a;
      border-radius: 4px;
      color: #cdd6f4;
      font-size: 11px;
      padding: 2px 6px;
      outline: none;
      font-family: inherit;
      min-width: 0;
      height: 22px;
    }
    .pip-url-input:focus {
      border-color: #89b4fa;
    }
    .pip-url-input::placeholder {
      color: #6c7086;
    }
    .pip-url-go svg, .pip-url-clear svg, .pip-url-back svg, .pip-url-forward svg {
      width: 12px;
      height: 12px;
    }
    .pip-url-go {
      width: 20px !important;
      height: 20px !important;
    }
    .pip-url-clear {
      width: 20px !important;
      height: 20px !important;
      color: #f38ba8 !important;
    }
    .pip-url-clear:hover {
      background: #f38ba8 !important;
      color: #1e1e2e !important;
    }
    .pip-url-back, .pip-url-forward {
      width: 20px !important;
      height: 20px !important;
    }
    .pip-url-back:disabled, .pip-url-forward:disabled {
      opacity: 0.3;
      cursor: default;
      background: transparent !important;
    }
    .hidden {
      display: none !important;
    }

    /* Loading Bar */
    .pip-loading-bar {
      height: 2px;
      background: transparent;
      position: relative;
      overflow: hidden;
      flex-shrink: 0;
    }
    .pip-loading-bar.active {
      background: #313244;
    }
    .pip-loading-bar.active::after {
      content: '';
      position: absolute;
      top: 0;
      left: -40%;
      width: 40%;
      height: 100%;
      background: linear-gradient(90deg, #89b4fa, #74c7ec, #89b4fa);
      animation: pip-loading-slide 1s ease-in-out infinite;
    }
    @keyframes pip-loading-slide {
      0% { left: -40%; }
      100% { left: 100%; }
    }

    /* Body */
    .pip-body {
      position: relative;
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: #ffffff;
      min-height: 0;
      contain: layout;
    }
    #pip-iframe {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      border: none;
      background: #fff;
    }
    .pip-empty-state {
      position: absolute;
      inset: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #6c7086;
      font-size: 13px;
      background: #1e1e2e;
      padding: 16px;
      pointer-events: none;
      gap: 8px;
    }
    .pip-empty-state svg {
      width: 32px;
      height: 32px;
      color: #45475a;
    }

    /* Console Panel */
    .pip-console {
      display: none;
      flex-direction: column;
      background: #11111b;
      border-top: 1px solid #313244;
      max-height: 140px;
      flex-shrink: 0;
    }
    .pip-console.open {
      display: flex;
    }
    .pip-console-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 2px 8px;
      background: #181825;
      border-bottom: 1px solid #313244;
      min-height: 22px;
    }
    .pip-console-header span {
      font-size: 10px;
      color: #6c7086;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .pip-console-count {
      font-size: 9px;
      color: #1e1e2e;
      background: #6c7086;
      border-radius: 8px;
      padding: 0 5px;
      min-width: 14px;
      text-align: center;
      line-height: 14px;
      font-weight: 700;
    }
    .pip-console-count.has-errors {
      background: #f38ba8;
    }
    .pip-console-body {
      flex: 1;
      overflow-y: auto;
      padding: 4px 0;
      font-family: 'SF Mono', 'Fira Code', 'Consolas', monospace;
      font-size: 10px;
      line-height: 1.5;
      min-height: 40px;
      max-height: 110px;
    }
    .pip-console-body::-webkit-scrollbar {
      width: 4px;
    }
    .pip-console-body::-webkit-scrollbar-thumb {
      background: #45475a;
      border-radius: 2px;
    }
    .pip-console-entry {
      padding: 1px 8px;
      display: flex;
      align-items: flex-start;
      gap: 6px;
      word-break: break-all;
    }
    .pip-console-entry:hover {
      background: rgba(205, 214, 244, 0.03);
    }
    .pip-console-entry .pip-console-icon {
      flex-shrink: 0;
      margin-top: 2px;
    }
    .pip-console-entry.log { color: #cdd6f4; }
    .pip-console-entry.warn { color: #fab387; }
    .pip-console-entry.error { color: #f38ba8; }
    .pip-console-entry.info { color: #89b4fa; }
    .pip-console-entry.log .pip-console-icon svg { color: #6c7086; }
    .pip-console-entry.warn .pip-console-icon svg { color: #fab387; }
    .pip-console-entry.error .pip-console-icon svg { color: #f38ba8; }
    .pip-console-entry.info .pip-console-icon svg { color: #89b4fa; }

    /* Resizers */
    .pip-resizer {
      position: absolute;
      user-select: none;
      -webkit-user-select: none;
      z-index: 10;
      touch-action: none;
    }
    .pip-resizer-r {
      top: 0;
      right: 0;
      width: 10px;
      height: 100%;
      cursor: ew-resize;
    }
    .pip-resizer-b {
      bottom: 0;
      left: 0;
      width: 100%;
      height: 10px;
      cursor: ns-resize;
    }
    .pip-resizer-se {
      bottom: 0;
      right: 0;
      width: 18px;
      height: 18px;
      cursor: nwse-resize;
      z-index: 11;
      display: flex;
      align-items: flex-end;
      justify-content: flex-end;
      padding: 3px;
    }
    #web-preview-pip.is-dragging #pip-iframe,
    #web-preview-pip.is-resizing #pip-iframe {
      pointer-events: none !important;
    }
    #web-preview-pip.minimized .pip-resizer,
    #web-preview-pip.maximized .pip-resizer,
    #web-preview-pip.fullscreen .pip-resizer {
      display: none !important;
    }
  `;
}
