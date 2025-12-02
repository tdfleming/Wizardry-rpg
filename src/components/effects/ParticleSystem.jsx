import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Particle System Component
 * Renders and animates particles for visual effects
 */
export function ParticleSystem({ particles, onParticleComplete }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map(particle => (
        <Particle
          key={particle.id}
          {...particle}
          onComplete={() => onParticleComplete(particle.id)}
        />
      ))}
    </div>
  );
}

/**
 * Individual Particle Component
 */
function Particle({ id, x, y, vx, vy, lifetime, size, color, shape, rotation, onComplete }) {
  const [opacity, setOpacity] = useState(1);
  const [position, setPosition] = useState({ x, y });
  const [rot, setRot] = useState(rotation || 0);
  const startTime = useRef(Date.now());
  const frameRef = useRef();

  useEffect(() => {
    const animate = () => {
      const elapsed = Date.now() - startTime.current;
      const progress = elapsed / lifetime;

      if (progress >= 1) {
        onComplete();
        return;
      }

      // Update position with velocity and gravity
      const newX = x + vx * elapsed / 16;
      const newY = y + vy * elapsed / 16 + (0.0005 * elapsed * elapsed); // gravity

      setPosition({ x: newX, y: newY });
      setOpacity(1 - progress);
      setRot((rotation || 0) + progress * 360);

      frameRef.current = requestAnimationFrame(animate);
    };

    frameRef.current = requestAnimationFrame(animate);

    return () => {
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  return (
    <div
      className="absolute particle"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        width: `${size}px`,
        height: `${size}px`,
        opacity,
        transform: `translate(-50%, -50%) rotate(${rot}deg)`,
        transition: 'none'
      }}
    >
      {shape === 'circle' && (
        <div
          className="w-full h-full rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      {shape === 'square' && (
        <div
          className="w-full h-full"
          style={{ backgroundColor: color }}
        />
      )}
      {shape === 'spark' && (
        <div
          className="w-full h-1"
          style={{ backgroundColor: color }}
        />
      )}
      {shape === 'star' && (
        <div className="text-center" style={{ fontSize: `${size}px`, lineHeight: 1 }}>
          ✨
        </div>
      )}
      {shape === 'heart' && (
        <div className="text-center" style={{ fontSize: `${size}px`, lineHeight: 1, color }}>
          ❤️
        </div>
      )}
      {shape === 'flame' && (
        <div className="text-center" style={{ fontSize: `${size}px`, lineHeight: 1 }}>
          🔥
        </div>
      )}
      {shape === 'ice' && (
        <div className="text-center" style={{ fontSize: `${size}px`, lineHeight: 1 }}>
          ❄️
        </div>
      )}
      {shape === 'lightning' && (
        <div className="text-center" style={{ fontSize: `${size}px`, lineHeight: 1 }}>
          ⚡
        </div>
      )}
    </div>
  );
}

/**
 * Custom hook for managing particles
 */
export function useParticles() {
  const [particles, setParticles] = useState([]);
  const nextId = useRef(0);

  const addParticles = useCallback((newParticles) => {
    const particlesWithIds = newParticles.map(p => ({
      ...p,
      id: nextId.current++
    }));
    setParticles(prev => [...prev, ...particlesWithIds]);
  }, []);

  const removeParticle = useCallback((id) => {
    setParticles(prev => prev.filter(p => p.id !== id));
  }, []);

  const clearParticles = useCallback(() => {
    setParticles([]);
  }, []);

  return {
    particles,
    addParticles,
    removeParticle,
    clearParticles
  };
}

/**
 * Particle preset generators
 */
export const ParticlePresets = {
  // Hit sparks - burst on physical attack impact
  hitSparks: (x, y, count = 12) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 2 + Math.random() * 3;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2, // upward bias
        lifetime: 400 + Math.random() * 300,
        size: 3 + Math.random() * 4,
        color: `hsl(${30 + Math.random() * 30}, 100%, 60%)`, // orange to yellow
        shape: 'spark',
        rotation: Math.random() * 360
      });
    }
    return particles;
  },

  // Magic glitter - floating magical particles
  magicGlitter: (x, y, color = '#9333ea', count = 20) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 1 + Math.random() * 2;
      particles.push({
        x: x + (Math.random() - 0.5) * 40,
        y: y + (Math.random() - 0.5) * 40,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 3, // float upward
        lifetime: 600 + Math.random() * 400,
        size: 6 + Math.random() * 8,
        color,
        shape: 'star',
        rotation: 0
      });
    }
    return particles;
  },

  // Fire embers - floating up with flicker
  fireEmbers: (x, y, count = 15) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 60,
        y: y + Math.random() * 20,
        vx: (Math.random() - 0.5) * 1,
        vy: -2 - Math.random() * 2, // rise up
        lifetime: 800 + Math.random() * 400,
        size: 12 + Math.random() * 8,
        color: `hsl(${10 + Math.random() * 30}, 100%, 50%)`,
        shape: 'flame',
        rotation: 0
      });
    }
    return particles;
  },

  // Ice crystals - shattering effect
  iceCrystals: (x, y, count = 16) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 3 + Math.random() * 4;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        lifetime: 500 + Math.random() * 300,
        size: 12 + Math.random() * 8,
        color: '#3b82f6',
        shape: 'ice',
        rotation: Math.random() * 360
      });
    }
    return particles;
  },

  // Lightning bolts - crackling electricity
  lightningBolts: (x, y, count = 10) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 4 + Math.random() * 4;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        lifetime: 300 + Math.random() * 200,
        size: 16 + Math.random() * 12,
        color: '#facc15',
        shape: 'lightning',
        rotation: 0
      });
    }
    return particles;
  },

  // Healing motes - gentle rising particles
  healingMotes: (x, y, count = 18) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      particles.push({
        x: x + (Math.random() - 0.5) * 50,
        y: y + Math.random() * 30,
        vx: (Math.random() - 0.5) * 0.5,
        vy: -2 - Math.random() * 1.5, // gentle rise
        lifetime: 1000 + Math.random() * 500,
        size: 10 + Math.random() * 6,
        color: '#22c55e',
        shape: 'heart',
        rotation: 0
      });
    }
    return particles;
  },

  // Death explosion - dramatic burst
  deathExplosion: (x, y, count = 30) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 4 + Math.random() * 6;
      const isSmoke = i % 3 === 0;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1,
        lifetime: 600 + Math.random() * 400,
        size: isSmoke ? 15 + Math.random() * 10 : 4 + Math.random() * 6,
        color: isSmoke ? '#6b7280' : `hsl(${Math.random() * 30}, 100%, 50%)`,
        shape: isSmoke ? 'circle' : 'spark',
        rotation: Math.random() * 360
      });
    }
    return particles;
  },

  // Treasure sparkle - shimmering effect
  treasureSparkle: (x, y, count = 25) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 0.5 + Math.random() * 1.5;
      particles.push({
        x: x + (Math.random() - 0.5) * 30,
        y: y + (Math.random() - 0.5) * 30,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        lifetime: 800 + Math.random() * 400,
        size: 8 + Math.random() * 6,
        color: `hsl(${45 + Math.random() * 15}, 100%, 60%)`, // gold
        shape: 'star',
        rotation: 0
      });
    }
    return particles;
  },

  // Level up burst - radial explosion
  levelUpBurst: (x, y, count = 40) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 3 + Math.random() * 5;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 2,
        lifetime: 1000 + Math.random() * 500,
        size: 10 + Math.random() * 8,
        color: `hsl(${Math.random() * 360}, 100%, 60%)`, // rainbow
        shape: 'star',
        rotation: 0
      });
    }
    return particles;
  },

  // Critical hit flash - intense burst
  criticalBurst: (x, y, count = 25) => {
    const particles = [];
    for (let i = 0; i < count; i++) {
      const angle = (Math.PI * 2 * i) / count;
      const speed = 5 + Math.random() * 6;
      particles.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        lifetime: 400 + Math.random() * 200,
        size: 6 + Math.random() * 8,
        color: '#facc15', // yellow/gold
        shape: 'spark',
        rotation: Math.random() * 360
      });
    }
    return particles;
  }
};
