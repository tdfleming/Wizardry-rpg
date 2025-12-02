import React, { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Screen Effects Component
 * Handles screen shake, flash effects, and camera effects
 */
export function ScreenEffects({ children, effects }) {
  const { shake, flash, freeze } = effects || {};

  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Flash overlay */}
      {flash && (
        <div
          className={`absolute inset-0 pointer-events-none z-50 ${flash.className}`}
          style={{
            backgroundColor: flash.color,
            opacity: flash.opacity,
            animation: `flashFade ${flash.duration}ms ease-out`,
            mixBlendMode: flash.blend || 'normal'
          }}
        />
      )}

      {/* Main content with shake */}
      <div
        className={shake ? `animate-${shake.intensity}Shake` : ''}
        style={{
          width: '100%',
          height: '100%',
          transform: shake ? `translate(${shake.x}px, ${shake.y}px)` : 'none'
        }}
      >
        {children}
      </div>
    </div>
  );
}

/**
 * Custom hook for managing screen effects
 */
export function useScreenEffects() {
  const [effects, setEffects] = useState({});
  const [isFrozen, setIsFrozen] = useState(false);

  // Screen shake
  const shake = useCallback((intensity = 'medium', duration = 400) => {
    const shakeValues = {
      light: { x: 0, y: 0, max: 3 },
      medium: { x: 0, y: 0, max: 8 },
      heavy: { x: 0, y: 0, max: 15 }
    };

    const config = shakeValues[intensity] || shakeValues.medium;

    setEffects(prev => ({
      ...prev,
      shake: { ...config, intensity }
    }));

    setTimeout(() => {
      setEffects(prev => ({ ...prev, shake: null }));
    }, duration);
  }, []);

  // Flash effect
  const flash = useCallback((color = 'rgba(255, 255, 255, 0.5)', duration = 150, blend = 'normal') => {
    setEffects(prev => ({
      ...prev,
      flash: {
        color,
        opacity: 1,
        duration,
        blend,
        className: 'animate-pulse'
      }
    }));

    setTimeout(() => {
      setEffects(prev => ({ ...prev, flash: null }));
    }, duration);
  }, []);

  // Hit-stop (freeze frame)
  const freeze = useCallback((duration = 60) => {
    setIsFrozen(true);
    setEffects(prev => ({ ...prev, freeze: true }));

    setTimeout(() => {
      setIsFrozen(false);
      setEffects(prev => ({ ...prev, freeze: false }));
    }, duration);
  }, []);

  // Combo effects
  const damageFlash = useCallback(() => {
    flash('rgba(255, 0, 0, 0.3)', 100);
  }, [flash]);

  const healFlash = useCallback(() => {
    flash('rgba(34, 197, 94, 0.3)', 150);
  }, [flash]);

  const criticalFlash = useCallback(() => {
    flash('rgba(250, 204, 21, 0.5)', 200);
    shake('heavy', 300);
    freeze(150);
  }, [flash, shake, freeze]);

  const hitEffect = useCallback((isCritical = false) => {
    if (isCritical) {
      criticalFlash();
    } else {
      damageFlash();
      shake('light', 200);
      freeze(60);
    }
  }, [criticalFlash, damageFlash, shake, freeze]);

  const spellImpact = useCallback((spellType) => {
    const effects = {
      fire: () => {
        flash('rgba(255, 100, 0, 0.4)', 200);
        shake('medium', 350);
        freeze(100);
      },
      ice: () => {
        flash('rgba(59, 130, 246, 0.4)', 200);
        shake('light', 250);
        freeze(80);
      },
      lightning: () => {
        flash('rgba(250, 204, 21, 0.6)', 150);
        shake('heavy', 300);
        freeze(120);
      },
      heal: () => {
        healFlash();
      },
      default: () => {
        flash('rgba(147, 51, 234, 0.3)', 180);
        shake('medium', 300);
        freeze(90);
      }
    };

    const effect = effects[spellType?.toLowerCase()] || effects.default;
    effect();
  }, [flash, shake, freeze, healFlash]);

  const deathEffect = useCallback(() => {
    shake('heavy', 500);
    flash('rgba(0, 0, 0, 0.5)', 300);
  }, [shake, flash]);

  return {
    effects,
    isFrozen,
    shake,
    flash,
    freeze,
    hitEffect,
    spellImpact,
    damageFlash,
    healFlash,
    criticalFlash,
    deathEffect
  };
}

/**
 * Floating Combat Text Component
 */
export function FloatingText({ texts, onComplete }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {texts.map(text => (
        <FloatingTextItem key={text.id} {...text} onComplete={onComplete} />
      ))}
    </div>
  );
}

function FloatingTextItem({ id, x, y, value, type, onComplete }) {
  const [position, setPosition] = useState({ x, y });
  const [opacity, setOpacity] = useState(1);
  const startTime = useRef(Date.now());

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      const duration = 1200;
      const progress = elapsed / duration;

      if (progress >= 1) {
        onComplete(id);
        return;
      }

      // Arc trajectory
      const arcHeight = 80;
      const drift = (Math.random() - 0.5) * 30;

      setPosition({
        x: x + drift * progress,
        y: y - arcHeight * Math.sin(progress * Math.PI)
      });

      setOpacity(1 - progress);

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, []);

  const styles = {
    damage: 'text-red-500 font-bold text-5xl',
    critical: 'text-yellow-400 font-black text-7xl drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]',
    heal: 'text-green-400 font-bold text-5xl',
    magic: 'text-purple-500 font-bold text-5xl',
    miss: 'text-gray-400 font-semibold text-3xl'
  };

  const prefix = type === 'heal' ? '+' : type === 'miss' ? '' : '-';
  const displayValue = type === 'miss' ? 'MISS!' : `${prefix}${value}`;

  return (
    <div
      className={`absolute ${styles[type] || styles.damage} pointer-events-none`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        opacity,
        transform: 'translate(-50%, -50%)',
        textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
        WebkitTextStroke: type === 'critical' ? '2px black' : '1px black',
        fontFamily: "'Fondamento', serif"
      }}
    >
      {displayValue}
      {type === 'critical' && <span className="text-4xl">!!!</span>}
    </div>
  );
}

/**
 * Hook for managing floating combat text
 */
export function useFloatingText() {
  const [texts, setTexts] = useState([]);
  const nextId = useRef(0);

  const addText = useCallback((x, y, value, type = 'damage') => {
    const text = {
      id: nextId.current++,
      x,
      y,
      value,
      type
    };
    setTexts(prev => [...prev, text]);
  }, []);

  const removeText = useCallback((id) => {
    setTexts(prev => prev.filter(t => t.id !== id));
  }, []);

  const clearTexts = useCallback(() => {
    setTexts([]);
  }, []);

  return {
    texts,
    addText,
    removeText,
    clearTexts
  };
}
