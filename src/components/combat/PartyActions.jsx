import React from 'react';
import { CLASSES } from '../../data/classes';
import { SPELLS } from '../../data/spells';

export function PartyActions({
  party,
  combat,
  battleAnimation,
  selectedPartyMember,
  onAttack,
  onCastSpell
}) {
  return (
    <div className="bg-gray-800 border-2 border-amber-600 rounded-lg p-4">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
        👥 Your Party
      </h3>
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {party.filter(p => p.alive).map((char, index) => (
          <div
            key={char.id}
            className={`p-3 rounded border-2 transition-all relative ${
              char.alive ? 'bg-gray-700 border-gray-600' : 'bg-gray-900 border-gray-800 opacity-40'
            } ${(battleAnimation?.attackerId === char.id || battleAnimation?.casterId === char.id) ? 'ring-2 ring-blue-500' : ''}
               ${selectedPartyMember === char.id ? 'ring-4 ring-yellow-400 bg-gray-600' : ''}`}
          >
            {/* Keyboard Number Badge */}
            <div className="absolute -top-2 -left-2 bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-gray-900">
              {index + 1}
            </div>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{CLASSES[char.class].icon}</span>
              <div className="flex-1">
                <div className="font-bold text-sm">{char.name}</div>
                <div className="text-xs text-gray-400">{CLASSES[char.class].name} Lv.{char.level}</div>
              </div>
              <div className="text-right text-xs">
                <div className="text-green-400">HP: {char.hp}/{char.maxHp}</div>
                <div className="text-blue-400">MP: {char.mp}/{char.maxMp}</div>
              </div>
            </div>

            {char.alive && !battleAnimation && (
              <div className="flex flex-wrap gap-1">
                {combat.monsters.filter(m => m.currentHp > 0).map(monster => (
                  <button
                    key={monster.id}
                    onClick={() => onAttack(char.id, monster.id)}
                    className="flex-1 min-w-fit bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-xs font-bold"
                  >
                    ⚔️ {monster.name}
                  </button>
                ))}
                {char.mp >= 3 && SPELLS[char.class] && SPELLS[char.class].map(spell => (
                  <button
                    key={spell}
                    onClick={() => {
                      const target = spell === 'Heal'
                        ? party.find(p => p.alive && p.hp < p.maxHp)?.id
                        : combat.monsters.find(m => m.currentHp > 0)?.id;
                      if (target) onCastSpell(char.id, spell, target);
                    }}
                    className="flex-1 min-w-fit bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-xs font-bold"
                  >
                    ✨ {spell}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
