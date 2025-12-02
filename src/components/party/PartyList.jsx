import React from 'react';
import { Trash2 } from 'lucide-react';
import { CLASSES } from '../../data/classes';
import { SPELLS } from '../../data/spells';
import { IconButton } from '../ui/Button';

export function PartyList({ party, onRemoveCharacter }) {
  if (party.length === 0) {
    return (
      <div className="mb-6 p-8 bg-gray-800/50 border-2 border-dashed border-gray-600 rounded-lg text-center">
        <div className="text-4xl mb-2 opacity-50">👥</div>
        <p className="text-gray-400">No party members yet. Select a class above to begin!</p>
      </div>
    );
  }

  return (
    <div className="mb-6">
      <h4 className="font-bold mb-3 text-lg flex items-center gap-2" style={{ fontFamily: "'Fondamento', serif" }}>
        <span className="text-amber-400">👥 Your Party:</span>
        <span className="text-sm text-gray-400">({party.length}/6)</span>
      </h4>
      <div className="space-y-3">
        {party.map((char, index) => {
          const classData = CLASSES[char.class];
          const spells = SPELLS[char.class] || [];

          return (
            <div
              key={char.id}
              className="
                bg-gradient-to-br from-gray-700 to-gray-800
                border-2 border-gray-600
                rounded-lg p-4
                transition-all duration-300
                hover:border-amber-500
                hover:shadow-lg
                animate-fadeIn
              "
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className="flex items-start justify-between gap-3">
                {/* Character Info */}
                <div className="flex items-start gap-3 flex-1">
                  {/* Icon */}
                  <div className="text-4xl drop-shadow-lg">
                    {classData.icon}
                  </div>

                  {/* Details */}
                  <div className="flex-1">
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-bold text-lg text-gray-100">
                        {char.name}
                      </span>
                      <span className="text-sm text-amber-400">
                        {classData.name}
                      </span>
                    </div>

                    {/* Stats */}
                    <div className="flex flex-wrap gap-3 text-xs mb-2">
                      <div>
                        <span className="text-gray-400">HP:</span>
                        <span className="ml-1 font-bold text-red-400">{char.maxHp}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">MP:</span>
                        <span className="ml-1 font-bold text-blue-400">{char.maxMp}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">STR:</span>
                        <span className="ml-1 font-bold text-orange-400">{char.str}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">INT:</span>
                        <span className="ml-1 font-bold text-purple-400">{char.int}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">DEX:</span>
                        <span className="ml-1 font-bold text-green-400">{char.dex}</span>
                      </div>
                    </div>

                    {/* Abilities */}
                    {spells.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {spells.slice(0, 3).map((spell) => (
                          <span
                            key={spell}
                            className="text-xs px-2 py-0.5 bg-blue-600/20 border border-blue-500/30 rounded text-blue-300"
                          >
                            {spell}
                          </span>
                        ))}
                        {spells.length > 3 && (
                          <span className="text-xs text-gray-400">
                            +{spells.length - 3} more
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Remove Button */}
                <IconButton
                  icon={<Trash2 size={18} />}
                  onClick={() => onRemoveCharacter(char.id)}
                  tooltip="Remove from party"
                  variant="ghost"
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/30"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
