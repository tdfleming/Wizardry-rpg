import { useEffect, useRef } from 'react';
import { buildGame } from './phaserConfig';

// Mounts the Phaser game into a DOM node and tears it down on unmount.
export function PhaserGame() {
  const containerRef = useRef(null);
  const gameRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current || gameRef.current) return undefined;
    let cancelled = false;

    const start = () => {
      if (cancelled || !containerRef.current) return;
      gameRef.current = buildGame(containerRef.current);
    };

    // Wait for the display font so Phaser renders canvas text with it.
    if (document.fonts?.load) {
      Promise.all([
        document.fonts.load("16px 'Fondamento'"),
        document.fonts.load("italic 16px 'Fondamento'"),
      ]).then(start, start);
    } else {
      start();
    }

    return () => {
      cancelled = true;
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
