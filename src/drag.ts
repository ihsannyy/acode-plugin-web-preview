import type { PipElements, PipState } from "./types";

let isDragging = false;
const dragOffset = { x: 0, y: 0 };

export function setupDrag(
  elements: PipElements,
  state: PipState,
  onDragEnd: () => void
): void {
  const { header } = elements;

  const onStart = (clientX: number, clientY: number) => {
    if (state.maximized) return;
    isDragging = true;
    dragOffset.x = clientX - state.x;
    dragOffset.y = clientY - state.y;
  };

  header.addEventListener("mousedown", (e) => {
    if ((e.target as HTMLElement).closest(".pip-controls")) return;
    if ((e.target as HTMLElement).closest(".pip-viewport-switch")) return;
    onStart(e.clientX, e.clientY);
  });

  header.addEventListener("touchstart", (e) => {
    if ((e.target as HTMLElement).closest(".pip-controls")) return;
    if ((e.target as HTMLElement).closest(".pip-viewport-switch")) return;
    onStart(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  const onMove = (clientX: number, clientY: number) => {
    if (!isDragging) return;
    state.x = clientX - dragOffset.x;
    state.y = clientY - dragOffset.y;
    applyPosition(elements, state);
  };

  document.addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY));
  document.addEventListener("touchmove", (e) => {
    onMove(e.touches[0].clientX, e.touches[0].clientY);
  }, { passive: true });

  const onEnd = () => {
    if (isDragging) {
      isDragging = false;
      onDragEnd();
    }
  };

  document.addEventListener("mouseup", onEnd);
  document.addEventListener("touchend", onEnd);
}

export function applyPosition(elements: PipElements, state: PipState): void {
  const { pip } = elements;
  if (state.maximized) {
    pip.style.top = "0";
    pip.style.left = "0";
    pip.style.width = "100vw";
    pip.style.height = "100vh";
    return;
  }
  const x = isNaN(state.x) ? 20 : state.x;
  const y = isNaN(state.y) ? 80 : state.y;
  const w = isNaN(state.width) ? 350 : state.width;
  const h = isNaN(state.height) ? 250 : state.height;
  pip.style.top = `${y}px`;
  pip.style.left = `${x}px`;
  pip.style.width = `${w}px`;
  pip.style.height = `${h}px`;
}
