<div align="center">

# 🌐 Web Preview PiP

**Live Picture-in-Picture Web Preview Plugin for [Acode Editor](https://acode.app)**

[![Version](https://img.shields.io/badge/version-2.0.0-89b4fa?style=for-the-badge&logo=semver)](plugin.json)
[![Acode](https://img.shields.io/badge/Acode-v290+-fab387?style=for-the-badge&logo=android)](https://acode.app)
[![License](https://img.shields.io/badge/license-MIT-a6e3a1?style=for-the-badge)](LICENSE)

---

A modern, floating Picture-in-Picture (PiP) web preview plugin for **Acode Editor**. Preview, inspect, and test your HTML/CSS/JS live as you type without leaving your editor.

</div>

<br/>

## ✨ Key Features

- 🪟 **Floating Picture-in-Picture** — Overlay preview on top of your editor for side-by-side coding.
- ⚡ **Live Real-Time Sync** — Instant re-rendering as you edit HTML, CSS, or JavaScript files.
- 📱 **Device Viewport Presets** — Quick toggle between **Mobile** (375px), **Tablet** (768px), **Desktop** (1280px), and **Custom** resolutions with working icons.
- 🌐 **Dev Server & URL Mode** — Preview local servers (`http://localhost:3000`, `127.0.0.1:5500`) or web links with URL history support.
- 💻 **In-Window Console** — Capture `console.log`, warnings, and errors directly inside the preview window.
- 🖐️ **Draggable & Resizable** — Move the preview window anywhere on screen and resize using edge handles.
- 🔍 **Zoom & Fullscreen Controls** — Zoom preview in/out from 50% to 200% or expand to fullscreen.
- 💾 **Persistent Workspace** — Remembers window position, dimensions, zoom, and viewport presets across sessions.

<br/>

## ⌨️ Shortcuts & Commands

You can trigger actions via external keyboard shortcuts or Acode's Command Palette:

| Shortcut | Action |
| :--- | :--- |
| `Ctrl + Shift + P` | Toggle Web Preview PiP |
| `Ctrl + Shift + X` | Force Close Window |
| `Ctrl + Shift + R` | Reset Position & Window State |
| `Ctrl + Shift + =` | Zoom In (+10%) |
| `Ctrl + Shift + -` | Zoom Out (-10%) |
| `Ctrl + Shift + \`` | Toggle In-Window Console |
| `F11` | Toggle Fullscreen Mode |

<br/>

## 🚀 Installation

1. Download `plugin.zip` from this repository.
2. Open **Acode Editor** → **Settings** ⚙️ → **Plugins**.
3. Tap **+** (Add) → Choose **Local**.
4. Select `plugin.zip` to install.

<br/>

## 🛠️ Development & Building

```bash
# Type check TypeScript files
npm run typecheck

# Build production bundle & pack zip
npm run build
```

<br/>

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.
