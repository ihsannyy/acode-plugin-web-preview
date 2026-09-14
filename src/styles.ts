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
      min-width: 200px;
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
    #web-preview-pip.minimized .pip-body {
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
    .pip-header {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 8px;
      background: #181825;
      cursor: move;
      user-select: none;
      -webkit-user-select: none;
      height: 34px;
      box-sizing: border-box;
    }
    .pip-title {
      flex: 1;
      font-size: 11px;
      font-weight: 600;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      color: #a6adc8;
    }
    .pip-viewport-switch {
      display: flex;
      gap: 2px;
    }
    .pip-vp-btn {
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
    }
    .pip-vp-btn:hover {
      background: #313244;
      color: #cdd6f4;
    }
    .pip-vp-btn.active {
      color: #89b4fa;
      background: #313244;
    }
    .pip-controls {
      display: flex;
      gap: 2px;
    }
    .pip-btn {
      background: transparent;
      border: none;
      color: #6c7086;
      cursor: pointer;
      width: 22px;
      height: 22px;
      border-radius: 4px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.15s;
      font-weight: bold;
    }
    .pip-btn:hover {
      background: #313244;
      color: #cdd6f4;
    }
    .pip-close:hover {
      background: #f38ba8;
      color: #1e1e2e;
    }
    .pip-body {
      position: relative;
      width: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: #ffffff;
    }
    #pip-iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: #fff;
      flex: 1;
    }
    .pip-empty-state {
      position: absolute;
      inset: 0;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      color: #6c7086;
      font-size: 13px;
      background: #1e1e2e;
      padding: 16px;
      pointer-events: none;
    }
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
    #web-preview-pip.maximized .pip-resizer {
      display: none !important;
    }
  `;
}
