import React, { useEffect, useState } from 'react';

// Pointer within this distance of the bottom-left corner reveals the controls
export const REVEAL_ZONE_WIDTH = 420;
export const REVEAL_ZONE_HEIGHT = 120;

interface AutoHideControlsProps {
  children: React.ReactNode;
  /** Keep the controls visible regardless of the pointer, e.g. while an export runs */
  forceVisible?: boolean;
}

/**
 * Bottom-left controls that stay hidden while presenting and appear when the pointer
 * (mouse, pen, or a tap) reaches the bottom-left corner. Keyboard focus also reveals them.
 */
const AutoHideControls: React.FC<AutoHideControlsProps> = ({ children, forceVisible = false }) => {
  const [nearCorner, setNearCorner] = useState(false);

  useEffect(() => {
    const handlePointer = (e: PointerEvent) => {
      setNearCorner(e.clientX <= REVEAL_ZONE_WIDTH && e.clientY >= window.innerHeight - REVEAL_ZONE_HEIGHT);
    };
    window.addEventListener('pointermove', handlePointer);
    window.addEventListener('pointerdown', handlePointer);
    return () => {
      window.removeEventListener('pointermove', handlePointer);
      window.removeEventListener('pointerdown', handlePointer);
    };
  }, []);

  const visible = nearCorner || forceVisible;

  return (
    <div
      data-testid="auto-hide-controls"
      data-visible={visible}
      className={`fixed bottom-4 left-4 z-20 flex gap-2 transition-opacity duration-200 focus-within:opacity-100 focus-within:pointer-events-auto ${
        visible ? 'opacity-100' : 'opacity-0 pointer-events-none'
      }`}
    >
      {children}
    </div>
  );
};

export default AutoHideControls;
