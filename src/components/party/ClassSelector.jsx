import React from 'react';
import { CLASSES } from '../../data/classes';
import { SPELLS } from '../../data/spells';
import { Card } from '../ui/Button';

const CLASS_DESCRIPTIONS = {
  FIGHTER: {
    description: "Master of melee combat with exceptional strength and durability.",
    role: "Tank/DPS",
    specialty: "High damage physical attacks"
  },
  MAGE: {
    description: "Wielder of devastating elemental magic and arcane knowledge.",
    role: "Caster/DPS",
    specialty: "Powerful offensive spells"
  },
  PRIEST: {
    description: "Holy warrior blessed with divine magic and healing powers.",
    role: "Support/Healer",
    specialty: "Healing and holy magic"
  },
  THIEF: {
    description: "Swift and deadly assassin with unmatched critical hit potential.",
    role: "DPS/Striker",
    specialty: "Critical hits and evasion"
  },
  RANGER: {
    description: "Versatile scout combining ranged attacks with minor magic.",
    role: "Hybrid/DPS",
    specialty: "Balanced combat abilities"
  },
  PALADIN: {
    description: "Noble defender mixing heavy armor with righteous magic.",
    role: "Tank/Healer",
    specialty: "Durability and healing"
  }
};

export function ClassSelector({ selectedClass, onSelectClass }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {Object.entries(CLASSES).map(([key, cls], index) => {
        const isSelected = selectedClass === key;
        const classInfo = CLASS_DESCRIPTIONS[key];
        const spells = SPELLS[key] || [];

        return (
          <Card
            key={key}
            onClick={() => onSelectClass(key)}
            selected={isSelected}
            className={`
              relative overflow-hidden cursor-pointer
              transition-all duration-300
              ${isSelected
                ? 'ring-4 ring-amber-400 shadow-2xl shadow-amber-500/50 scale-105'
                : 'hover:scale-102 hover:shadow-xl'
              }
              animate-fadeIn
            `}
            style={{ animationDelay: `${index * 50}ms` }}
          >
            {/* Icon Header */}
            <div className="flex items-center gap-3 mb-3">
              <div className={`
                text-5xl drop-shadow-lg transition-transform duration-300
                ${isSelected ? 'scale-110' : ''}
              `}>
                {cls.icon}
              </div>
              <div>
                <div className="font-bold text-xl text-gray-100">{cls.name}</div>
                <div className="text-xs text-amber-400 font-semibold">{classInfo.role}</div>
              </div>
            </div>

            {/* Description */}
            <p className="text-sm text-gray-300 mb-3 leading-relaxed">
              {classInfo.description}
            </p>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-2 mb-3 p-2 bg-black/30 rounded">
              <div className="text-center">
                <div className="text-xs text-gray-400">HP</div>
                <div className="font-bold text-red-400">{cls.hp}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">MP</div>
                <div className="font-bold text-blue-400">{cls.mp}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">STR</div>
                <div className="font-bold text-orange-400">{cls.str}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">INT</div>
                <div className="font-bold text-purple-400">{cls.int}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">DEX</div>
                <div className="font-bold text-green-400">{cls.dex}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-gray-400">Role</div>
                <div className="text-xs font-bold text-amber-400">★</div>
              </div>
            </div>

            {/* Specialty */}
            <div className="mb-3">
              <div className="text-xs text-gray-400 mb-1">Specialty:</div>
              <div className="text-sm font-semibold text-amber-300">
                {classInfo.specialty}
              </div>
            </div>

            {/* Spells/Abilities */}
            {spells.length > 0 && (
              <div>
                <div className="text-xs text-gray-400 mb-1">Abilities:</div>
                <div className="flex flex-wrap gap-1">
                  {spells.map((spell) => (
                    <span
                      key={spell}
                      className="text-xs px-2 py-1 bg-blue-600/30 border border-blue-500/50 rounded text-blue-200"
                    >
                      {spell}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Selection Indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full w-8 h-8 flex items-center justify-center font-bold shadow-lg animate-pulse">
                ✓
              </div>
            )}
          </Card>
        );
      })}
    </div>
  );
}
