"use strict";(()=>{var f={id:"acode.plugin.webpreviewpip",name:"Web Preview PiP",main:"main.js",version:"1.0.6",readme:"readme.md",changelogs:"changelogs.md",icon:"icon.png",files:[],minVersionCode:290,license:"MIT",keywords:["preview","web","html","pip","live","picture-in-picture"],price:0,author:{name:"ihsannyy",github:"ihsannyy"}};var v="web-preview-pip-state",g={visible:!1,minimized:!1,maximized:!1,x:20,y:80,width:350,height:250,viewport:"mobile"};function x(){let e={...g};try{let o=localStorage.getItem(v);if(o){let n=JSON.parse(o);Object.assign(e,n)}}catch{}e.visible=!1,e.minimized=!1,e.maximized=!1;let t=window.innerWidth-20,i=window.innerHeight-20;return e.width=Math.max(200,Math.min(e.width||350,t)),e.height=Math.max(150,Math.min(e.height||250,i)),e.x=Math.max(0,Math.min(e.x||20,t-100)),e.y=Math.max(0,Math.min(e.y||80,i-50)),e}function l(e){try{localStorage.setItem(v,JSON.stringify(e))}catch{}}function b(){try{localStorage.removeItem(v)}catch{}return{...g}}function P(){return`
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
      display: none;
    }
    #web-preview-pip.minimized {
      width: 180px !important;
      height: auto !important;
      min-width: 180px;
      min-height: auto;
      resize: none;
      border-radius: 8px;
    }
    #web-preview-pip.minimized .pip-body {
      display: none;
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
      height: calc(100% - 34px);
    }
    #web-preview-pip.maximized .pip-body {
      height: calc(100vh - 34px);
    }
    #pip-iframe {
      width: 100%;
      height: 100%;
      border: none;
      background: #fff;
    }
    .pip-empty-state {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      text-align: center;
      color: #6c7086;
      font-size: 13px;
      pointer-events: none;
    }
  `}function S(e){if(document.getElementById("web-preview-pip"))return null;let i=document.createElement("div");i.id="web-preview-pip",i.style.display="none",i.innerHTML=`
    <style>${P()}</style>
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
  `,document.body.appendChild(i);let o={pip:i,iframe:i.querySelector("#pip-iframe"),header:i.querySelector(".pip-header"),title:i.querySelector(".pip-title")};return e.visible&&(i.style.display=""),e.minimized&&i.classList.add("minimized"),e.maximized&&i.classList.add("maximized"),o}function E(e){e!=null&&e.pip&&e.pip.remove()}var m=!1,c={x:0,y:0};function z(e,t,i){let{header:o}=e,n=(s,u)=>{t.maximized||(m=!0,c.x=s-t.x,c.y=u-t.y)};o.addEventListener("mousedown",s=>{s.target.closest(".pip-controls")||s.target.closest(".pip-viewport-switch")||n(s.clientX,s.clientY)}),o.addEventListener("touchstart",s=>{s.target.closest(".pip-controls")||s.target.closest(".pip-viewport-switch")||n(s.touches[0].clientX,s.touches[0].clientY)},{passive:!0});let r=(s,u)=>{m&&(t.x=s-c.x,t.y=u-c.y,a(e,t))};document.addEventListener("mousemove",s=>r(s.clientX,s.clientY)),document.addEventListener("touchmove",s=>{r(s.touches[0].clientX,s.touches[0].clientY)},{passive:!0});let p=()=>{m&&(m=!1,i())};document.addEventListener("mouseup",p),document.addEventListener("touchend",p)}function a(e,t){let{pip:i}=e;if(t.maximized){i.style.top="0",i.style.left="0",i.style.width="100vw",i.style.height="100vh";return}let o=isNaN(t.x)?20:t.x,n=isNaN(t.y)?80:t.y,r=isNaN(t.width)?350:t.width,p=isNaN(t.height)?250:t.height;i.style.top=`${n}px`,i.style.left=`${o}px`,i.style.width=`${r}px`,i.style.height=`${p}px`}function M(e,t,i){var n,r,p;let{pip:o}=e;(n=o.querySelector(".pip-close"))==null||n.addEventListener("click",i.onClose),(r=o.querySelector(".pip-minimize"))==null||r.addEventListener("click",i.onMinimize),(p=o.querySelector(".pip-maximize"))==null||p.addEventListener("click",i.onMaximize)}function C(e,t){t.minimized=!t.minimized,e.pip.classList.toggle("minimized",t.minimized),t.minimized&&(t.maximized=!1,e.pip.classList.remove("maximized"))}function L(e,t){t.maximized=!t.maximized,t.minimized=!1,e.pip.classList.toggle("maximized",t.maximized),e.pip.classList.remove("minimized"),a(e,t)}function T(e,t){t.visible=!1,t.minimized=!1,t.maximized=!1,e.pip.style.display="none",e.pip.classList.remove("minimized","maximized"),a(e,t)}var h={mobile:{width:375,height:667},tablet:{width:768,height:1024},desktop:{width:1280,height:800}};function k(e,t,i){e.pip.querySelectorAll(".pip-vp-btn").forEach(o=>{o.addEventListener("click",()=>{let n=o.dataset.vp;n&&n in h&&V(e,t,n,i)})})}function V(e,t,i,o){if(t.viewport=i,e.pip.querySelectorAll(".pip-vp-btn").forEach(n=>{n.classList.toggle("active",n.dataset.vp===i)}),!t.maximized){let{width:n,height:r}=h[i];t.width=Math.min(n,window.innerWidth-20),t.height=Math.min(r,window.innerHeight-20),a(e,t)}o()}function d(e,t){var p,s;if(!t.visible||!e.iframe)return;let i=window.editorManager;if(!i)return;let o=i.activeFile;if(!o){y(e,!0);return}let n=o.filename||"";if(!/\.(html?|htm)$/i.test(n)){y(e,!0);return}y(e,!1);let r=(s=(p=i.editor)==null?void 0:p.state)==null?void 0:s.doc;r&&B(e,t,r.toString())}function B(e,t,i){let{iframe:o,pip:n}=e,r=h[t.viewport],p=`<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { min-height: 100vh; }
  </style>
</head>
<body>
${i}
</body>
</html>`;o.srcdoc=p,t.maximized?(o.style.width="100%",o.style.height="100%"):(o.style.width=`${r.width}px`,o.style.height="100%",n.style.width=`${r.width+2}px`)}function y(e,t){let i=e.pip.querySelector(".pip-empty-state");i&&(i.style.display=t?"":"none"),e.iframe&&(e.iframe.style.display=t?"none":"")}function W(e,t){let i=window.editorManager;if(!i)return()=>{};let o=null,n=()=>d(e,t),r=()=>{o&&clearTimeout(o),o=setTimeout(()=>d(e,t),300)};return i.on("switch-file",n),i.on("file-content-changed",r),()=>{o&&clearTimeout(o),i.off("switch-file",n),i.off("file-content-changed",r)}}function F(e){var t;try{let i=document.createElement("span");i.className="icon eye",i.setAttribute("action","web-preview"),i.title="Web Preview PiP",i.style.cssText="padding:0 8px;cursor:pointer;user-select:none;";let o=document.querySelector('[action="web-preview"]');o&&o.remove(),i.onclick=p=>{p.preventDefault(),p.stopPropagation(),e()};let n=((t=document.querySelector("#root"))==null?void 0:t.querySelector("header"))||document.querySelector("header");if(!n)return null;let r=n.querySelector(".tail")||n;return r.insertBefore(i,r.firstChild),{remove:()=>i.remove()}}catch(i){return console.error("Web Preview PiP: Failed to create header button",i),null}}function H(e,t,i){try{let o=window.acode.require("commands");if(!o)return;o.addCommand({name:"web-preview-pip.toggle",description:"Web Preview PiP: Toggle Preview",bindKey:{win:"Ctrl-Shift-V",mac:"Command-Shift-V"},exec:i.onToggle}),o.addCommand({name:"web-preview-pip.close",description:"Web Preview PiP: Force Close",bindKey:{win:"Ctrl-Shift-Q",mac:"Command-Shift-Q"},exec:i.onForceClose}),o.addCommand({name:"web-preview-pip.reset",description:"Web Preview PiP: Reset & Close",bindKey:{win:"Ctrl-Shift-;",mac:"Command-Shift-;"},exec:i.onForceReset})}catch{}}var w=class{constructor(){this.elements=null;this.headerBtn=null;this.cleanupListeners=null;this.state=x()}async init(t,i,o){this.elements=S(this.state),this.elements&&(a(this.elements,this.state),z(this.elements,this.state,()=>l(this.state)),M(this.elements,this.state,{onMinimize:()=>{C(this.elements,this.state),l(this.state)},onMaximize:()=>{L(this.elements,this.state),l(this.state)},onClose:()=>this.hide()}),k(this.elements,this.state,()=>{l(this.state),d(this.elements,this.state)}),this.cleanupListeners=W(this.elements,this.state),this.headerBtn=F(()=>this.toggle()),H(this.elements,this.state,{onToggle:()=>this.toggle(),onForceClose:()=>this.forceClose(),onForceReset:()=>this.forceReset()}))}async destroy(){var t,i;(t=this.cleanupListeners)==null||t.call(this),this.elements&&E(this.elements),(i=this.headerBtn)==null||i.remove()}toggle(){this.state.visible?this.hide():this.show()}show(){this.elements&&(this.state.visible=!0,a(this.elements,this.state),this.elements.pip.style.display="",d(this.elements,this.state),l(this.state))}hide(){this.elements&&(this.state.visible=!1,this.elements.pip.style.display="none",l(this.state))}forceClose(){this.elements&&(T(this.elements,this.state),l(this.state))}forceReset(){this.state=b(),this.forceClose()}};if(window.acode){let e=new w;acode.setPluginInit(f.id,async(t,i,{cacheFileUrl:o,cacheFile:n})=>{e.baseUrl=t.endsWith("/")?t:`${t}/`,await e.init(i,n,o)}),acode.setPluginUnmount(f.id,()=>{e.destroy()})}})();
