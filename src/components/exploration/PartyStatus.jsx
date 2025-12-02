import React from 'react';
import { Users } from 'lucide-react';
import { CLASSES } from '../../data/classes';
import { getXpForLevel } from '../../utils/characterUtils';
import { EnhancedBar } from '../ui/EnhancedBar';

export function PartyStatus({ party }) {
  return (
    <div className="bg-gray-800 border-2 border-amber-600 rounded-lg p-4 animate-fadeIn">
      <h3 className="font-bold mb-4 flex items-center gap-2 text-amber-400">
        <Users size={20} /> Party Status
      </h3>
      <div className="space-y-3">
        {party.map((char, index) => (
          <div
            key={char.id}
            className={`p-3 rounded-lg transition-all duration-300 ${
              char.alive
                ? 'bg-gradient-to-br from-gray-700 to-gray-800 border border-gray-600 hover:border-amber-500 hover:shadow-lg'
                : 'bg-gray-900 opacity-50 grayscale'
            }`}
            style={{
              animationDelay: `${index * 0.1}s`
            }}
          >
            {/* Character Header */}
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="font-bold text-lg flex items-center gap-2">
                  {char.name}
                  {!char.alive && <span className="text-red-500 text-sm">💀</span>}
                </div>
                <div className="text-xs text-gray-400">
                  {CLASSES[char.class].name} • Lv.{char.level}
                </div>
              </div>
              <div className="text-2xl opacity-70">
                {CLASSES[char.class].icon}
              </div>
            </div>

            {/* Status Bars */}
            <div className="space-y-2 mb-2">
              <EnhancedBar
                current={char.hp}
                max={char.maxHp}
                label="HP"
                type="hp"
                height="h-4"
              />
              <EnhancedBar
                current={char.mp}
                max={char.maxMp}
                label="MP"
                type="mp"
                height="h-4"
              />
              <EnhancedBar
                current={char.xp}
                max={getXpForLevel(char.level + 1)}
                label="XP"
                type="xp"
                height="h-3"
              />
            </div>

            {/* Gold and Stats */}
            <div className="flex justify-between items-center text-xs pt-2 border-t border-gray-600">
              <div className="flex items-center gap-1">
                <span className="text-amber-400">💰</span>
                <span className="text-amber-300 font-semibold">{char.gold}g</span>
              </div>
              <div className="text-gray-400 space-x-2">
                <span className="text-red-400">STR:{char.str}</span>
                <span className="text-purple-400">INT:{char.int}</span>
                <span className="text-green-400">DEX:{char.dex}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
