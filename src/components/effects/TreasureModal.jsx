import React, { useEffect, useState } from 'react';
import { Coins, TrendingUp, Users } from 'lucide-react';

export function TreasureModal({ gold, onClose, visible }) {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    if (visible) {
      // Entrance animation
      setTimeout(() => setScale(1), 50);

      // Auto-close after 2.5 seconds
      const timer = setTimeout(() => {
        setScale(0);
        setTimeout(onClose, 300);
      }, 2500);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible) return null;

  const goldPerPerson = gold; // Already divided in parent

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div
        className={`
          absolute inset-0 bg-black/40 backdrop-blur-sm
          transition-opacity duration-300
          ${scale === 1 ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* Modal */}
      <div
        className={`
          relative z-10
          bg-gradient-to-br from-yellow-900 to-amber-900
          border-4 border-yellow-500
          rounded-xl p-8
          shadow-2xl shadow-yellow-500/50
          text-center
          transition-all duration-300
          ${scale === 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
        `}
        style={{ transform: `scale(${scale})` }}
      >
        {/* Treasure Chest Icon */}
        <div className="mb-4 animate-bounce">
          <div className="text-7xl mx-auto drop-shadow-[0_0_20px_rgba(234,179,8,0.8)]">
            💰
          </div>
        </div>

        {/* Title */}
        <h2
          className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-300 drop-shadow-lg"
          style={{ fontFamily: "'Fondamento', serif" }}
        >
          Treasure Found!
        </h2>

        {/* Divider */}
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-yellow-400 to-transparent rounded-full mb-6" />

        {/* Gold Amount */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3 mb-2">
            <Coins size={32} className="text-yellow-300" />
            <div className="text-5xl font-bold text-yellow-300 drop-shadow-lg animate-pulse">
              {goldPerPerson}
            </div>
            <Coins size={32} className="text-yellow-300" />
          </div>
          <div className="text-sm text-yellow-200">
            Gold Coins Per Hero
          </div>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-center gap-6 text-yellow-100 text-sm">
          <div className="flex items-center gap-1">
            <TrendingUp size={16} className="text-yellow-300" />
            <span>Wealth Increased</span>
          </div>
          <div className="flex items-center gap-1">
            <Users size={16} className="text-yellow-300" />
            <span>Party Rewarded</span>
          </div>
        </div>

        {/* Sparkle Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-yellow-300 rounded-full animate-twinkle"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Level Up Modal Component
export function LevelUpModal({ character, onClose, visible }) {
  const [scale, setScale] = useState(0);

  useEffect(() => {
    if (visible) {
      // Entrance animation
      setTimeout(() => setScale(1), 50);

      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        setScale(0);
        setTimeout(onClose, 300);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  if (!visible || !character) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
      {/* Backdrop */}
      <div
        className={`
          absolute inset-0 bg-black/50 backdrop-blur-sm
          transition-opacity duration-300
          ${scale === 1 ? 'opacity-100' : 'opacity-0'}
        `}
      />

      {/* Modal */}
      <div
        className={`
          relative z-10
          bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900
          border-4 border-blue-400
          rounded-xl p-8
          shadow-2xl shadow-blue-500/50
          text-center
          transition-all duration-300
          min-w-[400px]
          ${scale === 1 ? 'scale-100 opacity-100' : 'scale-50 opacity-0'}
        `}
        style={{ transform: `scale(${scale})` }}
      >
        {/* Level Up Icon */}
        <div className="mb-4 animate-bounce">
          <div className="text-7xl mx-auto drop-shadow-[0_0_30px_rgba(96,165,250,0.9)]">
            ⭐
          </div>
        </div>

        {/* Title */}
        <h2
          className="text-4xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-purple-300 to-blue-300 drop-shadow-lg"
          style={{ fontFamily: "'Fondamento', serif" }}
        >
          LEVEL UP!
        </h2>

        {/* Divider */}
        <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-blue-400 to-transparent rounded-full mb-6" />

        {/* Character Info */}
        <div className="mb-6">
          <div className="flex items-center justify-center gap-3 mb-4">
            <span className="text-5xl">{character.icon}</span>
            <div>
              <div className="text-2xl font-bold text-white">{character.name}</div>
              <div className="text-sm text-blue-300">{character.className}</div>
            </div>
          </div>

          <div className="text-5xl font-bold text-blue-300 drop-shadow-lg mb-2 animate-pulse">
            Level {character.level}
          </div>
          <div className="text-sm text-blue-200">
            {character.name} grows stronger!
          </div>
        </div>

        {/* Stats Increased */}
        <div className="bg-black/30 rounded-lg p-4 backdrop-blur-sm">
          <div className="text-xs text-blue-300 mb-2 font-semibold">Stats Increased:</div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="flex items-center justify-between px-2">
              <span className="text-gray-300">Max HP:</span>
              <span className="font-bold text-red-400">+{character.hpGain || 5}</span>
            </div>
            <div className="flex items-center justify-between px-2">
              <span className="text-gray-300">Max MP:</span>
              <span className="font-bold text-blue-400">+{character.mpGain || 3}</span>
            </div>
          </div>
        </div>

        {/* Particle Effects */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className={`
                absolute w-3 h-3 rounded-full animate-twinkle
                ${i % 3 === 0 ? 'bg-blue-400' : i % 3 === 1 ? 'bg-purple-400' : 'bg-pink-400'}
              `}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random() * 2}s`
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
