import React, { useState } from 'react';

/**
 * Tooltip Component
 * Shows helpful information on hover
 */
export function Tooltip({ children, content, position = 'top', delay = 200 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const showTooltip = () => {
    const id = setTimeout(() => setIsVisible(true), delay);
    setTimeoutId(id);
  };

  const hideTooltip = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const positionClasses = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  };

  const arrowClasses = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-gray-900',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-gray-900',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-gray-900',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-gray-900'
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTooltip}
      onMouseLeave={hideTooltip}
    >
      {children}

      {isVisible && content && (
        <div
          className={`
            absolute z-50 ${positionClasses[position]}
            animate-fadeIn
          `}
        >
          <div className="bg-gray-900 text-gray-100 text-sm rounded-lg px-3 py-2 shadow-xl border border-gray-700 max-w-xs whitespace-normal">
            {content}
          </div>
          {/* Arrow */}
          <div
            className={`
              absolute w-0 h-0 ${arrowClasses[position]}
              border-4 border-transparent
            `}
          />
        </div>
      )}
    </div>
  );
}

/**
 * Spell Tooltip - Specialized for showing spell information
 */
export function SpellTooltip({ spell, mpCost, children }) {
  const spellInfo = getSpellInfo(spell);

  const content = (
    <div className="space-y-1">
      <div className="font-bold text-amber-400 flex items-center gap-2">
        {spellInfo.icon} {spell}
      </div>
      <div className="text-xs text-gray-300">{spellInfo.description}</div>
      <div className="flex items-center justify-between text-xs pt-1 border-t border-gray-700">
        <span className="text-blue-400">💧 {mpCost} MP</span>
        <span className={`font-semibold ${spellInfo.damageType === 'heal' ? 'text-green-400' : 'text-red-400'}`}>
          {spellInfo.effect}
        </span>
      </div>
    </div>
  );

  return <Tooltip content={content} position="top" delay={300}>{children}</Tooltip>;
}

/**
 * Get spell information
 */
function getSpellInfo(spellName) {
  const spellDatabase = {
    'Fireball': {
      icon: '🔥',
      description: 'Hurls a blazing sphere of fire at your enemy',
      damageType: 'magic',
      effect: 'High Damage',
      element: 'Fire'
    },
    'Ice Lance': {
      icon: '❄️',
      description: 'Conjures a piercing shard of ice',
      damageType: 'magic',
      effect: 'Medium Damage',
      element: 'Ice'
    },
    'Lightning': {
      icon: '⚡',
      description: 'Summons a bolt of pure electrical energy',
      damageType: 'magic',
      effect: 'High Damage',
      element: 'Lightning'
    },
    'Heal': {
      icon: '💚',
      description: 'Restores health to an ally',
      damageType: 'heal',
      effect: '+25-35 HP',
      element: 'Holy'
    },
    'Bless': {
      icon: '✨',
      description: 'Empowers an ally with holy magic',
      damageType: 'buff',
      effect: 'Buff',
      element: 'Holy'
    },
    'Smite': {
      icon: '⚡',
      description: 'Strikes enemies with holy wrath',
      damageType: 'magic',
      effect: 'Holy Damage',
      element: 'Holy'
    },
    'Quick Shot': {
      icon: '🏹',
      description: 'Fires multiple rapid arrows',
      damageType: 'magic',
      effect: 'Multi-Hit',
      element: 'Physical'
    },
    'Lay on Hands': {
      icon: '🙏',
      description: 'Channel divine energy to heal wounds',
      damageType: 'heal',
      effect: '+20-30 HP',
      element: 'Holy'
    }
  };

  return spellDatabase[spellName] || {
    icon: '✨',
    description: 'A magical ability',
    damageType: 'magic',
    effect: 'Effect',
    element: 'Magic'
  };
}
