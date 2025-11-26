import React from 'react';

export function EnemyInfo({ monsters, battleAnimation }) {
  return (
    <div className="bg-gray-800 border-2 border-red-600 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        👹 Enemies
      </h3>
      <div className="space-y-3">
        {monsters.filter(m => m.currentHp > 0).map((monster, index) => (
          <div
            key={monster.id}
            className={`p-3 rounded border-2 transition-all relative ${
              monster.currentHp > 0
                ? 'bg-gray-700 border-red-900'
                : 'bg-gray-900 border-gray-800 opacity-40'
            } ${battleAnimation?.attackerId === monster.id ? 'ring-2 ring-orange-500' : ''}`}
          >
            {monster.currentHp > 0 && (
              <div className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-gray-900">
                {index + 1}
              </div>
            )}

            <div className="flex items-center gap-3">
              <span className="text-4xl">{monster.icon}</span>
              <div className="flex-1">
                <div className="font-bold">{monster.name}</div>
                <div className="text-sm text-gray-400">DMG: {monster.damage} | XP: {monster.xp}</div>
                <div className="mt-2 w-full h-3 bg-gray-900 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
                    style={{ width: `${(monster.currentHp / monster.hp) * 100}%` }}
                  ></div>
                </div>
                <div className="text-xs text-red-300 mt-1">
                  {monster.currentHp} / {monster.hp} HP
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
