import React from 'react';

export function BattleAnimations({ battleAnimation, isVictory }) {
  if (!battleAnimation && !isVictory) return null;

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
      {battleAnimation && (
        <>
          {/* Physical Attack - Class Specific */}
          {battleAnimation.type === 'attack' && (
            <>
              {(battleAnimation.attackerClass === 'FIGHTER' || battleAnimation.attackerClass === 'PALADIN') && (
                <div className="absolute" style={{ left: '30%', animation: 'projectile 0.6s ease-out' }}>
                  <div className={`text-8xl ${battleAnimation.isCrit ? 'animate-spin text-red-500' : ''}`}
                       style={{ animationDuration: battleAnimation.isCrit ? '0.15s' : '0.2s' }}>
                    ⚔️
                  </div>
                </div>
              )}
              {battleAnimation.attackerClass === 'THIEF' && (
                <div className="absolute" style={{ left: '30%', animation: 'quickStrike 0.4s ease-out' }}>
                  <div className={`text-6xl ${battleAnimation.isCrit ? 'text-yellow-500' : ''}`}>🗡️💨</div>
                </div>
              )}
              {battleAnimation.attackerClass === 'RANGER' && (
                <div className="absolute" style={{ left: '30%', animation: 'arrow 0.5s linear' }}>
                  <div className={`text-6xl ${battleAnimation.isCrit ? 'text-amber-500' : ''}`}>🏹➤</div>
                </div>
              )}
              {(battleAnimation.attackerClass === 'MAGE' || battleAnimation.attackerClass === 'PRIEST') && (
                <div className="absolute" style={{ left: '30%', animation: 'projectile 0.6s ease-out' }}>
                  <div className="text-6xl">✨💫</div>
                </div>
              )}
              {battleAnimation.isCrit && (
                <>
                  <div className="absolute inset-0 bg-red-500 opacity-30 animate-ping"></div>
                  <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-6xl font-bold text-yellow-400 animate-bounce"
                       style={{ fontFamily: "'Fondamento', serif" }}>
                    💥 CRITICAL! 💥
                  </div>
                </>
              )}
            </>
          )}

          {/* Spell Effects */}
          {battleAnimation.type === 'spell' && (
            <>
              {battleAnimation.spell === 'Fireball' && (
                <div className="absolute" style={{ left: '30%', animation: 'projectile 0.6s ease-out' }}>
                  <div className="relative">
                    <div className="text-8xl animate-pulse">🔥</div>
                    <div className="absolute inset-0 text-6xl animate-spin" style={{ animationDuration: '0.3s' }}>💥</div>
                  </div>
                </div>
              )}
              {battleAnimation.spell === 'Ice Lance' && (
                <div className="absolute" style={{ left: '30%', animation: 'projectile 0.5s linear' }}>
                  <div className="text-8xl">❄️💎</div>
                </div>
              )}
              {battleAnimation.spell === 'Lightning' && (
                <div className="absolute inset-0">
                  <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-yellow-400 animate-pulse"></div>
                  <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-blue-300 animate-ping"></div>
                  <div className="text-8xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">⚡</div>
                </div>
              )}
              {battleAnimation.spell?.includes('Smite') && (
                <div className="absolute inset-0">
                  <div className="absolute inset-0 bg-yellow-200 opacity-40 animate-ping"></div>
                  <div className="text-9xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
                    ⚡✨
                  </div>
                </div>
              )}
              {battleAnimation.spell === 'Quick Shot' && (
                <div className="absolute" style={{ left: '30%', animation: 'arrow 0.3s linear' }}>
                  <div className="text-7xl">🏹💨➤➤</div>
                </div>
              )}
              {battleAnimation.spell === 'Lay on Hands' && (
                <div className="absolute" style={{ left: '30%', animation: 'healing 0.6s ease-out' }}>
                  <div className="text-8xl animate-pulse">🙏✨💚</div>
                </div>
              )}
            </>
          )}

          {/* Heal Effect */}
          {battleAnimation.type === 'heal' && (
            <div className="absolute" style={{ left: '30%', animation: 'healing 0.6s ease-out' }}>
              <div className="relative">
                <div className="text-8xl animate-pulse">💚</div>
                <div className="absolute inset-0 text-6xl animate-spin" style={{ animationDuration: '1s' }}>
                  ✨✨✨
                </div>
              </div>
            </div>
          )}

          {/* Monster Attack */}
          {battleAnimation.type === 'monsterAttack' && (
            <div className="absolute" style={{ left: '70%', animation: 'projectileReverse 0.6s ease-out' }}>
              <div className="text-8xl animate-spin" style={{ animationDuration: '0.2s' }}>💥🔥</div>
            </div>
          )}

          {/* Damage Number */}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className={`font-bold animate-damage ${
              battleAnimation.type === 'heal' ? 'text-green-400 text-7xl' :
              battleAnimation.isCrit ? 'text-yellow-400 text-9xl' :
              'text-red-500 text-7xl'
            }`}>
              {battleAnimation.type === 'heal' ? '+' : '-'}{battleAnimation.damage}
              {battleAnimation.isCrit && <span className="text-5xl">!!!</span>}
            </div>
          </div>
        </>
      )}

      {/* Victory Celebration */}
      {isVictory && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute inset-0 bg-yellow-400 opacity-20 animate-pulse"></div>
          <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center">
            <div className="text-9xl font-bold text-yellow-400 animate-bounce drop-shadow-2xl"
                 style={{ fontFamily: "'Fondamento', serif" }}>
              VICTORY!
            </div>
            <div className="text-5xl mt-4 animate-pulse">⭐✨🎉✨⭐</div>
          </div>
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute text-3xl animate-ping"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 0.5}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              {['🎊', '🎉', '⭐', '✨', '💫'][Math.floor(Math.random() * 5)]}
            </div>
          ))}
        </div>
      )}

      {/* Action Text */}
      {battleAnimation && (
        <div className="absolute bottom-4 left-0 right-0 text-center">
          <div className="text-xl font-bold text-amber-300 bg-gray-900 bg-opacity-90 inline-block px-6 py-3 rounded-lg border-2 border-amber-600">
            {battleAnimation.attackerName || battleAnimation.casterName} → {battleAnimation.targetName}
          </div>
        </div>
      )}
    </div>
  );
}
