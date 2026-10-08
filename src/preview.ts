import type { PipElements, PipState } from "./types";
import { VIEWPORTS } from "./viewport";
import { marked } from "marked";

const CONSOLE_SCRIPT = `<script>
(function(){
  function s(t,a){
    try{
      var m=Array.prototype.slice.call(a).map(function(x){
        if(x===null)return 'null';
        if(x===undefined)return 'undefined';
        if(typeof x==='object'){try{return JSON.stringify(x,null,2);}catch(e){return String(x);}}
        return String(x);
      }).join(' ');
      
      if(window.parent && typeof window.parent.__acode_pip_log === 'function'){
        window.parent.__acode_pip_log(t, m);
      } else if(typeof window.__acode_pip_log === 'function'){
        window.__acode_pip_log(t, m);
      }
      try{ window.parent.postMessage({type:'acode-pip-console',level:t,text:m},'*'); }catch(e){}
    }catch(e){}
  }
  var _l=console.log,_w=console.warn,_e=console.error,_i=console.info;
  console.log=function(){if(_l)try{_l.apply(console,arguments);}catch(e){}s('log',arguments);};
  console.warn=function(){if(_w)try{_w.apply(console,arguments);}catch(e){}s('warn',arguments);};
  console.error=function(){if(_e)try{_e.apply(console,arguments);}catch(e){}s('error',arguments);};
  console.info=function(){if(_i)try{_i.apply(console,arguments);}catch(e){}s('info',arguments);};
  window.onerror=function(msg,url,line){
    var loc=(url||'').split('/').pop();
    s('error',[(msg||'Error')+(loc?' ('+loc+':'+line+')':'')]);
  };
  window.addEventListener('error',function(e){
    var loc=(e.filename||'').split('/').pop();
    s('error',[(e.message||'Error')+(loc?' ('+loc+':'+e.lineno+')':'')]);
  });
})();
</script>`;

export function refreshPreview(
  elements: PipElements,
  state: PipState
): void {
  if (!state.visible || !elements.iframe) return;

  const { urlInput } = elements;
  const editorManager = (window as any).editorManager;
  const activeFile = editorManager?.activeFile;
  const filename = activeFile?.filename || activeFile?.name || "";

  if (!state.urlMode || !state.url.trim()) {
    if (urlInput && document.activeElement !== urlInput) {
      urlInput.value = "";
      urlInput.placeholder = filename ? `${filename}` : "Enter URL or leave empty for HTML/MD file...";
    }
    renderActiveFile(elements, state, editorManager, activeFile, filename);
    return;
  }

  if (urlInput && document.activeElement !== urlInput) {
    urlInput.value = state.url;
  }
  renderUrl(elements, state);
}

function renderActiveFile(
  elements: PipElements,
  state: PipState,
  editorManager: any,
  activeFile: any,
  filename: string
): void {
  if (!editorManager || !activeFile) {
    showEmptyState(elements, true);
    return;
  }

  const content = getEditorContent(editorManager) || "";

  const isHtmlExtension = /\.(html?|htm)$/i.test(filename);
  const isMdExtension = /\.(md|markdown|mkd|mdwn)$/i.test(filename);
  const isHtmlContent = typeof content === "string" && (
    content.trim().toLowerCase().startsWith("<!doctype html") ||
    content.trim().toLowerCase().startsWith("<html") ||
    /<[a-z][\s\S]*>/i.test(content)
  );

  if (!isHtmlExtension && !isMdExtension && !isHtmlContent) {
    showEmptyState(elements, true);
    return;
  }

  let baseUri = "";
  const uri = activeFile.uri || activeFile.location || "";
  if (uri && uri.includes("/")) {
    baseUri = uri.substring(0, uri.lastIndexOf("/") + 1);
  }

  showEmptyState(elements, false);
  showLoading(elements, true);

  if (isMdExtension) {
    try {
      const parsedHtml = marked.parse(content) as string;
      renderMarkdownToIframe(elements, state, parsedHtml, baseUri);
    } catch {
      renderToIframe(elements, state, content, baseUri);
    }
  } else {
    renderToIframe(elements, state, content, baseUri);
  }
}

function renderUrl(elements: PipElements, state: PipState): void {
  const { iframe } = elements;
  let rawUrl = (state.url || "").trim();

  if (!rawUrl) {
    showEmptyState(elements, true);
    return;
  }

  let targetUrl = rawUrl;
  if (!/^https?:\/\//i.test(targetUrl) && !/^file:\/\//i.test(targetUrl)) {
    targetUrl = `http://${targetUrl}`;
  }

  showEmptyState(elements, false);
  showLoading(elements, true);

  iframe.removeAttribute("srcdoc");

  if (iframe.src !== targetUrl) {
    iframe.src = targetUrl;
  } else {
    try {
      iframe.contentWindow?.location.reload();
    } catch {
      iframe.src = targetUrl;
    }
  }
}

function getEditorContent(editorManager: any): string | null {
  if (!editorManager) return null;
  try {
    if (typeof editorManager.editor?.getValue === "function") {
      return editorManager.editor.getValue();
    }
    if (typeof editorManager.activeFile?.session?.getValue === "function") {
      return editorManager.activeFile.session.getValue();
    }
    if (editorManager.editor?.state?.doc) {
      return editorManager.editor.state.doc.toString();
    }
    if (typeof editorManager.activeFile?.content === "string") {
      return editorManager.activeFile.content;
    }
  } catch { /* ignore */ }
  return null;
}

export function getEditorContentForFile(activeFile: any): string | null {
  if (!activeFile) return null;
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

function resolveCssForHref(href: string, baseUri?: string): string | null {
  const editorManager = (window as any).editorManager;
  if (!editorManager?.files) return null;

  const cleanHref = href.split("?")[0].split("#")[0];
  const targetName = cleanHref.substring(cleanHref.lastIndexOf("/") + 1);

  for (const file of editorManager.files) {
    const fname = file.filename || file.name || "";
    const furi = file.uri || file.location || "";

    if (fname === targetName || furi.endsWith(cleanHref) || (baseUri && (baseUri + cleanHref) === furi)) {
      try {
        if (typeof file.session?.getValue === "function") {
          return file.session.getValue();
        }
        if (typeof file.content === "string") {
          return file.content;
        }
      } catch { /* ignore */ }
    }
  }

  return null;
}

export function processHtmlCss(html: string, baseUri?: string): string {
  if (!html) return html;

  const linkRegex = /<link\s+[^>]*>/gi;

  return html.replace(linkRegex, (linkTag) => {
    const hrefMatch = linkTag.match(/href=["']([^"']+)["']/i);
    if (!hrefMatch) return linkTag;

    const href = hrefMatch[1];
    if (/^https?:\/\//i.test(href) || /^\/\//.test(href) || /^data:/i.test(href)) {
      return linkTag;
    }

    const isStylesheet = /rel=["']stylesheet["']/i.test(linkTag) || /\.css/i.test(href);
    if (!isStylesheet) return linkTag;

    const cleanName = href.substring(href.lastIndexOf("/") + 1).split("?")[0].split("#")[0];
    const cssContent = resolveCssForHref(href, baseUri);

    if (cssContent !== null) {
      return `<style data-acode-css="${cleanName}" data-href="${href}">\n/* Resolved by Web Preview PiP */\n${cssContent}\n</style>`;
    }

    return linkTag;
  });
}

function renderToIframe(
  elements: PipElements,
  state: PipState,
  html: string,
  baseUri?: string
): void {
  const { iframe, pip } = elements;
  const vp = VIEWPORTS[state.viewport];

  iframe.removeAttribute("src");

  let content = processHtmlCss(html, baseUri);
  let baseTag = "";
  if (baseUri && !/<base\s/i.test(html)) {
    baseTag = `<base href="${baseUri}">\n`;
  }

  if (!/<html/i.test(content)) {
    content = `<!DOCTYPE html>
<html>
<head>
  ${CONSOLE_SCRIPT}
  ${baseTag}<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { min-height: 100vh; }
  </style>
</head>
<body>
${content}
</body>
</html>`;
  } else {
    const headInsert = `<head>\n${CONSOLE_SCRIPT}${baseTag ? '\n' + baseTag : ''}`;
    if (/<head([^>]*)>/i.test(content)) {
      content = content.replace(/<head([^>]*)>/i, `$&\n${CONSOLE_SCRIPT}${baseTag ? '\n' + baseTag : ''}`);
    } else {
      content = headInsert + '\n' + content;
    }
  }

  iframe.srcdoc = content;
  iframe.style.display = "block";

  if (!state.maximized && !state.fullscreen) {
    let targetW: number;
    if (state.viewport === "custom") {
      targetW = Math.min(state.customViewportWidth + 40, window.innerWidth - 20);
    } else {
      targetW = Math.min(vp.width + 40, window.innerWidth - 20);
    }
    pip.style.width = targetW + "px";
  }

  const zoom = state.zoom || 100;
  if (zoom !== 100) {
    setTimeout(function() { applyZoom(elements, state); }, 50);
  }
}

function renderMarkdownToIframe(
  elements: PipElements,
  state: PipState,
  html: string,
  baseUri?: string
): void {
  const { iframe, pip } = elements;
  const vp = VIEWPORTS[state.viewport];

  iframe.removeAttribute("src");

  let baseTag = "";
  if (baseUri && !/<base\s/i.test(html)) {
    baseTag = `<base href="${baseUri}">\n`;
  }

  const fullContent = `<!DOCTYPE html>
<html>
<head>
  ${CONSOLE_SCRIPT}
  ${baseTag}<meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    :root { color-scheme: dark; }
    * { box-sizing: border-box; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      padding: 20px;
      line-height: 1.6;
      color: #cdd6f4;
      background: #181825;
      max-width: 900px;
      margin: 0 auto;
      word-wrap: break-word;
    }
    h1, h2, h3, h4, h5, h6 { color: #89b4fa; margin-top: 20px; margin-bottom: 12px; font-weight: 600; border-bottom: 1px solid #313244; padding-bottom: 0.3em; }
    h1 { font-size: 1.8em; } h2 { font-size: 1.4em; } h3 { font-size: 1.2em; }
    a { color: #89b4fa; text-decoration: none; } a:hover { text-decoration: underline; }
    code { font-family: 'SF Mono', 'Fira Code', Consolas, monospace; background: #11111b; padding: 0.2em 0.4em; border-radius: 4px; color: #f38ba8; font-size: 85%; }
    pre { background: #11111b; padding: 14px; border-radius: 8px; overflow: auto; border: 1px solid #313244; margin: 16px 0; }
    pre code { background: none; padding: 0; color: #cdd6f4; font-size: 90%; }
    blockquote { border-left: 4px solid #89b4fa; margin: 16px 0; padding: 4px 16px; color: #a6adc8; background: rgba(137, 180, 250, 0.05); border-radius: 0 4px 4px 0; }
    table { border-collapse: collapse; width: 100%; margin: 16px 0; }
    th, td { border: 1px solid #313244; padding: 8px 12px; text-align: left; }
    th { background: #11111b; color: #89b4fa; }
    tr:nth-child(even) { background: rgba(255, 255, 255, 0.02); }
    img { max-width: 100%; border-radius: 6px; }
    hr { border: none; border-top: 1px solid #313244; margin: 24px 0; }
    ul, ol { padding-left: 1.8em; margin: 12px 0; }
    li { margin-bottom: 4px; }
    input[type="checkbox"] { margin-right: 6px; }
  </style>
</head>
<body class="markdown-body">
${html}
</body>
</html>`;

  iframe.srcdoc = fullContent;
  iframe.style.display = "block";

  if (!state.maximized && !state.fullscreen) {
    let targetW: number;
    if (state.viewport === "custom") {
      targetW = Math.min(state.customViewportWidth + 40, window.innerWidth - 20);
    } else {
      targetW = Math.min(vp.width + 40, window.innerWidth - 20);
    }
    pip.style.width = targetW + "px";
  }

  const zoom = state.zoom || 100;
  if (zoom !== 100) {
    setTimeout(function() { applyZoom(elements, state); }, 50);
  }
}

function showEmptyState(elements: PipElements, show: boolean): void {
  const empty = elements.pip.querySelector(".pip-empty-state") as HTMLElement;
  if (empty) empty.style.display = show ? "flex" : "none";
  if (elements.iframe) elements.iframe.style.display = show ? "none" : "block";
}

export function showLoading(elements: PipElements, show: boolean): void {
  if (elements.loadingBar) {
    elements.loadingBar.classList.toggle("active", show);
  }
}

export function applyZoom(elements: PipElements, state: PipState): void {
  const zoom = state.zoom || 100;
  const scale = zoom / 100;
  const { iframe, pip, zoomLabel } = elements;

  if (zoomLabel) zoomLabel.textContent = zoom + "%";

  const body = pip.querySelector(".pip-body") as HTMLElement;
  if (!body) return;

  if (scale !== 1) {
    body.style.overflow = "hidden";
    iframe.style.transform = "scale(" + scale + ")";
    iframe.style.transformOrigin = "top left";
    iframe.style.width = (100 / scale) + "%";
    iframe.style.height = (100 / scale) + "%";
  } else {
    iframe.style.transform = "";
    iframe.style.transformOrigin = "";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    body.style.overflow = "";
  }
}

export function injectJsToIframe(elements: PipElements, jsCode: string): void {
  if (!elements.iframe?.contentDocument) return;
  try {
    const iframeDoc = elements.iframe.contentDocument;
    let scriptEl = iframeDoc.getElementById("acode-hot-js");
    if (scriptEl) scriptEl.remove();
    scriptEl = iframeDoc.createElement("script");
    scriptEl.id = "acode-hot-js";
    scriptEl.textContent = jsCode;
    iframeDoc.head.appendChild(scriptEl);
  } catch { /* cross-origin or other issue */ }
}

export function injectCssToIframe(elements: PipElements, cssCode: string, filename?: string): void {
  if (!elements.iframe?.contentDocument) return;
  try {
    const iframeDoc = elements.iframe.contentDocument;
    const cleanName = filename ? filename.substring(filename.lastIndexOf("/") + 1) : "";

    let styleEl: HTMLElement | null = null;
    if (cleanName) {
      styleEl = iframeDoc.querySelector(`style[data-acode-css="${cleanName}"]`);
    }
    if (!styleEl) {
      styleEl = iframeDoc.getElementById("acode-hot-css");
    }
    if (!styleEl) {
      styleEl = iframeDoc.createElement("style");
      if (cleanName) {
        styleEl.setAttribute("data-acode-css", cleanName);
      } else {
        styleEl.id = "acode-hot-css";
      }
      iframeDoc.head.appendChild(styleEl);
    }
    styleEl.textContent = cssCode;
  } catch { /* cross-origin or other issue */ }
}

export function injectMarkdownToIframe(elements: PipElements, mdContent: string): void {
  if (!elements.iframe?.contentDocument) return;
  try {
    const html = marked.parse(mdContent) as string;
    const bodyEl = elements.iframe.contentDocument.body;
    if (bodyEl && bodyEl.classList.contains("markdown-body")) {
      bodyEl.innerHTML = html;
    }
  } catch { /* fallback */ }
}
