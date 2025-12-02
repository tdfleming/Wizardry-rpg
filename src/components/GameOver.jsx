import React, { useEffect, useState } from 'react';
import { Trophy, Skull, RotateCcw } from 'lucide-react';
import { Button } from './ui/Button';
import { AtmosphereEffects } from './effects/AtmosphereEffects';

export function GameOver({ message, onRestart, party = [] }) {
  const [visible, setVisible] = useState(false);

  // Detect if this is a victory or defeat
  const isVictory = message && (
    message.toLowerCase().includes('victorious') ||
    message.toLowerCase().includes('victory') ||
    message.toLowerCase().includes('won') ||
    message.toLowerCase().includes('triumph')
  );

  useEffect(() => {
    // Delay entrance animation
    const timer = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(timer);
  }, []);

  // Calculate party stats
  const totalLevels = party.reduce((sum, char) => sum + (char.level || 1), 0);
  const totalGold = party.reduce((sum, char) => sum + (char.gold || 0), 0);
  const survivingMembers = party.filter(char => char.alive).length;

  return (
    <div className={`
      w-full min-h-screen text-gray-100 p-8 flex items-center justify-center relative overflow-hidden
      ${isVictory
        ? 'bg-gradient-to-b from-yellow-900 via-gray-900 to-black'
        : 'bg-gradient-to-b from-red-950 via-gray-900 to-black'
      }
    `}>
      {/* Atmospheric Effects */}
      <AtmosphereEffects
        intensity={isVictory ? "medium" : "low"}
        theme={isVictory ? "victory" : "dungeon"}
      />

      {/* Vignette Overlay */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/60 pointer-events-none" />

      {/* Main Content */}
      <div className={`
        relative z-10 text-center max-w-3xl mx-auto
        transition-all duration-1000 transform
        ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}
      `}>
        {isVictory ? (
          /* VICTORY SCREEN */
          <>
            {/* Victory Icon */}
            <div className="mb-6 animate-fadeIn">
              <Trophy
                size={120}
                className="mx-auto text-yellow-400 drop-shadow-[0_0_30px_rgba(250,204,21,0.8)] animate-pulse"
              />
            </div>

            {/* Victory Title */}
            <h1
              className="text-6xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-amber-500 to-yellow-400 drop-shadow-lg animate-fadeIn"
              style={{ fontFamily: "'Fondamento', serif", animationDelay: '200ms' }}
            >
              ⚔️ VICTORIOUS! ⚔️
            </h1>

            {/* Victory Subtitle */}
            <div
              className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-yellow-500 to-transparent rounded-full mb-8 animate-fadeIn"
              style={{ animationDelay: '400ms' }}
            />

            {/* Message */}
            <p
              className="text-2xl md:text-3xl mb-8 text-yellow-100 leading-relaxed animate-fadeIn"
              style={{ animationDelay: '600ms' }}
            >
              {message}
            </p>

            {/* Stats Summary */}
            {party.length > 0 && (
              <div
                className="bg-gradient-to-br from-yellow-900/40 to-amber-900/40 border-2 border-yellow-600/50 rounded-lg p-6 mb-8 backdrop-blur-sm animate-fadeIn"
                style={{ animationDelay: '800ms' }}
              >
                <h3 className="text-xl font-bold mb-4 text-yellow-400">Party Summary</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
                  <div>
                    <div className="text-gray-400 text-sm">Heroes Survived</div>
                    <div className="font-bold text-green-400 text-2xl">{survivingMembers}/{party.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Total Levels</div>
                    <div className="font-bold text-blue-400 text-2xl">{totalLevels}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Gold Earned</div>
                    <div className="font-bold text-yellow-400 text-2xl">{totalGold} 💰</div>
                  </div>
                </div>
              </div>
            )}

            {/* Restart Button */}
            <div
              className="animate-fadeIn"
              style={{ animationDelay: '1000ms' }}
            >
              <Button
                onClick={onRestart}
                variant="primary"
                size="xl"
                icon={<RotateCcw size={24} />}
                className="text-xl shadow-2xl hover:shadow-yellow-500/50"
              >
                Begin New Adventure
              </Button>
            </div>
          </>
        ) : (
          /* DEFEAT SCREEN */
          <>
            {/* Defeat Icon */}
            <div className="mb-6 animate-fadeIn">
              <Skull
                size={120}
                className="mx-auto text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.8)] animate-pulse"
              />
            </div>

            {/* Defeat Title */}
            <h1
              className="text-6xl md:text-7xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-red-600 via-red-500 to-red-600 drop-shadow-lg animate-fadeIn"
              style={{ fontFamily: "'Fondamento', serif", animationDelay: '200ms' }}
            >
              💀 DEFEATED 💀
            </h1>

            {/* Defeat Subtitle */}
            <div
              className="h-1 w-48 mx-auto bg-gradient-to-r from-transparent via-red-500 to-transparent rounded-full mb-8 animate-fadeIn"
              style={{ animationDelay: '400ms' }}
            />

            {/* Message */}
            <p
              className="text-2xl md:text-3xl mb-8 text-red-100 leading-relaxed animate-fadeIn"
              style={{ animationDelay: '600ms' }}
            >
              {message}
            </p>

            {/* Stats Summary */}
            {party.length > 0 && (
              <div
                className="bg-gradient-to-br from-red-900/40 to-gray-900/40 border-2 border-red-600/50 rounded-lg p-6 mb-8 backdrop-blur-sm animate-fadeIn"
                style={{ animationDelay: '800ms' }}
              >
                <h3 className="text-xl font-bold mb-4 text-red-400">Final Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-lg">
                  <div>
                    <div className="text-gray-400 text-sm">Heroes Fallen</div>
                    <div className="font-bold text-red-400 text-2xl">{party.length - survivingMembers}/{party.length}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Total Levels</div>
                    <div className="font-bold text-purple-400 text-2xl">{totalLevels}</div>
                  </div>
                  <div>
                    <div className="text-gray-400 text-sm">Gold Lost</div>
                    <div className="font-bold text-yellow-600 text-2xl">{totalGold} 💰</div>
                  </div>
                </div>
              </div>
            )}

            {/* Flavor Text */}
            <p
              className="text-gray-400 italic mb-8 animate-fadeIn"
              style={{ animationDelay: '900ms' }}
            >
              "The dungeon claims another party of brave souls..."
            </p>

            {/* Restart Button */}
            <div
              className="animate-fadeIn"
              style={{ animationDelay: '1000ms' }}
            >
              <Button
                onClick={onRestart}
                variant="danger"
                size="xl"
                icon={<RotateCcw size={24} />}
                className="text-xl shadow-2xl hover:shadow-red-500/50"
              >
                Try Again
              </Button>
            </div>
          </>
        )}

        {/* Footer Quote */}
        <p
          className="mt-12 text-sm text-gray-500 italic animate-fadeIn"
          style={{ animationDelay: '1200ms' }}
        >
          {isVictory
            ? '"Glory awaits those who dare to venture into the unknown..."'
            : '"From defeat comes wisdom, from wisdom comes strength..."'
          }
        </p>
      </div>
    </div>
  );
}
