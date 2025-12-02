import React from 'react';

/**
 * Dungeon Details Component
 * Adds atmospheric details like dripping water, cobwebs, and cracks
 */
export function DungeonDetails({ intensity = 'medium' }) {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      <DrippingWater count={intensity === 'high' ? 8 : intensity === 'medium' ? 5 : 3} />
      <Cobwebs count={intensity === 'high' ? 6 : intensity === 'medium' ? 4 : 2} />
      <WallCracks count={intensity === 'high' ? 10 : intensity === 'medium' ? 6 : 3} />
    </div>
  );
}

/**
 * Dripping Water Effect
 */
function DrippingWater({ count }) {
  const drips = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 10 + (i * 80 / count) + Math.random() * 10,
    delay: Math.random() * 5,
    duration: 2 + Math.random() * 2
  }));

  return (
    <>
      {drips.map((drip) => (
        <div
          key={drip.id}
          className="absolute top-0"
          style={{
            left: `${drip.left}%`,
            animationDelay: `${drip.delay}s`
          }}
        >
          {/* Water droplet */}
          <div
            className="relative"
            style={{
              animation: `waterDrip ${drip.duration}s ease-in infinite`,
              animationDelay: `${drip.delay}s`
            }}
          >
            <div className="w-1 h-3 bg-gradient-to-b from-blue-400/60 to-blue-300/40 rounded-full" />
          </div>

          {/* Splash effect */}
          <div
            className="absolute top-full left-1/2 -translate-x-1/2 mt-96"
            style={{
              animation: `waterSplash ${drip.duration}s ease-out infinite`,
              animationDelay: `${drip.delay}s`
            }}
          >
            <div className="text-blue-400/30 text-xs">💧</div>
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * Cobwebs in Corners
 */
function Cobwebs({ count }) {
  const positions = [
    { top: '5%', left: '5%', rotation: 0 },
    { top: '5%', right: '5%', rotation: 90 },
    { top: '30%', left: '2%', rotation: -10 },
    { top: '30%', right: '2%', rotation: 100 },
    { top: '60%', left: '3%', rotation: 5 },
    { top: '60%', right: '3%', rotation: 85 }
  ];

  return (
    <>
      {positions.slice(0, count).map((pos, i) => (
        <div
          key={i}
          className="absolute opacity-20 hover:opacity-40 transition-opacity duration-500"
          style={{
            ...pos,
            transform: `rotate(${pos.rotation}deg)`,
            animation: `cobwebSway ${3 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`
          }}
        >
          <svg width="60" height="60" viewBox="0 0 60 60" className="text-gray-500">
            <path
              d="M 0 0 L 30 30 L 60 0 M 30 30 L 30 60 M 30 30 L 0 60 M 30 30 L 60 60"
              stroke="currentColor"
              strokeWidth="0.5"
              fill="none"
              opacity="0.3"
            />
            <circle cx="30" cy="30" r="2" fill="currentColor" opacity="0.4" />
            <circle cx="0" cy="0" r="1.5" fill="currentColor" opacity="0.5" />
            <circle cx="60" cy="0" r="1.5" fill="currentColor" opacity="0.5" />
            <circle cx="30" cy="60" r="1.5" fill="currentColor" opacity="0.5" />
            <circle cx="0" cy="60" r="1.5" fill="currentColor" opacity="0.5" />
            <circle cx="60" cy="60" r="1.5" fill="currentColor" opacity="0.5" />
          </svg>
        </div>
      ))}
    </>
  );
}

/**
 * Wall Cracks
 */
function WallCracks({ count }) {
  const cracks = Array.from({ length: count }, (_, i) => ({
    id: i,
    top: Math.random() * 80 + 10,
    left: Math.random() * 90 + 5,
    rotation: Math.random() * 360,
    length: 30 + Math.random() * 40,
    opacity: 0.1 + Math.random() * 0.15
  }));

  return (
    <>
      {cracks.map((crack) => (
        <div
          key={crack.id}
          className="absolute"
          style={{
            top: `${crack.top}%`,
            left: `${crack.left}%`,
            transform: `rotate(${crack.rotation}deg)`,
            opacity: crack.opacity
          }}
        >
          <svg width={crack.length} height="3" viewBox={`0 0 ${crack.length} 3`}>
            <path
              d={`M 0 1.5 Q ${crack.length / 3} ${Math.random() * 2}, ${crack.length / 2} 1.5 T ${crack.length} 1.5`}
              stroke="#333"
              strokeWidth="1"
              fill="none"
            />
          </svg>
        </div>
      ))}
    </>
  );
}

/**
 * Animated Chains - for dungeon atmosphere
 */
export function DungeonChains({ count = 2 }) {
  const chains = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: 20 + (i * 60 / count),
    delay: Math.random() * 2
  }));

  return (
    <>
      {chains.map((chain) => (
        <div
          key={chain.id}
          className="absolute top-0"
          style={{
            left: `${chain.left}%`,
            animation: `chainSwing ${4 + Math.random() * 2}s ease-in-out infinite`,
            animationDelay: `${chain.delay}s`,
            transformOrigin: 'top center'
          }}
        >
          <div className="flex flex-col items-center opacity-30">
            {Array.from({ length: 15 }).map((_, i) => (
              <div key={i} className="text-gray-600 text-xs leading-none">⚓</div>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * Flickering Candles
 */
export function Candles({ positions = [] }) {
  const defaultPositions = [
    { left: '10%', bottom: '20%' },
    { right: '10%', bottom: '20%' },
    { left: '50%', bottom: '10%' }
  ];

  const candlePositions = positions.length > 0 ? positions : defaultPositions;

  return (
    <>
      {candlePositions.map((pos, i) => (
        <div
          key={i}
          className="absolute"
          style={pos}
        >
          <div className="relative">
            {/* Candle body */}
            <div className="w-2 h-8 bg-gradient-to-b from-amber-200 to-amber-300 rounded-sm" />

            {/* Flame */}
            <div
              className="absolute -top-3 left-1/2 -translate-x-1/2"
              style={{
                animation: `candleFlame ${0.5 + Math.random() * 0.3}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            >
              <div className="text-orange-500 text-sm">🔥</div>
            </div>

            {/* Glow */}
            <div
              className="absolute -top-4 left-1/2 -translate-x-1/2 w-16 h-16 bg-orange-400/20 rounded-full blur-xl"
              style={{
                animation: `candleGlow ${1 + Math.random() * 0.5}s ease-in-out infinite alternate`,
                animationDelay: `${Math.random() * 0.5}s`
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
}

/**
 * Glowing Mushrooms - for magical atmosphere
 */
export function GlowingMushrooms({ count = 5 }) {
  const mushrooms = Array.from({ length: count }, (_, i) => ({
    id: i,
    left: Math.random() * 90 + 5,
    bottom: Math.random() * 20 + 5,
    color: ['green', 'blue', 'purple'][Math.floor(Math.random() * 3)],
    size: 0.8 + Math.random() * 0.4
  }));

  const colorClasses = {
    green: 'text-green-400',
    blue: 'text-blue-400',
    purple: 'text-purple-400'
  };

  return (
    <>
      {mushrooms.map((mushroom) => (
        <div
          key={mushroom.id}
          className="absolute"
          style={{
            left: `${mushroom.left}%`,
            bottom: `${mushroom.bottom}%`,
            transform: `scale(${mushroom.size})`
          }}
        >
          <div className="relative">
            {/* Mushroom */}
            <div className={`text-2xl ${colorClasses[mushroom.color]}`}>🍄</div>

            {/* Glow */}
            <div
              className={`absolute inset-0 ${colorClasses[mushroom.color]} opacity-40 blur-md`}
              style={{
                animation: `mushroomGlow ${2 + Math.random()}s ease-in-out infinite alternate`
              }}
            />
          </div>
        </div>
      ))}
    </>
  );
}
