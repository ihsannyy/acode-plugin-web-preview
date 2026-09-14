"use strict";(()=>{var u={id:"acode.plugin.webpreviewpip",name:"Web Preview PiP",main:"main.js",version:"1.0.3",readme:"readme.md",changelogs:"changelogs.md",icon:"icon.png",files:[],minVersionCode:290,license:"MIT",keywords:["preview","web","html","pip","live","picture-in-picture"],price:0,author:{name:"ihsannyy",github:"ihsannyy"}};var v="web-preview-pip-state",g={visible:!1,minimized:!1,maximized:!1,x:20,y:80,width:350,height:250,viewport:"mobile"};function x(){let e={...g};try{let o=localStorage.getItem(v);if(o){let n=JSON.parse(o);Object.assign(e,n)}}catch{}e.visible=!1,e.minimized=!1,e.maximized=!1;let i=window.innerWidth-20,t=window.innerHeight-20;return e.width=Math.max(200,Math.min(e.width||350,i)),e.height=Math.max(150,Math.min(e.height||250,t)),e.x=Math.max(0,Math.min(e.x||20,i-100)),e.y=Math.max(0,Math.min(e.y||80,t-50)),e}function l(e){try{localStorage.setItem(v,JSON.stringify(e))}catch{}}function b(){try{localStorage.removeItem(v)}catch{}return{...g}}function P(){return`
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
  `}function S(e){if(document.getElementById("web-preview-pip"))return null;let t=document.createElement("div");t.id="web-preview-pip",t.style.display="none",t.innerHTML=`
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
  `,document.body.appendChild(t);let o={pip:t,iframe:t.querySelector("#pip-iframe"),header:t.querySelector(".pip-header"),title:t.querySelector(".pip-title")};return e.visible&&(t.style.display=""),e.minimized&&t.classList.add("minimized"),e.maximized&&t.classList.add("maximized"),o}function E(e){e!=null&&e.pip&&e.pip.remove()}var m=!1,c={x:0,y:0};function z(e,i,t){let{header:o}=e,n=(s,f)=>{i.maximized||(m=!0,c.x=s-i.x,c.y=f-i.y)};o.addEventListener("mousedown",s=>{s.target.closest(".pip-controls")||s.target.closest(".pip-viewport-switch")||n(s.clientX,s.clientY)}),o.addEventListener("touchstart",s=>{s.target.closest(".pip-controls")||s.target.closest(".pip-viewport-switch")||n(s.touches[0].clientX,s.touches[0].clientY)},{passive:!0});let r=(s,f)=>{m&&(i.x=s-c.x,i.y=f-c.y,a(e,i))};document.addEventListener("mousemove",s=>r(s.clientX,s.clientY)),document.addEventListener("touchmove",s=>{r(s.touches[0].clientX,s.touches[0].clientY)},{passive:!0});let p=()=>{m&&(m=!1,t())};document.addEventListener("mouseup",p),document.addEventListener("touchend",p)}function a(e,i){let{pip:t}=e;if(i.maximized){t.style.top="0",t.style.left="0",t.style.width="100vw",t.style.height="100vh";return}let o=isNaN(i.x)?20:i.x,n=isNaN(i.y)?80:i.y,r=isNaN(i.width)?350:i.width,p=isNaN(i.height)?250:i.height;t.style.top=`${n}px`,t.style.left=`${o}px`,t.style.width=`${r}px`,t.style.height=`${p}px`}function M(e,i,t){var n,r,p;let{pip:o}=e;(n=o.querySelector(".pip-close"))==null||n.addEventListener("click",t.onClose),(r=o.querySelector(".pip-minimize"))==null||r.addEventListener("click",t.onMinimize),(p=o.querySelector(".pip-maximize"))==null||p.addEventListener("click",t.onMaximize)}function C(e,i){i.minimized=!i.minimized,e.pip.classList.toggle("minimized",i.minimized),i.minimized&&(i.maximized=!1,e.pip.classList.remove("maximized"))}function L(e,i){i.maximized=!i.maximized,i.minimized=!1,e.pip.classList.toggle("maximized",i.maximized),e.pip.classList.remove("minimized"),a(e,i)}function T(e,i){i.visible=!1,i.minimized=!1,i.maximized=!1,e.pip.style.display="none",e.pip.classList.remove("minimized","maximized"),a(e,i)}var h={mobile:{width:375,height:667},tablet:{width:768,height:1024},desktop:{width:1280,height:800}};function k(e,i,t){e.pip.querySelectorAll(".pip-vp-btn").forEach(o=>{o.addEventListener("click",()=>{let n=o.dataset.vp;n&&n in h&&B(e,i,n,t)})})}function B(e,i,t,o){if(i.viewport=t,e.pip.querySelectorAll(".pip-vp-btn").forEach(n=>{n.classList.toggle("active",n.dataset.vp===t)}),!i.maximized){let{width:n,height:r}=h[t];i.width=Math.min(n,window.innerWidth-20),i.height=Math.min(r,window.innerHeight-20),a(e,i)}o()}function d(e,i){var p,s;if(!i.visible||!e.iframe)return;let t=window.editorManager;if(!t)return;let o=t.activeFile;if(!o){w(e,!0);return}let n=o.filename||"";if(!/\.(html?|htm)$/i.test(n)){w(e,!0);return}w(e,!1);let r=(s=(p=t.editor)==null?void 0:p.state)==null?void 0:s.doc;r&&I(e,i,r.toString())}function I(e,i,t){let{iframe:o,pip:n}=e,r=h[i.viewport],p=`<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { min-height: 100vh; }
  </style>
</head>
<body>
${t}
</body>
</html>`;o.srcdoc=p,i.maximized?(o.style.width="100%",o.style.height="100%"):(o.style.width=`${r.width}px`,o.style.height="100%",n.style.width=`${r.width+2}px`)}function w(e,i){let t=e.pip.querySelector(".pip-empty-state");t&&(t.style.display=i?"":"none"),e.iframe&&(e.iframe.style.display=i?"none":"")}function W(e,i){let t=window.editorManager;if(!t)return()=>{};let o=null,n=()=>d(e,i),r=()=>{o&&clearTimeout(o),o=setTimeout(()=>d(e,i),300)};return t.on("switch-file",n),t.on("file-content-changed",r),()=>{o&&clearTimeout(o),t.off("switch-file",n),t.off("file-content-changed",r)}}function F(e){try{let i=window.acode.require("sideButton");if(!i)return null;let t=i({text:"Web Preview",icon:"eye",onclick:e,backgroundColor:"var(--accent-color, #89b4fa)",textColor:"#1e1e2e"});return t.show(),t}catch{return null}}function H(e,i,t){try{let o=window.acode.require("commands");if(!o)return;o.addCommand({name:"web-preview-pip.toggle",description:"Web Preview PiP: Toggle Preview",bindKey:{win:"Ctrl-Shift-P",mac:"Command-Shift-P"},exec:t.onToggle}),o.addCommand({name:"web-preview-pip.close",description:"Web Preview PiP: Force Close",bindKey:{win:"Ctrl-Shift-X",mac:"Command-Shift-X"},exec:t.onForceClose}),o.addCommand({name:"web-preview-pip.reset",description:"Web Preview PiP: Reset & Close",bindKey:{win:"Ctrl-Shift-R",mac:"Command-Shift-R"},exec:t.onForceReset})}catch{}}var y=class{constructor(){this.elements=null;this.sideButton=null;this.cleanupListeners=null;this.state=x()}async init(i,t,o){this.elements=S(this.state),this.elements&&(a(this.elements,this.state),z(this.elements,this.state,()=>l(this.state)),M(this.elements,this.state,{onMinimize:()=>{C(this.elements,this.state),l(this.state)},onMaximize:()=>{L(this.elements,this.state),l(this.state)},onClose:()=>this.hide()}),k(this.elements,this.state,()=>{l(this.state),d(this.elements,this.state)}),this.cleanupListeners=W(this.elements,this.state),this.sideButton=F(()=>this.toggle()),H(this.elements,this.state,{onToggle:()=>this.toggle(),onForceClose:()=>this.forceClose(),onForceReset:()=>this.forceReset()}))}async destroy(){var i,t;(i=this.cleanupListeners)==null||i.call(this),this.elements&&E(this.elements),(t=this.sideButton)==null||t.hide()}toggle(){this.state.visible?this.hide():this.show()}show(){this.elements&&(this.state.visible=!0,a(this.elements,this.state),this.elements.pip.style.display="",d(this.elements,this.state),l(this.state))}hide(){this.elements&&(this.state.visible=!1,this.elements.pip.style.display="none",l(this.state))}forceClose(){this.elements&&(T(this.elements,this.state),l(this.state))}forceReset(){this.state=b(),this.forceClose()}};if(window.acode){let e=new y;acode.setPluginInit(u.id,async(i,t,{cacheFileUrl:o,cacheFile:n})=>{e.baseUrl=i.endsWith("/")?i:`${i}/`,await e.init(t,n,o)}),acode.setPluginUnmount(u.id,()=>{e.destroy()})}})();
