# Changelog

## 2.0.0

- 🐛 **Fixed**: Viewport SVG icons for Mobile, Tablet, Desktop, and Eye logo buttons in the window header.
- 🎨 **Enhanced**: Added explicit dimensions and responsive CSS styling for viewport SVG icons.
- ⚡ **Fixed**: Removed redundant URL bar event listeners to eliminate event race conditions and double triggers.
- ⌨️ **Fixed**: Stopped keydown event propagation on URL input to avoid triggering Acode editor keyboard shortcuts.
- 🌐 **Feature**: Integrated URL history navigation (Back/Forward), local server URL preview (`localhost`, `127.0.0.1`), and instant mode switching.
- 💻 **Console**: Integrated in-window console panel with error counter badge and log filtering.

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

## 1.0.0

- Initial release of Web Preview PiP for Acode Editor
- Floating preview window with live HTML/CSS/JS preview
- Draggable header and viewport presets
