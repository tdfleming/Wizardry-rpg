import React from 'react';
import { Alert, AlertDescription } from '../ui/Alert';
import { CharacterSprite } from './CharacterSprite';
import { MonsterSprite } from './MonsterSprite';
import { BattleAnimations } from './BattleAnimations';
import { PartyActions } from './PartyActions';
import { EnemyInfo } from './EnemyInfo';
import { ParticleSystem } from '../effects/ParticleSystem';
import { ScreenEffects, FloatingText } from '../effects/ScreenEffects';

export function Combat({
  party,
  combat,
  battleAnimation,
  isVictory,
  selectedPartyMember,
  selectedAction,
  message,
  onAttack,
  onCastSpell,
  particles = [],
  onParticleComplete,
  floatingTexts = [],
  onTextComplete,
  screenEffects = {}
}) {
  const aliveParty = party.filter(p => p.alive);
  const aliveMonsters = combat.monsters.filter(m => m.currentHp > 0);

  return (
    <ScreenEffects effects={screenEffects}>
      <div className="w-full min-h-screen bg-gradient-to-b from-red-950 to-gray-900 text-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {message && (
          <Alert className="mb-4 bg-gray-800 border-2 border-red-600 text-gray-100">
            <AlertDescription className="text-center text-lg whitespace-pre-line">
              {message}
            </AlertDescription>
          </Alert>
        )}

        <h2 className="text-3xl font-bold text-center mb-6 text-red-400" style={{ fontFamily: "'Fondamento', serif" }}>
          ⚔️ COMBAT ⚔️
        </h2>

        {/* Battlefield Stage */}
        <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-4 border-red-800 rounded-lg p-8 mb-4 min-h-96 relative overflow-hidden">
          {/* Background texture */}
          <div className="absolute inset-0 opacity-20" style={{
            backgroundImage: 'repeating-linear-gradient(90deg, #444 0px, #444 1px, transparent 1px, transparent 40px)',
          }}></div>

          {/* Party Members (Left Side) */}
          <div className="absolute left-8 top-1/2 transform -translate-y-1/2 space-y-6">
            {aliveParty.map((char) => (
              <CharacterSprite
                key={char.id}
                character={char}
                battleAnimation={battleAnimation}
                isVictory={isVictory}
              />
            ))}
          </div>

          {/* Enemies (Right Side) */}
          <div className="absolute right-8 top-1/2 transform -translate-y-1/2 space-y-6">
            {aliveMonsters.map((monster) => (
              <MonsterSprite
                key={monster.id}
                monster={monster}
                battleAnimation={battleAnimation}
              />
            ))}
          </div>

          {/* Animations */}
          <BattleAnimations battleAnimation={battleAnimation} isVictory={isVictory} />

          {/* Particle System */}
          <ParticleSystem particles={particles} onParticleComplete={onParticleComplete} />

          {/* Floating Combat Text */}
          <FloatingText texts={floatingTexts} onComplete={onTextComplete} />

          {/* Battle Ready Text */}
          {!battleAnimation && !isVictory && (
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <div className="text-2xl font-bold text-gray-500 animate-pulse">
                Choose your action...
              </div>
            </div>
          )}
        </div>

        {/* Action Panels */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <PartyActions
            party={party}
            combat={combat}
            battleAnimation={battleAnimation}
            selectedPartyMember={selectedPartyMember}
            onAttack={onAttack}
            onCastSpell={onCastSpell}
          />
          <EnemyInfo monsters={combat.monsters} battleAnimation={battleAnimation} />
        </div>

        {/* Keyboard Controls Hint */}
        <div className="mt-4 bg-gray-900 border-2 border-gray-700 rounded p-3">
          <div className="text-xs text-gray-400 text-center">
            <span className="font-bold text-amber-400">⌨️ Keys:</span>
            {!selectedPartyMember && !battleAnimation && (
              <span className="ml-2">1-6 = Select Party Member</span>
            )}
            {selectedPartyMember && !selectedAction && (
              <>
                <span className="ml-2 text-yellow-300">A = Attack</span>
                <span className="mx-1">|</span>
                <span className="text-blue-300">S = Spell</span>
                <span className="mx-1">|</span>
                <span className="text-gray-300">ESC = Cancel</span>
              </>
            )}
            {selectedPartyMember && selectedAction && (
              <>
                <span className="ml-2 text-green-300">
                  1-{selectedAction === 'attack' ? aliveMonsters.length : aliveParty.length} = Select Target
                </span>
                <span className="mx-1">|</span>
                <span className="text-gray-300">ESC = Cancel</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
    </ScreenEffects>
  );
}
