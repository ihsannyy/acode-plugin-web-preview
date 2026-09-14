"use strict";(()=>{var w={id:"acode.plugin.webpreviewpip",name:"Web Preview PiP",main:"main.js",version:"1.1.0",readme:"readme.md",changelogs:"changelogs.md",icon:"icon.png",files:[],minVersionCode:290,license:"MIT",keywords:["preview","web","html","pip","live","picture-in-picture"],price:0,author:{name:"User",github:""}};var P="web-preview-pip-state",L={visible:!1,minimized:!1,maximized:!1,x:20,y:80,width:350,height:250,viewport:"mobile"};function C(){let t={...L};try{let o=localStorage.getItem(P);if(o){let n=JSON.parse(o);Object.assign(t,n)}}catch{}t.visible=!1,t.minimized=!1,t.maximized=!1;let i=window.innerWidth-20,e=window.innerHeight-20;return t.width=Math.max(200,Math.min(t.width||350,i)),t.height=Math.max(150,Math.min(t.height||250,e)),t.x=Math.max(0,Math.min(t.x||20,i-100)),t.y=Math.max(0,Math.min(t.y||80,e-50)),t}function h(t){try{localStorage.setItem(P,JSON.stringify(t))}catch{}}function T(){try{localStorage.removeItem(P)}catch{}return{...L}}function k(){return`
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
  `}function W(t){let i=document.getElementById("web-preview-pip");i&&i.remove();let e=document.createElement("div");e.id="web-preview-pip",e.style.display=t.visible?"flex":"none",e.innerHTML=`
    <style>${k()}</style>
    <div class="pip-header">
      <span class="pip-title">Web Preview</span>
      <div class="pip-viewport-switch">
        <button class="pip-vp-btn active" data-vp="mobile" title="Mobile (375px)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="5" y="2" width="14" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
        </button>
        <button class="pip-vp-btn" data-vp="tablet" title="Tablet (768px)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="12" y1="18" x2="12" y2="18"/></svg>
        </button>
        <button class="pip-vp-btn" data-vp="desktop" title="Desktop (1280px)">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
        </button>
      </div>
      <div class="pip-controls">
        <button class="pip-btn pip-minimize" title="Minimize">_</button>
        <button class="pip-btn pip-maximize" title="Maximize">\u25A1</button>
        <button class="pip-btn pip-close" title="Close">\xD7</button>
      </div>
    </div>
    <div class="pip-body">
      <iframe id="pip-iframe" sandbox="allow-scripts allow-same-origin allow-modals allow-forms allow-popups"></iframe>
      <div class="pip-empty-state">
        <p>Open an HTML file to preview</p>
      </div>
    </div>
    <div class="pip-resizer pip-resizer-r" data-dir="r"></div>
    <div class="pip-resizer pip-resizer-b" data-dir="b"></div>
    <div class="pip-resizer pip-resizer-se" data-dir="se" title="Resize">
      <svg width="10" height="10" viewBox="0 0 10 10">
        <path d="M6 10L10 6M2 10L10 2" stroke="#6c7086" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </div>
  `,document.body.appendChild(e);let o={pip:e,iframe:e.querySelector("#pip-iframe"),header:e.querySelector(".pip-header"),title:e.querySelector(".pip-title")};return e.style.display=t.visible?"flex":"none",t.minimized&&e.classList.add("minimized"),t.maximized&&e.classList.add("maximized"),o}function H(t){t!=null&&t.pip&&t.pip.remove()}var g=!1,x=!1,u=null,f={x:0,y:0},y={x:0,y:0,w:0,h:0};function F(t,i,e){let{header:o,pip:n}=t,r=(s,m)=>{i.maximized||i.minimized||(g=!0,n.classList.add("is-dragging"),f.x=s-i.x,f.y=m-i.y)};o.addEventListener("mousedown",s=>{s.target.closest(".pip-controls")||s.target.closest(".pip-viewport-switch")||r(s.clientX,s.clientY)}),o.addEventListener("touchstart",s=>{s.target.closest(".pip-controls")||s.target.closest(".pip-viewport-switch")||s.touches.length>0&&r(s.touches[0].clientX,s.touches[0].clientY)},{passive:!0});let p=(s,m,l)=>{i.maximized||i.minimized||(x=!0,u=l,n.classList.add("is-resizing"),f.x=s,f.y=m,y.w=i.width,y.h=i.height)};n.querySelectorAll(".pip-resizer").forEach(s=>{let m=s.getAttribute("data-dir");s.addEventListener("mousedown",l=>{l.stopPropagation(),l.preventDefault(),p(l.clientX,l.clientY,m)}),s.addEventListener("touchstart",l=>{l.stopPropagation(),l.touches.length>0&&p(l.touches[0].clientX,l.touches[0].clientY,m)},{passive:!0})});let a=(s,m)=>{if(g)i.x=s-f.x,i.y=m-f.y,d(t,i);else if(x&&u){let l=s-f.x,O=m-f.y,E=200,M=150,$=Math.max(E,window.innerWidth-i.x-10),X=Math.max(M,window.innerHeight-i.y-10);(u==="se"||u==="r")&&(i.width=Math.max(E,Math.min(y.w+l,$))),(u==="se"||u==="b")&&(i.height=Math.max(M,Math.min(y.h+O,X))),d(t,i)}};document.addEventListener("mousemove",s=>a(s.clientX,s.clientY)),document.addEventListener("touchmove",s=>{s.touches.length>0&&a(s.touches[0].clientX,s.touches[0].clientY)},{passive:!0});let c=()=>{(g||x)&&(g=!1,x=!1,u=null,n.classList.remove("is-dragging","is-resizing"),e())};document.addEventListener("mouseup",c),document.addEventListener("touchend",c)}function d(t,i){let{pip:e}=t;if(i.maximized){e.style.top="0",e.style.left="0",e.style.width="100vw",e.style.height="100vh";return}let o=Math.max(200,window.innerWidth-20),n=Math.max(150,window.innerHeight-20),r=isNaN(i.x)?20:i.x,p=isNaN(i.y)?80:i.y,a=isNaN(i.width)?350:i.width,c=isNaN(i.height)?250:i.height;a=Math.max(200,Math.min(a,o)),c=Math.max(150,Math.min(c,n)),r=Math.max(0,Math.min(r,Math.max(0,window.innerWidth-60))),p=Math.max(0,Math.min(p,Math.max(0,window.innerHeight-40))),e.style.top=`${p}px`,e.style.left=`${r}px`,e.style.width=`${a}px`,e.style.height=`${c}px`}function R(t,i,e){var n,r,p;let{pip:o}=t;(n=o.querySelector(".pip-close"))==null||n.addEventListener("click",e.onClose),(r=o.querySelector(".pip-minimize"))==null||r.addEventListener("click",e.onMinimize),(p=o.querySelector(".pip-maximize"))==null||p.addEventListener("click",e.onMaximize)}function V(t,i){i.minimized=!i.minimized,t.pip.classList.toggle("minimized",i.minimized),i.minimized&&(i.maximized=!1,t.pip.classList.remove("maximized"))}function B(t,i){i.maximized=!i.maximized,i.minimized=!1,t.pip.classList.toggle("maximized",i.maximized),t.pip.classList.remove("minimized"),d(t,i)}function q(t,i){i.visible=!1,i.minimized=!1,i.maximized=!1,t.pip.style.display="none",t.pip.classList.remove("minimized","maximized"),d(t,i)}var b={mobile:{width:375,height:667},tablet:{width:768,height:1024},desktop:{width:1280,height:800}};function I(t,i,e){t.pip.querySelectorAll(".pip-vp-btn").forEach(o=>{o.addEventListener("click",()=>{let n=o.dataset.vp;n&&n in b&&K(t,i,n,e)})})}function K(t,i,e,o){if(i.viewport=e,t.pip.querySelectorAll(".pip-vp-btn").forEach(n=>{n.classList.toggle("active",n.dataset.vp===e)}),!i.maximized){let{width:n,height:r}=b[e];i.width=Math.min(n,window.innerWidth-20),i.height=Math.min(r,window.innerHeight-20),d(t,i)}o()}function v(t,i){if(!i.visible||!t.iframe)return;let e=window.editorManager;if(!e)return;let o=e.activeFile;if(!o){z(t,!0);return}let n=o.filename||o.name||"",r=j(e),p=/\.(html?|htm)$/i.test(n),a=typeof r=="string"&&(r.trim().toLowerCase().startsWith("<!doctype html")||r.trim().toLowerCase().startsWith("<html")||/<[a-z][\s\S]*>/i.test(r));if(!p&&!a){z(t,!0);return}z(t,!1),_(t,i,r||"")}function j(t){var i,e,o,n,r,p;if(!t)return null;try{if(typeof((i=t.editor)==null?void 0:i.getValue)=="function")return t.editor.getValue();if(typeof((o=(e=t.activeFile)==null?void 0:e.session)==null?void 0:o.getValue)=="function")return t.activeFile.session.getValue();if((r=(n=t.editor)==null?void 0:n.state)!=null&&r.doc)return t.editor.state.doc.toString();if(typeof((p=t.activeFile)==null?void 0:p.content)=="string")return t.activeFile.content}catch{}return null}function _(t,i,e){let{iframe:o,pip:n}=t,r=b[i.viewport],p=e;if(/<html/i.test(e)||(p=`<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { min-height: 100vh; }
  </style>
</head>
<body>
${e}
</body>
</html>`),o.srcdoc=p,o.style.display="block",o.style.width="100%",o.style.height="100%",!i.maximized){let a=Math.min(r.width,window.innerWidth-20);n.style.width=`${a}px`}}function z(t,i){let e=t.pip.querySelector(".pip-empty-state");e&&(e.style.display=i?"flex":"none"),t.iframe&&(t.iframe.style.display=i?"none":"block")}function N(t,i){let e=window.editorManager;if(!e)return()=>{};let o=null,n=()=>{o&&clearTimeout(o),o=setTimeout(()=>v(t,i),200)},r=()=>v(t,i);try{e.on("switch-file",r),e.on("rename-file",r),e.on("save-file",n),e.on("file-content-changed",n),e.on("update",n)}catch{}let p=null,a=()=>{var c;try{p&&typeof p.off=="function"&&p.off("change",n),(c=e.activeFile)!=null&&c.session&&typeof e.activeFile.session.on=="function"?(p=e.activeFile.session,p.on("change",n)):e.editor&&typeof e.editor.on=="function"&&e.editor.on("change",n)}catch{}};a();try{e.on("switch-file",a)}catch{}return()=>{o&&clearTimeout(o);try{e.off("switch-file",r),e.off("switch-file",a),e.off("rename-file",r),e.off("save-file",n),e.off("file-content-changed",n),e.off("update",n),e.editor&&typeof e.editor.off=="function"&&e.editor.off("change",n),p&&typeof p.off=="function"&&p.off("change",n)}catch{}}}function A(t){try{let i=window.acode.require("sideButton");if(!i)return null;let e=i({text:"Web Preview",icon:"eye",onclick:t,action:t,backgroundColor:"var(--accent-color, #89b4fa)",textColor:"#1e1e2e"});return e&&typeof e.show=="function"&&e.show(),e}catch{return null}}function D(t,i,e){try{let o=window.acode.require("commands");if(!o)return;o.addCommand({name:"web-preview-pip.toggle",description:"Web Preview PiP: Toggle Preview",bindKey:{win:"Ctrl-Shift-P",mac:"Command-Shift-P"},exec:e.onToggle}),o.addCommand({name:"web-preview-pip.close",description:"Web Preview PiP: Force Close",bindKey:{win:"Ctrl-Shift-X",mac:"Command-Shift-X"},exec:e.onForceClose}),o.addCommand({name:"web-preview-pip.reset",description:"Web Preview PiP: Reset & Close",bindKey:{win:"Ctrl-Shift-R",mac:"Command-Shift-R"},exec:e.onForceReset})}catch{}}var S=class{constructor(){this.elements=null;this.sideButton=null;this.cleanupListeners=null;this.state=C()}async init(i,e,o){this.elements=W(this.state),this.elements&&(d(this.elements,this.state),F(this.elements,this.state,()=>h(this.state)),R(this.elements,this.state,{onMinimize:()=>{V(this.elements,this.state),h(this.state)},onMaximize:()=>{B(this.elements,this.state),h(this.state)},onClose:()=>this.hide()}),I(this.elements,this.state,()=>{h(this.state),v(this.elements,this.state)}),this.cleanupListeners=N(this.elements,this.state),this.sideButton=A(()=>this.toggle()),D(this.elements,this.state,{onToggle:()=>this.toggle(),onForceClose:()=>this.forceClose(),onForceReset:()=>this.forceReset()}))}async destroy(){var i,e;(i=this.cleanupListeners)==null||i.call(this),this.elements&&H(this.elements),(e=this.sideButton)==null||e.hide()}toggle(){this.state.visible?this.hide():this.show()}show(){this.elements&&(this.state.visible=!0,d(this.elements,this.state),this.elements.pip.style.display="flex",v(this.elements,this.state),h(this.state))}hide(){this.elements&&(this.state.visible=!1,this.elements.pip.style.display="none",h(this.state))}forceClose(){this.elements&&(q(this.elements,this.state),h(this.state))}forceReset(){this.state=T(),this.forceClose()}};if(window.acode){try{window.acode.clearBrokenPluginMark(w.id)}catch{}let t=new S;acode.setPluginInit(w.id,async(i,e,{cacheFileUrl:o,cacheFile:n})=>{t.baseUrl=i.endsWith("/")?i:`${i}/`,await t.init(e,n,o)}),acode.setPluginUnmount(w.id,()=>{t.destroy()})}})();
