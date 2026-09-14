import type { PipElements, PipState } from "./types";

let isDragging = false;
let isResizing = false;
let resizeDir: "se" | "r" | "b" | null = null;

const startPos = { x: 0, y: 0 };
const startDim = { x: 0, y: 0, w: 0, h: 0 };

export function setupDrag(
  elements: PipElements,
  state: PipState,
  onDragEnd: () => void
): void {
  const { header, pip } = elements;

  // --- MOVE DRAGGING ---
  const onMoveStart = (clientX: number, clientY: number) => {
    if (state.maximized || state.minimized) return;
    isDragging = true;
    pip.classList.add("is-dragging");
    startPos.x = clientX - state.x;
    startPos.y = clientY - state.y;
  };

  header.addEventListener("mousedown", (e) => {
    if ((e.target as HTMLElement).closest(".pip-controls")) return;
    if ((e.target as HTMLElement).closest(".pip-viewport-switch")) return;
    onMoveStart(e.clientX, e.clientY);
  });

  header.addEventListener("touchstart", (e) => {
    if ((e.target as HTMLElement).closest(".pip-controls")) return;
    if ((e.target as HTMLElement).closest(".pip-viewport-switch")) return;
    if (e.touches.length > 0) {
      onMoveStart(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  // --- RESIZE DRAGGING ---
  const onResizeStart = (clientX: number, clientY: number, dir: "se" | "r" | "b") => {
    if (state.maximized || state.minimized) return;
    isResizing = true;
    resizeDir = dir;
    pip.classList.add("is-resizing");
    startPos.x = clientX;
    startPos.y = clientY;
    startDim.w = state.width;
    startDim.h = state.height;
  };

  pip.querySelectorAll(".pip-resizer").forEach((resizer) => {
    const dir = (resizer as HTMLElement).getAttribute("data-dir") as "se" | "r" | "b";

    resizer.addEventListener("mousedown", (e) => {
      e.stopPropagation();
      e.preventDefault();
      onResizeStart((e as MouseEvent).clientX, (e as MouseEvent).clientY, dir);
    });

    resizer.addEventListener("touchstart", (e) => {
      e.stopPropagation();
      if ((e as TouchEvent).touches.length > 0) {
        onResizeStart(
          (e as TouchEvent).touches[0].clientX,
          (e as TouchEvent).touches[0].clientY,
          dir
        );
      }
    }, { passive: true });
  });

  // --- GLOBAL POINTER MOVE & END ---
  const onPointerMove = (clientX: number, clientY: number) => {
    if (isDragging) {
      state.x = clientX - startPos.x;
      state.y = clientY - startPos.y;
      applyPosition(elements, state);
    } else if (isResizing && resizeDir) {
      const deltaX = clientX - startPos.x;
      const deltaY = clientY - startPos.y;

      const minW = 200;
      const minH = 150;
      const maxW = Math.max(minW, window.innerWidth - state.x - 10);
      const maxH = Math.max(minH, window.innerHeight - state.y - 10);

      if (resizeDir === "se" || resizeDir === "r") {
        state.width = Math.max(minW, Math.min(startDim.w + deltaX, maxW));
      }
      if (resizeDir === "se" || resizeDir === "b") {
        state.height = Math.max(minH, Math.min(startDim.h + deltaY, maxH));
      }

      applyPosition(elements, state);
    }
  };

  document.addEventListener("mousemove", (e) => onPointerMove(e.clientX, e.clientY));
  document.addEventListener("touchmove", (e) => {
    if (e.touches.length > 0) {
      onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, { passive: true });

  const onPointerEnd = () => {
    if (isDragging || isResizing) {
      isDragging = false;
      isResizing = false;
      resizeDir = null;
      pip.classList.remove("is-dragging", "is-resizing");
      onDragEnd();
    }
  };

  document.addEventListener("mouseup", onPointerEnd);
  document.addEventListener("touchend", onPointerEnd);
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
  const maxW = Math.max(200, window.innerWidth - 20);
  const maxH = Math.max(150, window.innerHeight - 20);

  let x = isNaN(state.x) ? 20 : state.x;
  let y = isNaN(state.y) ? 80 : state.y;
  let w = isNaN(state.width) ? 350 : state.width;
  let h = isNaN(state.height) ? 250 : state.height;

  w = Math.max(200, Math.min(w, maxW));
  h = Math.max(150, Math.min(h, maxH));
  x = Math.max(0, Math.min(x, Math.max(0, window.innerWidth - 60)));
  y = Math.max(0, Math.min(y, Math.max(0, window.innerHeight - 40)));

  pip.style.top = `${y}px`;
  pip.style.left = `${x}px`;
  pip.style.width = `${w}px`;
  pip.style.height = `${h}px`;
}
