import React from 'react';
import { CLASSES } from '../../data/classes';
import { SPELLS, SPELL_COST } from '../../data/spells';
import { CompactBar } from '../ui/EnhancedBar';
import { ActionButton, Badge } from '../ui/Button';
import { SpellTooltip } from '../ui/Tooltip';

export function PartyActions({
  party,
  combat,
  battleAnimation,
  selectedPartyMember,
  onAttack,
  onCastSpell
}) {
  const aliveParty = party.filter(p => p.alive);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-amber-600 rounded-lg p-4 shadow-xl">
      <h3 className="text-lg font-bold mb-3 flex items-center gap-2 text-amber-400">
        👥 Your Party
      </h3>
      <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
        {aliveParty.map((char, index) => (
          <div
            key={char.id}
            className={`
              p-3 rounded-lg border-2 transition-all duration-300 relative
              bg-gradient-to-br from-gray-700 to-gray-800
              ${(battleAnimation?.attackerId === char.id || battleAnimation?.casterId === char.id)
                ? 'ring-2 ring-blue-400 shadow-lg shadow-blue-500/50'
                : 'border-gray-600 hover:border-gray-500'
              }
              ${selectedPartyMember === char.id
                ? 'ring-4 ring-yellow-400 bg-gradient-to-br from-gray-600 to-gray-700 shadow-xl shadow-yellow-500/30 scale-102'
                : ''
              }
            `}
          >
            {/* Hotkey Badge */}
            <Badge
              variant="primary"
              size="sm"
              className="absolute -top-2 -left-2 w-7 h-7 flex items-center justify-center border-2 border-gray-900 shadow-lg"
            >
              {index + 1}
            </Badge>

            {/* Character Header */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-3xl drop-shadow-lg">{CLASSES[char.class].icon}</span>
              <div className="flex-1">
                <div className="font-bold text-base text-gray-100">{char.name}</div>
                <div className="text-xs text-gray-400">{CLASSES[char.class].name} • Lv.{char.level}</div>
              </div>
            </div>

            {/* Compact Status Bars */}
            <div className="space-y-1 mb-3">
              <CompactBar current={char.hp} max={char.maxHp} type="hp" />
              <CompactBar current={char.mp} max={char.maxMp} type="mp" />
            </div>

            {/* Actions */}
            {char.alive && !battleAnimation && (
              <div className="space-y-2">
                {/* Attack Section */}
                <div>
                  <div className="text-xs text-gray-400 mb-1 font-semibold">⚔️ Attack</div>
                  <div className="flex flex-wrap gap-1">
                    {combat.monsters.filter(m => m.currentHp > 0).map((monster, mIndex) => (
                      <ActionButton
                        key={monster.id}
                        onClick={() => onAttack(char.id, monster.id)}
                        hotkey={`${mIndex + 1}`}
                        className="flex-1 min-w-fit bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white border-red-500 text-xs py-2"
                      >
                        {monster.name}
                      </ActionButton>
                    ))}
                  </div>
                </div>

                {/* Spell Section */}
                {SPELLS[char.class] && SPELLS[char.class].length > 0 && (
                  <div>
                    <div className="text-xs text-gray-400 mb-1 font-semibold flex items-center justify-between">
                      <span>✨ Spells</span>
                      {char.mp < SPELL_COST && (
                        <span className="text-red-400 text-xs">Low MP!</span>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {SPELLS[char.class].map((spell) => {
                        const canCast = char.mp >= SPELL_COST;
                        return (
                          <SpellTooltip key={spell} spell={spell} mpCost={SPELL_COST}>
                            <ActionButton
                              onClick={() => {
                                if (!canCast) return;
                                const target = spell === 'Heal' || spell === 'Lay on Hands'
                                  ? party.find(p => p.alive && p.hp < p.maxHp)?.id
                                  : combat.monsters.find(m => m.currentHp > 0)?.id;
                                if (target) onCastSpell(char.id, spell, target);
                              }}
                              disabled={!canCast}
                              className={`
                                flex-1 min-w-fit text-xs py-2
                                ${canCast
                                  ? 'bg-gradient-to-br from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 border-blue-500'
                                  : 'opacity-50 cursor-not-allowed'
                                }
                              `}
                            >
                              {spell}
                            </ActionButton>
                          </SpellTooltip>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Acting Indicator */}
            {(battleAnimation?.attackerId === char.id || battleAnimation?.casterId === char.id) && (
              <div className="absolute inset-0 bg-blue-500/10 rounded-lg pointer-events-none animate-pulse" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
