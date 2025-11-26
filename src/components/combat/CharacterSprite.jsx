import React from 'react';
import { CLASSES } from '../../data/classes';

export function CharacterSprite({ character, battleAnimation, isVictory }) {
  const isAttacking = battleAnimation?.attackerId === character.id || battleAnimation?.casterId === character.id;
  const isTarget = battleAnimation?.targetId === character.id;

  return (
    <div
      className={`relative transition-all duration-300 ${
        isAttacking
          ? 'transform translate-x-16 scale-110'
          : isVictory
          ? 'animate-victory'
          : ''
      } ${isTarget ? 'animate-shake' : ''}`}
    >
      <div className={`relative ${isTarget ? 'animate-pulse' : ''}`}>
        {/* Class Aura */}
        <div className={`absolute inset-0 rounded-full blur-lg opacity-40 ${
          character.class === 'FIGHTER' || character.class === 'PALADIN' ? 'bg-red-500' :
          character.class === 'MAGE' ? 'bg-purple-500' :
          character.class === 'PRIEST' ? 'bg-yellow-500' :
          character.class === 'THIEF' ? 'bg-gray-500' :
          character.class === 'RANGER' ? 'bg-green-500' : ''
        } animate-pulse`} style={{ animationDuration: '2s' }}></div>

        <div className="text-6xl filter drop-shadow-lg relative z-10">
          {CLASSES[character.class].icon}
        </div>
        {isTarget && (
          <div className="absolute inset-0 bg-red-500 opacity-50 rounded-full animate-ping"></div>
        )}
        {isVictory && (
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 text-2xl animate-bounce">
            🎉
          </div>
        )}
      </div>

      {/* Character Name & HP Bar */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
        <div className="text-xs font-bold text-white bg-gray-900 px-2 py-1 rounded mb-1">
          {character.name}
        </div>
        <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
          <div
            className="h-full bg-green-500 transition-all duration-500"
            style={{ width: `${(character.hp / character.maxHp) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Casting Effect */}
      {battleAnimation?.casterId === character.id && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="text-3xl">✨</div>
        </div>
      )}
    </div>
  );
}
