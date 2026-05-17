import { useEffect, useRef } from 'react';
import { buildGame } from './phaserConfig';

// Mounts the Phaser game into a DOM node and tears it down on unmount.
export function PhaserGame() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return undefined;
    gameRef.current = buildGame(containerRef.current);
    return () => {
      gameRef.current?.destroy(true);
      gameRef.current = null;
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 flex items-center justify-center"
    />
  );
}
