import React from 'react';

export function MonsterSprite({ monster, battleAnimation }) {
  const isAttacking = battleAnimation?.attackerId === monster.id;
  const isTarget = battleAnimation?.targetId === monster.id;

  return (
    <div
      className={`relative transition-all duration-300 ${
        isAttacking ? 'transform -translate-x-16 scale-110' : ''
      } ${isTarget ? 'animate-shake' : ''}`}
    >
      <div className={`relative ${isTarget ? 'animate-pulse' : ''}`}>
        {/* Monster Aura */}
        <div className="absolute inset-0 rounded-full blur-lg bg-red-900 opacity-30 animate-pulse"
             style={{ animationDuration: '1.5s' }}></div>

        <div className="text-6xl filter drop-shadow-lg relative z-10">
          {monster.icon}
        </div>
        {isTarget && (
          <>
            <div className="absolute inset-0 bg-red-500 opacity-50 rounded-full animate-ping"></div>
            <div className="absolute inset-0 text-6xl animate-spin" style={{ animationDuration: '0.5s' }}>
              💥
            </div>
          </>
        )}
      </div>

      {/* Monster Name & HP Bar */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <div className="text-xs font-bold text-red-300 bg-gray-900 px-2 py-1 rounded mb-1">
          {monster.name}
        </div>
        <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-red-500 transition-all duration-500"
            style={{ width: `${(monster.currentHp / monster.hp) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
}
