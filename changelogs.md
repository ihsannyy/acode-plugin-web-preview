# Changelog

## 1.2.0

- Added: Dedicated sub-header URL bar for previewing local dev servers (http://localhost:3000, 127.0.0.1:5500)
- Added: Clear button (X) to exit URL mode and return instantly to HTML file preview
- Fixed: Prioritized active HTML file preview by default
- Fixed: Viewport preset buttons (Mobile 375px, Tablet 768px, Desktop 1280px) kept prominent and active in top header
- Fixed: Base URL resolution for relative CSS/JS assets in local HTML files

## 1.1.0

- Fixed: Sidebar button click not showing window (CSS display bug)
- Fixed: Multi-editor support for Ace Editor & CodeMirror document extraction
- Added: Window drag resizing (right edge, bottom edge, and bottom-right corner handles)
- Added: Pointer-events lock during drag and resize

## 1.0.3

- Updated: Author info and repository URL
- Updated: Modular code structure (split into separate files)

## 1.0.2

- Fixed: PiP window covering entire screen after clearing app cache
- Fixed: Added bounds checking for window position and size
- Added: Force close command (Ctrl+Shift+X)
- Added: Force reset command (Ctrl+Shift+R)
- Removed: CSS resize property causing unexpected expansion

## 1.0.0

- Initial release
- Floating preview window with live HTML preview
- Draggable header
- Minimize/maximize/close
- Side button toggle
- Command palette support
- Viewport modes (mobile/tablet/desktop)
- Position persistence via localStorage
