import type { PipElements, PipState } from "./types";
import { refreshPreview, injectJsToIframe, injectCssToIframe, injectMarkdownToIframe, showLoading } from "./preview";
import { updateConsoleCount } from "./controls";

type Cleanup = () => void;

const CONSOLE_ICONS: Record<string, string> = {
  log: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="8" y1="15" x2="16" y2="15"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`,
  warn: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  error: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>`,
  info: `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>`,
};

let consoleEntryCount = 0;

export function attachEditorListeners(
  elements: PipElements,
  state: PipState
): Cleanup {
  const editorManager = (window as any).editorManager;
  if (!editorManager) return () => {};

  let updateTimer: ReturnType<typeof setTimeout> | null = null;

  const triggerRefresh = () => {
    if (state.urlMode) return;
    if (updateTimer) clearTimeout(updateTimer);
    updateTimer = setTimeout(() => refreshPreview(elements, state), 200);
  };

  const onFileSwitch = () => {
    if (state.urlMode) return;
    refreshPreview(elements, state);
  };

  const onContentChange = () => {
    if (state.urlMode) return;
    const activeFile = editorManager.activeFile;
    if (!activeFile) return;
    const filename = activeFile.filename || activeFile.name || "";
    const content = getValue(activeFile);

    if (/\.css$/i.test(filename) && content) {
      injectCssToIframe(elements, content);
    } else if (/\.js$/i.test(filename) && content) {
      injectJsToIframe(elements, content);
    } else if (/\.(md|markdown|mkd|mdwn)$/i.test(filename) && content) {
      injectMarkdownToIframe(elements, content);
    }
  };

  try {
    editorManager.on("switch-file", onFileSwitch);
    editorManager.on("rename-file", onFileSwitch);
    editorManager.on("save-file", triggerRefresh);
    editorManager.on("file-content-changed", onContentChange);
    editorManager.on("update", triggerRefresh);
  } catch { /* ignore */ }

  let boundSession: any = null;
  const attachToSession = () => {
    try {
      if (boundSession && typeof boundSession.off === "function") {
        boundSession.off("change", onContentChange);
      }
      if (editorManager.activeFile?.session && typeof editorManager.activeFile.session.on === "function") {
        boundSession = editorManager.activeFile.session;
        boundSession.on("change", onContentChange);
      } else if (editorManager.editor && typeof editorManager.editor.on === "function") {
        editorManager.editor.on("change", onContentChange);
      }
    } catch { /* ignore */ }
  };

  attachToSession();
  try {
    editorManager.on("switch-file", attachToSession);
  } catch { /* ignore */ }

  setupConsoleCapture(elements, state);

  return () => {
    if (updateTimer) clearTimeout(updateTimer);
    try {
      editorManager.off("switch-file", onFileSwitch);
      editorManager.off("switch-file", attachToSession);
      editorManager.off("rename-file", onFileSwitch);
      editorManager.off("save-file", triggerRefresh);
      editorManager.off("file-content-changed", onContentChange);
      editorManager.off("update", triggerRefresh);

      if (editorManager.editor && typeof editorManager.editor.off === "function") {
        editorManager.editor.off("change", onContentChange);
      }
      if (boundSession && typeof boundSession.off === "function") {
        boundSession.off("change", onContentChange);
      }
    } catch { /* ignore */ }
  };
}

function getValue(activeFile: any): string | null {
  try {
    if (typeof activeFile.session?.getValue === "function") {
      return activeFile.session.getValue();
    }
    if (typeof activeFile.content === "string") {
      return activeFile.content;
    }
  } catch { /* ignore */ }
  return null;
}

function setupConsoleCapture(elements: PipElements, state: PipState): void {
  const iframe = elements.iframe;

  (window as any).__acode_pip_log = (level: string, text: string) => {
    if (!elements.consoleBody) return;

    const entry = document.createElement("div");
    entry.className = `pip-console-entry ${level || "log"}`;
    entry.innerHTML = `
      <span class="pip-console-icon">${CONSOLE_ICONS[level] || CONSOLE_ICONS.log}</span>
      <span>${escapeHtml(text).substring(0, 2000)}</span>
    `;
    elements.consoleBody.appendChild(entry);
    elements.consoleBody.scrollTop = elements.consoleBody.scrollHeight;

    consoleEntryCount++;
    updateConsoleCount(elements, consoleEntryCount);
  };

  const onMessage = (e: MessageEvent) => {
    if (e.data && e.data.type === "acode-pip-console") {
      (window as any).__acode_pip_log?.(e.data.level || "log", e.data.text || "");
    }
  };

  window.addEventListener("message", onMessage);

  const captureLogs = () => {
    try {
      const iframeWin = iframe.contentWindow as any;
      if (!iframeWin) return;

      const origConsole = {
        log: iframeWin.console?.log ? iframeWin.console.log.bind(iframeWin.console) : null,
        warn: iframeWin.console?.warn ? iframeWin.console.warn.bind(iframeWin.console) : null,
        error: iframeWin.console?.error ? iframeWin.console.error.bind(iframeWin.console) : null,
        info: iframeWin.console?.info ? iframeWin.console.info.bind(iframeWin.console) : null,
      };

      const formatArgs = (args: any[]) => {
        return args.map((a) => {
          if (a === null) return "null";
          if (a === undefined) return "undefined";
          if (typeof a === "object") {
            try { return JSON.stringify(a, null, 2); } catch { return String(a); }
          }
          return String(a);
        }).join(" ");
      };

      if (origConsole.log) iframeWin.console.log = (...args: any[]) => { origConsole.log(...args); (window as any).__acode_pip_log?.("log", formatArgs(args)); };
      if (origConsole.warn) iframeWin.console.warn = (...args: any[]) => { origConsole.warn(...args); (window as any).__acode_pip_log?.("warn", formatArgs(args)); };
      if (origConsole.error) iframeWin.console.error = (...args: any[]) => { origConsole.error(...args); (window as any).__acode_pip_log?.("error", formatArgs(args)); };
      if (origConsole.info) iframeWin.console.info = (...args: any[]) => { origConsole.info(...args); (window as any).__acode_pip_log?.("info", formatArgs(args)); };

      iframeWin.addEventListener("error", (e: any) => {
        (window as any).__acode_pip_log?.("error", (e.message || "Error") + " at " + (e.filename || "").split("/").pop() + ":" + (e.lineno || 0));
      });
    } catch { /* cross-origin */ }
  };

  iframe.addEventListener("load", captureLogs);
}

export function resetConsole(elements: PipElements): void {
  consoleEntryCount = 0;
  if (elements.consoleBody) elements.consoleBody.innerHTML = "";
  updateConsoleCount(elements, 0);
}

function escapeHtml(str: string): string {
  return str.replace(/[&<>"']/g, (m) => {
    switch (m) {
      case "&": return "&amp;";
      case "<": return "&lt;";
      case ">": return "&gt;";
      case '"': return "&quot;";
      default: return "&#039;";
    }
  });
}
