import React, { useEffect, useState } from 'react';

/**
 * Atmospheric Effects Component
 * Adds ambient dungeon atmosphere with floating particles and lighting
 */
export function AtmosphereEffects({ intensity = 'medium', theme = 'dungeon' }) {
  const particleCount = {
    low: 10,
    medium: 20,
    high: 30
  }[intensity] || 20;

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Floating dust motes */}
      <FloatingDust count={particleCount} theme={theme} />

      {/* Vignette effect */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-black opacity-30"></div>

      {/* Fog overlay */}
      {theme === 'dungeon' && <FogEffect />}

      {/* Torch flicker light */}
      {theme === 'dungeon' && <TorchLight />}
    </div>
  );
}

/**
 * Floating Dust Particles
 */
function FloatingDust({ count, theme }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDuration: 5 + Math.random() * 10,
    animationDelay: Math.random() * 5,
    size: 1 + Math.random() * 2,
    opacity: 0.1 + Math.random() * 0.3
  }));

  const getColor = () => {
    switch (theme) {
      case 'dungeon':
        return 'bg-gray-400';
      case 'combat':
        return 'bg-red-300';
      case 'treasure':
        return 'bg-amber-300';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <>
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute ${getColor()} rounded-full`}
          style={{
            left: `${particle.left}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity,
            animation: `floatUpDrift ${particle.animationDuration}s linear infinite`,
            animationDelay: `${particle.animationDelay}s`
          }}
        />
      ))}
    </>
  );
}

/**
 * Fog Effect
 */
function FogEffect() {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 bg-gradient-to-b from-gray-900/20 to-transparent"
        style={{
          animation: 'fogDrift 20s ease-in-out infinite'
        }}
      />
      <div
        className="absolute inset-0 bg-gradient-to-t from-gray-900/20 to-transparent"
        style={{
          animation: 'fogDrift 15s ease-in-out infinite reverse'
        }}
      />
    </div>
  );
}

/**
 * Torch Flickering Light
 */
function TorchLight() {
  return (
    <>
      {/* Left torch */}
      <div
        className="absolute left-10 top-20 w-32 h-32 rounded-full bg-orange-500/20 blur-3xl"
        style={{
          animation: 'torchFlicker 0.15s ease-in-out infinite'
        }}
      />

      {/* Right torch */}
      <div
        className="absolute right-10 top-20 w-32 h-32 rounded-full bg-orange-500/20 blur-3xl"
        style={{
          animation: 'torchFlicker 0.2s ease-in-out infinite',
          animationDelay: '0.1s'
        }}
      />
    </>
  );
}

/**
 * Combat Atmosphere - more dramatic
 */
export function CombatAtmosphere({ intensity = 'high' }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Intense red atmosphere */}
      <div className="absolute inset-0 bg-red-950/10 animate-pulse" />

      {/* Floating embers */}
      <FloatingEmbers count={15} />

      {/* Dramatic vignette */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-red-950/50"></div>
    </div>
  );
}

/**
 * Floating Embers for combat
 */
function FloatingEmbers({ count }) {
  const embers = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    animationDuration: 3 + Math.random() * 4,
    animationDelay: Math.random() * 3,
    size: 2 + Math.random() * 3
  }));

  return (
    <>
      {embers.map((ember) => (
        <div
          key={ember.id}
          className="absolute bg-orange-400 rounded-full shadow-[0_0_10px_rgba(251,146,60,0.8)]"
          style={{
            left: `${ember.left}%`,
            width: `${ember.size}px`,
            height: `${ember.size}px`,
            animation: `floatUpDrift ${ember.animationDuration}s ease-in-out infinite`,
            animationDelay: `${ember.animationDelay}s`
          }}
        />
      ))}
    </>
  );
}

/**
 * Victory Atmosphere - celebratory
 */
export function VictoryAtmosphere() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {/* Golden glow */}
      <div className="absolute inset-0 bg-yellow-400/10 animate-pulse" />

      {/* Sparkles */}
      <SparkleEffect count={30} />

      {/* Light rays */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full">
        <div
          className="w-1 h-full bg-gradient-to-b from-yellow-400/30 to-transparent"
          style={{ animation: 'rotate 10s linear infinite' }}
        />
      </div>
    </div>
  );
}

/**
 * Sparkle particles for victory
 */
function SparkleEffect({ count }) {
  const sparkles = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    animationDuration: 1 + Math.random() * 2,
    animationDelay: Math.random() * 2,
    size: 3 + Math.random() * 5
  }));

  return (
    <>
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute text-yellow-300"
          style={{
            left: `${sparkle.left}%`,
            top: `${sparkle.top}%`,
            fontSize: `${sparkle.size}px`,
            animation: `twinkle ${sparkle.animationDuration}s ease-in-out infinite`,
            animationDelay: `${sparkle.animationDelay}s`
          }}
        >
          ✨
        </div>
      ))}
    </>
  );
}
