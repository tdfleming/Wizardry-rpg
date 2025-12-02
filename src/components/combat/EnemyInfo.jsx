import React from 'react';
import { Skull, Swords, Zap } from 'lucide-react';
import { Badge } from '../ui/Button';

// Determine threat level based on monster stats
const getThreatLevel = (monster) => {
  const avgDamage = monster.damage;
  const totalHp = monster.hp;

  if (avgDamage >= 15 || totalHp >= 50) return 'deadly';
  if (avgDamage >= 10 || totalHp >= 30) return 'dangerous';
  if (avgDamage >= 6 || totalHp >= 20) return 'moderate';
  return 'weak';
};

const THREAT_STYLES = {
  deadly: {
    badge: 'bg-red-600 border-red-400',
    label: 'DEADLY',
    icon: Skull,
    glow: 'shadow-red-500/50'
  },
  dangerous: {
    badge: 'bg-orange-600 border-orange-400',
    label: 'DANGEROUS',
    icon: Swords,
    glow: 'shadow-orange-500/50'
  },
  moderate: {
    badge: 'bg-yellow-600 border-yellow-400',
    label: 'MODERATE',
    icon: Zap,
    glow: 'shadow-yellow-500/50'
  },
  weak: {
    badge: 'bg-green-700 border-green-500',
    label: 'WEAK',
    icon: null,
    glow: 'shadow-green-500/30'
  }
};

export function EnemyInfo({ monsters, battleAnimation }) {
  const aliveMonsters = monsters.filter(m => m.currentHp > 0);

  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-red-600 rounded-lg p-4 shadow-xl">
      <h3 className="text-lg font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Fondamento', serif" }}>
        <span className="text-red-400">👹 Enemies</span>
        <Badge variant="danger" className="text-xs">
          {aliveMonsters.length} Hostile
        </Badge>
      </h3>

      <div className="space-y-3">
        {aliveMonsters.map((monster, index) => {
          const hpPercent = (monster.currentHp / monster.hp) * 100;
          const isLowHp = hpPercent < 30;
          const isAttacking = battleAnimation?.attackerId === monster.id;
          const threatLevel = getThreatLevel(monster);
          const threatStyle = THREAT_STYLES[threatLevel];
          const ThreatIcon = threatStyle.icon;

          return (
            <div
              key={monster.id}
              className={`
                relative overflow-hidden
                bg-gradient-to-br from-red-950/50 to-gray-800/50
                border-2 rounded-lg p-4
                transition-all duration-300
                ${isAttacking
                  ? `ring-4 ring-orange-400 ${threatStyle.glow} shadow-xl scale-105 border-orange-500`
                  : `border-red-800 hover:border-red-600 ${threatStyle.glow}`
                }
              `}
            >
              {/* Target Number Badge */}
              <div className="absolute -top-3 -left-3 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold border-3 border-gray-900 shadow-lg z-10">
                {index + 1}
              </div>

              {/* Threat Level Badge */}
              <div className="absolute -top-3 -right-3 z-10">
                <div className={`
                  ${threatStyle.badge}
                  border-2 rounded-full px-3 py-1
                  text-xs font-bold text-white
                  shadow-lg flex items-center gap-1
                  ${threatLevel === 'deadly' ? 'animate-pulse' : ''}
                `}>
                  {ThreatIcon && <ThreatIcon size={12} />}
                  {threatStyle.label}
                </div>
              </div>

              {/* Attacking Animation Overlay */}
              {isAttacking && (
                <div className="absolute inset-0 bg-orange-500/20 animate-pulse pointer-events-none rounded-lg" />
              )}

              {/* Monster Content */}
              <div className="flex items-start gap-4 pt-2">
                {/* Icon */}
                <div className={`
                  text-5xl drop-shadow-lg transition-transform duration-300
                  ${isAttacking ? 'scale-110 animate-bounce' : ''}
                `}>
                  {monster.icon}
                </div>

                {/* Info */}
                <div className="flex-1">
                  {/* Name */}
                  <div className="font-bold text-xl text-gray-100 mb-1">
                    {monster.name}
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-2 mb-3 text-sm">
                    <div className="flex items-center gap-1">
                      <Swords size={14} className="text-orange-400" />
                      <span className="text-gray-400">DMG:</span>
                      <span className="font-bold text-orange-300">{monster.damage}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap size={14} className="text-blue-400" />
                      <span className="text-gray-400">XP:</span>
                      <span className="font-bold text-blue-300">{monster.xp}</span>
                    </div>
                  </div>

                  {/* HP Bar */}
                  <div className="mb-2">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-xs text-gray-400 font-semibold">Health</span>
                      <span className={`text-xs font-bold ${isLowHp ? 'text-red-400 animate-pulse' : 'text-red-300'}`}>
                        {monster.currentHp} / {monster.hp}
                      </span>
                    </div>
                    <div className="w-full h-4 bg-gray-900 rounded-full overflow-hidden border border-gray-700 shadow-inner">
                      <div
                        className={`
                          h-full transition-all duration-500
                          ${hpPercent > 50
                            ? 'bg-gradient-to-r from-red-600 to-red-500'
                            : hpPercent > 25
                              ? 'bg-gradient-to-r from-orange-600 to-red-500'
                              : 'bg-gradient-to-r from-red-700 to-red-600 animate-pulse'
                          }
                        `}
                        style={{ width: `${hpPercent}%` }}
                      >
                        {hpPercent > 15 && (
                          <div className="w-full h-full bg-gradient-to-r from-white/20 to-transparent" />
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Status Indicators */}
                  {isLowHp && (
                    <div className="text-xs text-red-400 font-semibold flex items-center gap-1 animate-pulse">
                      <Skull size={12} />
                      Wounded!
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
