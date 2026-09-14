# Web Preview PiP

Picture-in-Picture live web preview plugin for [Acode](https://acode.app) editor.

![Version](https://img.shields.io/badge/version-1.1.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Acode](https://img.shields.io/badge/Acode-v290+-orange)

## Features

- **Floating Preview Window** - Small overlay window that stays on top of your editor
- **Live Preview** - Auto-updates when you edit HTML files
- **Draggable** - Move the preview window anywhere on screen
- **Minimize/Maximize** - Collapse to small header or expand to full screen
- **Viewport Modes** - Preview in mobile (375px), tablet (768px), or desktop (1280px)
- **Persistent State** - Window position and settings saved across sessions
- **Keyboard Shortcuts** - Quick access with keyboard combinations

## Installation

### From Acode Plugin Manager

1. Open Acode
2. Go to **Settings** → **Plugins**
3. Tap **+** → **Local** or **Remote**
4. Select or enter the plugin zip file

### From Source

```bash
git clone https://github.com/ihsannyy/acode-plugin-web-preview.git
cd acode-plugin-web-preview
bun install
bun run build
```

Then install the generated `plugin.zip` via Acode Plugin Manager.

## Usage

1. Open an HTML file in the editor
2. Click the **eye icon** in the sidebar, or use the keyboard shortcut below

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl+Shift+V` | Toggle preview window |
| `Ctrl+Shift+Q` | Force close preview |
| `Ctrl+Shift+;` | Reset & close (fix bugs) |

### Viewport Modes

Click the device icons in the preview header to switch between:

| Icon | Mode | Width |
|------|------|-------|
| Phone | Mobile | 375px |
| Tablet | Tablet | 768px |
| Monitor | Desktop | 1280px |

## Development

```bash
bun install
bun run dev        # Start dev server with watch
bun run build      # Production build
bun run typecheck  # Type check only
```

## Tech Stack

- TypeScript
- esbuild (bundling)
- Acode Plugin API

## License

MIT
