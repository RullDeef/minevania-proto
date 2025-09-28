import { useState, useRef, useCallback } from 'react';
export const usePan = () => {
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });
  const onMouseDown = useCallback((e: React.MouseEvent) => {
    // Allow panning with middle mouse button or left mouse button + alt key
    if (e.button !== 1 && !(e.button === 0 && e.altKey)) return;
    e.preventDefault();
    isPanning.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    document.body.style.cursor = 'grabbing';
  }, []);
  const onMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    e.preventDefault();
    const dx = e.clientX - lastMousePos.current.x;
    const dy = e.clientY - lastMousePos.current.y;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    setViewOffset(prev => ({ x: prev.x + dx, y: prev.y + dy }));
  }, []);
  const onMouseUp = useCallback((e: React.MouseEvent) => {
    if (!isPanning.current) return;
    e.preventDefault();
    isPanning.current = false;
    document.body.style.cursor = 'crosshair';
  }, []);
  const onMouseLeave = useCallback(() => {
    if (isPanning.current) {
        isPanning.current = false;
        document.body.style.cursor = 'crosshair';
    }
  }, []);
  return {
    viewOffset,
    panHandlers: {
      onMouseDown,
      onMouseMove,
      onMouseUp,
      onMouseLeave,
    },
  };
};