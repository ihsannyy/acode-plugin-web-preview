"use strict";(()=>{var r={id:"acode.plugin.webpreviewpip",name:"Web Preview PiP",main:"main.js",version:"1.0.3",readme:"readme.md",changelogs:"changelogs.md",icon:"icon.png",files:[],minVersionCode:290,license:"MIT",keywords:["preview","web","html","pip","live","picture-in-picture"],price:0,author:{name:"ihsannyy",github:"ihsannyy"}};var d={mobile:{width:375,height:667},tablet:{width:768,height:1024},desktop:{width:1280,height:800}},p="web-preview-pip-state",h=class{constructor(){this.baseUrl="";this.$pip=null;this.$iframe=null;this.$header=null;this.$title=null;this.sideButton=null;this.updateTimer=null;this.isDragging=!1;this.dragOffset={x:0,y:0};this.state={visible:!1,minimized:!1,maximized:!1,x:20,y:80,width:350,height:250,viewport:"mobile"};this.boundOnFileSwitch=null;this.boundOnContentChange=null}async init(t,e,s){this.loadState(),this.createPipWindow(),this.registerSideButton(),this.registerCommands(),this.attachEditorListeners()}async destroy(){var t;this.updateTimer&&clearTimeout(this.updateTimer),this.removeEditorListeners(),this.removePipWindow(),(t=this.sideButton)==null||t.hide()}loadState(){try{let s=localStorage.getItem(p);if(s){let i=JSON.parse(s);this.state={...this.state,...i}}}catch{}this.state.visible=!1,this.state.minimized=!1,this.state.maximized=!1;let t=window.innerWidth-20,e=window.innerHeight-20;this.state.width=Math.max(200,Math.min(this.state.width||350,t)),this.state.height=Math.max(150,Math.min(this.state.height||250,e)),this.state.x=Math.max(0,Math.min(this.state.x||20,t-100)),this.state.y=Math.max(0,Math.min(this.state.y||80,e-50))}saveState(){try{localStorage.setItem(p,JSON.stringify(this.state))}catch{}}createPipWindow(){if(this.$pip)return;let t=document.createElement("div");t.id="web-preview-pip",t.style.display="none",t.innerHTML=`
      <style>${this.getStyles()}</style>
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
    `,document.body.appendChild(t),this.$pip=t,this.$iframe=t.querySelector("#pip-iframe"),this.$header=t.querySelector(".pip-header"),this.$title=t.querySelector(".pip-title"),this.applyPosition(),this.setupDrag(),this.setupControls(),this.state.visible&&(t.style.display=""),this.state.minimized&&t.classList.add("minimized"),this.state.maximized&&t.classList.add("maximized")}removePipWindow(){this.$pip&&(this.$pip.remove(),this.$pip=null,this.$iframe=null,this.$header=null,this.$title=null)}getStyles(){return`
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
    `}setupDrag(){if(!this.$header)return;let t=(i,a)=>{this.state.maximized||(this.isDragging=!0,this.dragOffset.x=i-this.state.x,this.dragOffset.y=a-this.state.y)};this.$header.addEventListener("mousedown",i=>{i.target.closest(".pip-controls")||i.target.closest(".pip-viewport-switch")||t(i.clientX,i.clientY)}),this.$header.addEventListener("touchstart",i=>{i.target.closest(".pip-controls")||i.target.closest(".pip-viewport-switch")||t(i.touches[0].clientX,i.touches[0].clientY)},{passive:!0});let e=(i,a)=>{this.isDragging&&(this.state.x=i-this.dragOffset.x,this.state.y=a-this.dragOffset.y,this.applyPosition())};document.addEventListener("mousemove",i=>e(i.clientX,i.clientY)),document.addEventListener("touchmove",i=>{e(i.touches[0].clientX,i.touches[0].clientY)},{passive:!0});let s=()=>{this.isDragging&&(this.isDragging=!1,this.saveState())};document.addEventListener("mouseup",s),document.addEventListener("touchend",s)}applyPosition(){if(!this.$pip)return;if(this.state.maximized){this.$pip.style.top="0",this.$pip.style.left="0",this.$pip.style.width="100vw",this.$pip.style.height="100vh";return}let t=isNaN(this.state.x)?20:this.state.x,e=isNaN(this.state.y)?80:this.state.y,s=isNaN(this.state.width)?350:this.state.width,i=isNaN(this.state.height)?250:this.state.height;this.$pip.style.top=`${e}px`,this.$pip.style.left=`${t}px`,this.$pip.style.width=`${s}px`,this.$pip.style.height=`${i}px`}setupControls(){if(!this.$pip)return;let t=this.$pip.querySelector(".pip-close"),e=this.$pip.querySelector(".pip-minimize"),s=this.$pip.querySelector(".pip-maximize"),i=this.$pip.querySelectorAll(".pip-vp-btn");t==null||t.addEventListener("click",()=>this.hide()),e==null||e.addEventListener("click",()=>this.toggleMinimize()),s==null||s.addEventListener("click",()=>this.toggleMaximize()),i.forEach(a=>{a.addEventListener("click",()=>{let n=a.dataset.vp;n&&this.setViewport(n)})})}setViewport(t){var e;if(this.state.viewport=t,(e=this.$pip)==null||e.querySelectorAll(".pip-vp-btn").forEach(s=>{s.classList.toggle("active",s.dataset.vp===t)}),!this.state.maximized){let{width:s,height:i}=d[t];this.state.width=Math.min(s,window.innerWidth-20),this.state.height=Math.min(i,window.innerHeight-20),this.applyPosition()}this.saveState(),this.refreshPreview()}toggleMinimize(){this.$pip&&(this.state.minimized=!this.state.minimized,this.$pip.classList.toggle("minimized",this.state.minimized),this.state.minimized&&(this.state.maximized=!1,this.$pip.classList.remove("maximized")),this.saveState())}toggleMaximize(){this.$pip&&(this.state.maximized=!this.state.maximized,this.state.minimized=!1,this.$pip.classList.toggle("maximized",this.state.maximized),this.$pip.classList.remove("minimized"),this.applyPosition(),this.saveState())}toggle(){this.state.visible?this.hide():this.show()}show(){this.$pip&&(this.state.visible=!0,this.applyPosition(),this.$pip.style.display="",this.refreshPreview(),this.saveState())}hide(){this.$pip&&(this.state.visible=!1,this.$pip.style.display="none",this.saveState())}refreshPreview(){var a,n;if(!this.state.visible||!this.$iframe)return;let t=window.editorManager;if(!t)return;let e=t.activeFile;if(!e){this.showEmptyState(!0);return}let s=e.filename||"";if(!/\.(html?|htm)$/i.test(s)){this.showEmptyState(!0);return}this.showEmptyState(!1);let i=(n=(a=t.editor)==null?void 0:a.state)==null?void 0:n.doc;i&&this.renderToIframe(i.toString())}renderToIframe(t){if(!this.$iframe)return;let e=d[this.state.viewport],s=`<!DOCTYPE html>
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
</html>`;this.$iframe.srcdoc=s,this.state.maximized?(this.$iframe.style.width="100%",this.$iframe.style.height="100%"):(this.$iframe.style.width=`${e.width}px`,this.$iframe.style.height="100%",this.$pip.style.width=`${e.width+2}px`)}showEmptyState(t){if(!this.$pip)return;let e=this.$pip.querySelector(".pip-empty-state");e&&(e.style.display=t?"":"none"),this.$iframe&&(this.$iframe.style.display=t?"none":"")}attachEditorListeners(){let t=window.editorManager;t&&(this.boundOnFileSwitch=()=>this.refreshPreview(),this.boundOnContentChange=()=>{this.updateTimer&&clearTimeout(this.updateTimer),this.updateTimer=setTimeout(()=>this.refreshPreview(),300)},t.on("switch-file",this.boundOnFileSwitch),t.on("file-content-changed",this.boundOnContentChange))}removeEditorListeners(){let t=window.editorManager;t&&(this.boundOnFileSwitch&&t.off("switch-file",this.boundOnFileSwitch),this.boundOnContentChange&&t.off("file-content-changed",this.boundOnContentChange))}registerSideButton(){try{let t=window.acode.require("sideButton");if(!t)return;let e=t({text:"Web Preview",icon:"eye",onclick:()=>this.toggle(),backgroundColor:"var(--accent-color, #89b4fa)",textColor:"#1e1e2e"});this.sideButton=e,e.show()}catch{}}registerCommands(){try{let t=window.acode.require("commands");if(!t)return;t.addCommand({name:"web-preview-pip.toggle",description:"Web Preview PiP: Toggle Preview",bindKey:{win:"Ctrl-Shift-V",mac:"Command-Shift-V"},exec:()=>this.toggle()}),t.addCommand({name:"web-preview-pip.close",description:"Web Preview PiP: Force Close",bindKey:{win:"Ctrl-Shift-Q",mac:"Command-Shift-Q"},exec:()=>this.forceClose()}),t.addCommand({name:"web-preview-pip.reset",description:"Web Preview PiP: Reset & Close",bindKey:{win:"Ctrl-Shift-;",mac:"Command-Shift-;"},exec:()=>this.forceReset()})}catch{}}forceClose(){this.$pip&&(this.state.visible=!1,this.state.minimized=!1,this.state.maximized=!1,this.$pip.style.display="none",this.$pip.classList.remove("minimized","maximized"),this.applyPosition(),this.saveState())}forceReset(){try{localStorage.removeItem(p)}catch{}this.state={visible:!1,minimized:!1,maximized:!1,x:20,y:80,width:350,height:250,viewport:"mobile"},this.forceClose()}};if(window.acode){let o=new h;acode.setPluginInit(r.id,async(t,e,{cacheFileUrl:s,cacheFile:i})=>{o.baseUrl=t.endsWith("/")?t:`${t}/`,await o.init(e,i,s)}),acode.setPluginUnmount(r.id,()=>{o.destroy()})}})();
