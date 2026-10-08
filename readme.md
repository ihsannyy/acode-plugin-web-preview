<div align="center">

# 🌐 Web Preview PiP

**Live Picture-in-Picture Web & Markdown Preview Plugin for [Acode Editor](https://acode.app)**

[![Version](https://img.shields.io/badge/version-2.1.0-89b4fa?style=for-the-badge&logo=semver)](plugin.json)
[![Acode](https://img.shields.io/badge/Acode-v290+-fab387?style=for-the-badge&logo=android)](https://acode.app)
[![License](https://img.shields.io/badge/license-MIT-a6e3a1?style=for-the-badge)](LICENSE)

---

[**📦 Acode Store Page**](https://acode.app/plugin/acode.plugin.webpreviewpip) &nbsp;|&nbsp; [**📂 GitHub Repository**](https://github.com/ihsannyy/acode-plugin-web-preview) &nbsp;|&nbsp; [**🐛 Report Bug**](https://github.com/ihsannyy/acode-plugin-web-preview/issues)

---

</div>

<br/>

## 🚀 Overview

Coding HTML, CSS, JS, or writing Markdown on mobile and constantly switching between Acode and your browser? 

**Web Preview PiP** brings a floating, live Picture-in-Picture (PiP) window straight into Acode Editor! Edit code or documentation and inspect real-time changes instantly without leaving your editor.

<br/>

## ✨ Key Features

- 🪟 **Floating Picture-in-Picture Window** — Draggable and resizable overlay window that stays on top of your editor.
- ⚡ **Live Real-Time Sync & Hot Reload** — Instant updates for **HTML**, **CSS**, **JS**, and **Markdown (`.md`)** files as you type.
- 📝 **Markdown Live Rendering** — Render Markdown files with clean Catppuccin theme formatting, tables, code blocks, and blockquotes.
- 📱 **Multi-Device Viewport Presets** — Toggle presets for **Mobile** (375px), **Tablet** (768px), **Desktop** (1280px), or enter a **Custom** pixel width.
- 🌐 **Dev Server & URL Bar** — Test local servers (`localhost:3000`, `127.0.0.1:5500`) or web links with history navigation (`Back` / `Forward`).
- 💻 **In-Window Console** — Real-time interception for `console.log`, `console.warn`, `console.error`, and runtime exceptions.
- 🔍 **Zoom & Fullscreen Controls** — Zoom preview in/out (50% - 200%) or expand to complete fullscreen with `F11`.
- 💾 **Persistent Workspace State** — Remembers window coordinates, size, zoom scale, and active viewports across sessions.

<br/>

## ⌨️ Shortcuts & Commands

Access via external keyboard shortcuts or Acode Command Palette (`Ctrl + Shift + P`):

| Shortcut | Command Description |
| :--- | :--- |
| `Ctrl + Shift + P` | Toggle Web Preview Window |
| `Ctrl + Shift + X` | Force Close Window |
| `Ctrl + Shift + R` | Reset Position & Window State |
| `Ctrl + Shift + =` | Zoom In (+10%) |
| `Ctrl + Shift + -` | Zoom Out (-10%) |
| `Ctrl + Shift + \`` | Toggle In-Window Console |
| `F11` | Toggle Fullscreen Mode |

<br/>

## 📦 Installation

### Option 1: Acode Plugin Store (Recommended)
1. Open **Acode Editor** → **Settings** ⚙️ → **Plugins**.
2. Search for **Web Preview PiP**.
3. Tap **Install**.

### Option 2: Manual Installation
1. Download `plugin.zip` from [Releases](https://github.com/ihsannyy/acode-plugin-web-preview/releases).
2. Open **Acode Editor** → **Settings** ⚙️ → **Plugins**.
3. Tap **+** (Add) → Choose **Local**.
4. Select `plugin.zip` to install.

<br/>

## 🐛 Bug Reports & Feature Requests

Found a bug or have an idea to improve Web Preview PiP?
- **Submit an Issue:** [GitHub Issues](https://github.com/ihsannyy/acode-plugin-web-preview/issues)
- Please include your device model, Android version, and steps to reproduce the issue.

<br/>

## 🛠️ Building from Source

```bash
# Typecheck TypeScript files
node ./node_modules/typescript/bin/tsc --noEmit

# Bundle production release
node esbuild.config.mjs
```

<br/>

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

<div align="center">
  <b>Developed for the Acode Community</b>
</div>
