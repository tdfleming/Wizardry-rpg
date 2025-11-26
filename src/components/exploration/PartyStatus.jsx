import React from 'react';
import { Users } from 'lucide-react';
import { CLASSES } from '../../data/classes';
import { getXpForLevel } from '../../utils/characterUtils';

export function PartyStatus({ party }) {
  return (
    <div className="bg-gray-800 border-2 border-amber-600 rounded-lg p-4">
      <h3 className="font-bold mb-4 flex items-center gap-2">
        <Users size={20} /> Party Status
      </h3>
      <div className="space-y-3">
        {party.map((char) => (
          <div
            key={char.id}
            className={`p-3 rounded ${
              char.alive ? 'bg-gray-700' : 'bg-gray-900 opacity-50'
            }`}
          >
            <div className="font-bold text-lg">{char.name}</div>
            <div className="text-xs text-gray-400 mb-2">
              {CLASSES[char.class].name} Lv.{char.level}
            </div>
            <div className="text-sm space-y-1">
              <div className="flex justify-between">
                <span className="text-green-400">HP:</span>
                <span>{char.hp}/{char.maxHp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-blue-400">MP:</span>
                <span>{char.mp}/{char.maxMp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-purple-400">XP:</span>
                <span>{char.xp}/{getXpForLevel(char.level + 1)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-amber-400">Gold:</span>
                <span>{char.gold}g</span>
              </div>
              <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-600">
                STR:{char.str} INT:{char.int} DEX:{char.dex}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
