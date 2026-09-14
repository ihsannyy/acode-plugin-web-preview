<div align="center">

# 🌐 Web Preview PiP for Acode

**Picture-in-Picture Live Web Preview Plugin for [Acode Editor](https://acode.app)**

[![Version](https://img.shields.io/badge/version-1.1.0-89b4fa?style=for-the-badge&logo=semver)](plugin.json)
[![Acode](https://img.shields.io/badge/Acode-v290+-fab387?style=for-the-badge&logo=android)](https://acode.app)
[![License](https://img.shields.io/badge/license-MIT-a6e3a1?style=for-the-badge)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-3178c6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)

---

A modern, highly customizable floating Picture-in-Picture (PiP) web preview plugin designed for **Acode Editor**. Inspect, test, and render HTML/CSS/JS live as you type without switching apps.

</div>

<br/>

## 🌟 Key Features

| Feature | Description |
| :--- | :--- |
| 🪟 **Floating Picture-in-Picture** | Stays overlayed on top of your editor for seamless side-by-side editing. |
| ⚡ **Live Real-Time Sync** | Instantly re-renders changes as you type across Ace Editor & CodeMirror. |
| 📐 **Dynamic Window Resizing** | Drag edges or bottom-right corner handles to resize freely (Windows OS style). |
| 📱 **Viewport Preset Modes** | Quick toggle between **Mobile** (375px), **Tablet** (768px), and **Desktop** (1280px). |
| 🖐️ **Draggable Header** | Move the floating preview anywhere across your mobile screen. |
| 💾 **Persistent Workspace** | Remembers window positions, sizes, and viewport modes across sessions. |
| ⌨️ **Command Palette & Hotkeys** | Full keyboard shortcut support for superfast toggling and resetting. |

<br/>

## 🚀 Installation

### Option 1: Install Pre-built Package (`plugin.zip`)

1. Download or locate `plugin.zip` from this repository.
2. Open **Acode Editor** on your device.
3. Navigate to **Settings** ⚙️ → **Plugins**.
4. Tap **+** (Add) → Choose **Local**.
5. Select `plugin.zip` to install.

### Option 2: Build From Source

Make sure you have [Node.js](https://nodejs.org) or [Bun](https://bun.sh) installed.

```bash
# Clone repository
git clone https://github.com/ihsannyy/acode-plugin-web-preview.git
cd acode-plugin-web-preview

# Install dependencies
npm install

# Build production package
npm run build
```

The compiled `plugin.zip` will be generated in the root directory.

<br/>

## ⌨️ Keyboard Shortcuts & Commands

You can execute actions via hotkeys or Acode's Command Palette:

| Shortcut (Win / Linux) | Shortcut (macOS) | Action |
| :--- | :--- | :--- |
| `Ctrl + Shift + P` | `Cmd + Shift + P` | Toggle Web Preview PiP |
| `Ctrl + Shift + X` | `Cmd + Shift + X` | Force Close Preview Window |
| `Ctrl + Shift + R` | `Cmd + Shift + R` | Reset Position & Window State |

<br/>

## 📐 Viewport Presets

Switch viewports instantly with header icons:

| Icon | Mode | Width | Purpose |
| :---: | :--- | :---: | :--- |
| 📱 | **Mobile** | `375px` | Test smartphone responsive layouts |
| 📑 | **Tablet** | `768px` | Test iPad and tablet screens |
| 💻 | **Desktop** | `1280px` | Test desktop monitors and broad layouts |

*(You can also drag edges or corner handles for any custom resolution)*

<br/>

## 🛠️ Development & Building

```bash
# Type check TypeScript files
npm run typecheck

# Start development server with live watch mode
npm run dev

# Build production bundle & zip package
npm run build
```

<br/>

## 📁 Project Architecture

```
acode-plugin-web-preview/
├── src/
│   ├── main.ts        # Plugin lifecycle entry point
│   ├── pip-window.ts  # DOM construction & window element management
│   ├── preview.ts     # Multi-editor HTML extraction & iframe rendering
│   ├── drag.ts        # Mouse & touch window dragging + edge resizing
│   ├── styles.ts      # UI styling & CSS tokens
│   ├── commands.ts    # Sidebar button registration & hotkeys
│   ├── listeners.ts   # Real-time editor event listeners
│   ├── viewport.ts    # Device resolution presets
│   ├── state.ts       # LocalStorage persistence manager
│   └── types.ts       # TypeScript interfaces
├── plugin.json        # Acode plugin manifest
├── pack-zip.js        # Packaging script
└── esbuild.config.mjs # Bundler setup
```

<br/>

## 📜 License

Distributed under the **MIT License**. See `LICENSE` for details.

---

<div align="center">
Made with ❤️ for the Acode Community
</div>
