import { useEffect } from 'react';
import { GAME_STATES } from '../data/constants';
import { SPELLS } from '../data/spells';

export function useKeyboardControls({
  gameState,
  combat,
  battleAnimation,
  party,
  selectedPartyMember,
  selectedAction,
  onMove,
  onRest,
  onSelectPartyMember,
  onSelectAction,
  onAttack,
  onCastSpell,
  onCancel,
  setMessage
}) {
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Exploration controls
      if (gameState === GAME_STATES.EXPLORING && !combat) {
        switch(e.key.toLowerCase()) {
          case 'arrowup':
          case 'w':
            e.preventDefault();
            onMove('forward');
            break;
          case 'arrowdown':
          case 's':
            e.preventDefault();
            onMove('back');
            break;
          case 'arrowleft':
          case 'a':
            e.preventDefault();
            onMove('left');
            break;
          case 'arrowright':
          case 'd':
            e.preventDefault();
            onMove('right');
            break;
          case 'r':
            e.preventDefault();
            onRest();
            break;
        }
      }

      // Combat controls
      if (gameState === GAME_STATES.COMBAT && combat && !battleAnimation) {
        const aliveParty = party.filter(p => p.alive);
        const aliveMonsters = combat.monsters.filter(m => m.currentHp > 0);

        // Select party member with number keys 1-6
        if (e.key >= '1' && e.key <= '6') {
          const index = parseInt(e.key) - 1;
          if (index < aliveParty.length) {
            onSelectPartyMember(aliveParty[index].id);
            setMessage(`${aliveParty[index].name} selected. Press A to attack or S to cast spell.`);
          }
        }

        // If party member selected, choose action
        if (selectedPartyMember) {
          if (e.key.toLowerCase() === 'a') {
            onSelectAction('attack');
            setMessage('Select target with 1-' + aliveMonsters.length);
          } else if (e.key.toLowerCase() === 's') {
            const char = party.find(p => p.id === selectedPartyMember);
            if (char && char.mp >= 3 && SPELLS[char.class]) {
              onSelectAction('spell');
              setMessage('Select target with 1-' + (SPELLS[char.class][0] === 'Heal' ? aliveParty.length : aliveMonsters.length));
            }
          }
        }

        // If action selected, execute with target
        if (selectedAction && selectedPartyMember) {
          const targetIndex = parseInt(e.key) - 1;

          if (selectedAction === 'attack' && targetIndex >= 0 && targetIndex < aliveMonsters.length) {
            onAttack(selectedPartyMember, aliveMonsters[targetIndex].id);
          } else if (selectedAction === 'spell' && targetIndex >= 0) {
            const char = party.find(p => p.id === selectedPartyMember);
            if (char && SPELLS[char.class]) {
              const spell = SPELLS[char.class][0];
              const targets = spell === 'Heal' ? aliveParty : aliveMonsters;
              if (targetIndex < targets.length) {
                onCastSpell(selectedPartyMember, spell, targets[targetIndex].id);
              }
            }
          }
        }

        // ESC to cancel selection
        if (e.key === 'Escape') {
          onCancel();
          setMessage('Selection cancelled.');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [
    gameState,
    combat,
    battleAnimation,
    selectedPartyMember,
    selectedAction,
    party,
    onMove,
    onRest,
    onSelectPartyMember,
    onSelectAction,
    onAttack,
    onCastSpell,
    onCancel,
    setMessage
  ]);
}
