import React, { useEffect } from 'react';
import { PartyCreation } from './components/party/PartyCreation';
import { Exploration } from './components/exploration/Exploration';
import { Combat } from './components/combat/Combat';
import { GameOver } from './components/GameOver';
import { useGameState } from './hooks/useGameState';
import { useKeyboardControls } from './hooks/useKeyboardControls';
import { generateDungeon } from './utils/dungeonUtils';
import { generateMonsters, calculateDamage, checkCriticalHit, applyCriticalMultiplier, calculateHealing } from './utils/combatUtils';
import { checkLevelUp, getXpForLevel } from './utils/characterUtils';
import { GAME_STATES, DIRECTIONS, TILE_TYPES } from './data/constants';
import { SPELL_COST } from './data/spells';
import { useParticles, ParticlePresets } from './components/effects/ParticleSystem';
import { useScreenEffects, useFloatingText } from './components/effects/ScreenEffects';
import './styles/animations.css';

export default function App() {
  const {
    gameState,
    setGameState,
    party,
    setParty,
    position,
    setPosition,
    dungeon,
    setDungeon,
    combat,
    setCombat,
    battleAnimation,
    setBattleAnimation,
    isVictory,
    setIsVictory,
    selectedPartyMember,
    setSelectedPartyMember,
    selectedAction,
    setSelectedAction,
    message,
    setMessage,
    dungeonLevel,
    setDungeonLevel
  } = useGameState();

  // Visual effects systems
  const { particles, addParticles, removeParticle, clearParticles } = useParticles();
  const { effects, hitEffect, spellImpact, healFlash, criticalFlash, deathEffect } = useScreenEffects();
  const { texts, addText, removeText, clearTexts } = useFloatingText();

  // Load Google Font
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fondamento:ital@0;1&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Movement logic
  const move = (direction) => {
    let newFacing = position.facing;
    let movement = { x: 0, y: 0 };

    if (direction === 'forward') {
      movement = DIRECTIONS[position.facing];
    } else if (direction === 'back') {
      const opposite = { N: 'S', S: 'N', E: 'W', W: 'E' };
      movement = DIRECTIONS[opposite[position.facing]];
    } else if (direction === 'left') {
      const left = { N: 'W', W: 'S', S: 'E', E: 'N' };
      newFacing = left[position.facing];
      setPosition({ ...position, facing: newFacing });
      setMessage('You turn left.');
      return;
    } else if (direction === 'right') {
      const right = { N: 'E', E: 'S', S: 'W', W: 'N' };
      newFacing = right[position.facing];
      setPosition({ ...position, facing: newFacing });
      setMessage('You turn right.');
      return;
    }

    const newX = position.x + movement.x;
    const newY = position.y + movement.y;

    if (newX < 0 || newX >= dungeon[0].length || newY < 0 || newY >= dungeon.length) {
      setMessage('You hit a wall!');
      return;
    }

    const tile = dungeon[newY][newX];

    if (tile === TILE_TYPES.WALL) {
      setMessage('A wall blocks your path!');
      return;
    }

    setPosition({ x: newX, y: newY, facing: newFacing });

    if (tile === TILE_TYPES.ENCOUNTER) {
      startCombat();
    } else if (tile === TILE_TYPES.TREASURE) {
      const gold = Math.floor(Math.random() * 50) + 20;
      const goldPerChar = Math.floor(gold / party.filter(p => p.alive).length);
      setParty(party.map(p => p.alive ? ({ ...p, gold: p.gold + goldPerChar }) : p));
      setMessage(`You found ${gold} gold!`);
      // Treasure sparkle effect
      addParticles(ParticlePresets.treasureSparkle(window.innerWidth / 2, window.innerHeight / 2));
      const newDungeon = [...dungeon];
      newDungeon[newY][newX] = TILE_TYPES.FLOOR;
      setDungeon(newDungeon);
    } else if (tile === TILE_TYPES.STAIRS) {
      setMessage('You descend deeper into the dungeon...');
      setDungeonLevel(dungeonLevel + 1);
      setDungeon(generateDungeon());
      setPosition({ x: 0, y: 0, facing: 'N' });
    } else {
      setMessage('You move forward.');
    }
  };

  const rest = () => {
    setParty(party.map(p => ({
      ...p,
      hp: p.alive ? p.maxHp : p.hp,
      mp: p.alive ? p.maxMp : p.mp
    })));
    setMessage('Your party rests and recovers...');
  };

  const startCombat = () => {
    const monsters = generateMonsters(dungeonLevel);
    setCombat({ monsters });
    setBattleAnimation(null);
    setIsVictory(false);
    setGameState(GAME_STATES.COMBAT);
    setMessage('Monsters attack!');
  };

  const attack = (attackerId, targetId) => {
    const attacker = party.find(p => p.id === attackerId);
    const target = combat.monsters.find(m => m.id === targetId);

    if (!attacker || !target || !attacker.alive) return;

    const isCrit = checkCriticalHit(attacker);
    let damage = calculateDamage(attacker, true);
    if (isCrit) damage = applyCriticalMultiplier(damage);

    setBattleAnimation({
      type: 'attack',
      attackerId,
      targetId,
      damage,
      attackerName: attacker.name,
      targetName: target.name,
      attackerClass: attacker.class,
      isCrit
    });

    // Visual effects
    hitEffect(isCrit);

    // Particles based on class
    const centerX = window.innerWidth * 0.6;
    const centerY = window.innerHeight * 0.4;

    if (isCrit) {
      addParticles(ParticlePresets.criticalBurst(centerX, centerY));
    }
    addParticles(ParticlePresets.hitSparks(centerX, centerY));

    // Floating damage text
    addText(centerX, centerY, damage, isCrit ? 'critical' : 'damage');

    setTimeout(() => {
      const newMonsters = combat.monsters.map(m =>
        m.id === targetId ? { ...m, currentHp: Math.max(0, m.currentHp - damage) } : m
      );

      setMessage(`${attacker.name} attacks ${target.name} for ${damage} damage!${isCrit ? ' 💥 CRITICAL HIT!' : ''}`);

      const aliveMonsters = newMonsters.filter(m => m.currentHp > 0);

      if (aliveMonsters.length === 0) {
        // Death particles
        addParticles(ParticlePresets.deathExplosion(centerX, centerY));
        deathEffect();
        setBattleAnimation(null);
        setTimeout(() => endCombat(true, newMonsters), 1000);
      } else {
        setCombat({ ...combat, monsters: newMonsters });
        setTimeout(() => {
          setBattleAnimation(null);
          monsterTurn(aliveMonsters);
        }, 500);
      }
    }, 600);
  };

  const castSpell = (casterId, spell, targetId) => {
    const caster = party.find(p => p.id === casterId);
    if (!caster || !caster.alive || caster.mp < SPELL_COST) return;

    const newParty = party.map(p => p.id === casterId ? { ...p, mp: p.mp - SPELL_COST } : p);
    const centerX = window.innerWidth * 0.6;
    const centerY = window.innerHeight * 0.4;

    if (spell === 'Heal') {
      const healing = calculateHealing();
      const target = party.find(p => p.id === targetId);

      setBattleAnimation({
        type: 'heal',
        casterId,
        targetId,
        damage: healing,
        casterName: caster.name,
        targetName: target.name,
        spell
      });

      // Healing effects
      healFlash();
      addParticles(ParticlePresets.healingMotes(centerX * 0.4, centerY));
      addText(centerX * 0.4, centerY, healing, 'heal');

      setTimeout(() => {
        setParty(newParty.map(p =>
          p.id === targetId ? { ...p, hp: Math.min(p.hp + healing, p.maxHp) } : p
        ));
        setMessage(`${caster.name} heals ${target.name} for ${healing} HP!`);

        setTimeout(() => {
          setBattleAnimation(null);
          monsterTurn(combat.monsters.filter(m => m.currentHp > 0));
        }, 500);
      }, 600);
    } else {
      setParty(newParty);
      const target = combat.monsters.find(m => m.id === targetId);
      const damage = calculateDamage(caster, false);

      setBattleAnimation({
        type: 'spell',
        casterId,
        targetId,
        damage,
        casterName: caster.name,
        targetName: target.name,
        spell
      });

      // Spell-specific effects
      const spellType = spell.toLowerCase().includes('fire') ? 'fire' :
                       spell.toLowerCase().includes('ice') ? 'ice' :
                       spell.toLowerCase().includes('lightning') ? 'lightning' : 'default';

      spellImpact(spellType);

      // Spell-specific particles
      if (spell.includes('Fireball') || spell.includes('Fire')) {
        addParticles(ParticlePresets.fireEmbers(centerX, centerY));
      } else if (spell.includes('Ice')) {
        addParticles(ParticlePresets.iceCrystals(centerX, centerY));
      } else if (spell.includes('Lightning')) {
        addParticles(ParticlePresets.lightningBolts(centerX, centerY));
      } else {
        addParticles(ParticlePresets.magicGlitter(centerX, centerY, '#9333ea'));
      }

      addText(centerX, centerY, damage, 'magic');

      setTimeout(() => {
        const newMonsters = combat.monsters.map(m =>
          m.id === targetId ? { ...m, currentHp: Math.max(0, m.currentHp - damage) } : m
        );

        setMessage(`${caster.name} casts ${spell} on ${target.name} for ${damage} damage!`);

        const aliveMonsters = newMonsters.filter(m => m.currentHp > 0);

        if (aliveMonsters.length === 0) {
          // Death particles
          addParticles(ParticlePresets.deathExplosion(centerX, centerY));
          deathEffect();
          setBattleAnimation(null);
          setTimeout(() => endCombat(true, newMonsters), 1000);
        } else {
          setCombat({ ...combat, monsters: newMonsters });
          setTimeout(() => {
            setBattleAnimation(null);
            monsterTurn(aliveMonsters);
          }, 500);
        }
      }, 600);
    }
  };

  const monsterTurn = (aliveMonsters) => {
    const aliveParty = party.filter(p => p.alive);
    if (aliveParty.length === 0) {
      endCombat(false);
      return;
    }

    aliveMonsters.forEach((monster, i) => {
      setTimeout(() => {
        const currentAlive = party.filter(p => p.alive);
        if (currentAlive.length === 0) return;

        const target = currentAlive[Math.floor(Math.random() * currentAlive.length)];
        const damage = Math.floor(Math.random() * monster.damage) + Math.floor(monster.damage / 2);

        setBattleAnimation({
          type: 'monsterAttack',
          attackerId: monster.id,
          targetId: target.id,
          damage,
          attackerName: monster.name,
          targetName: target.name
        });

        setTimeout(() => {
          setParty(prevParty => {
            const stillAlive = prevParty.filter(p => p.alive);
            if (stillAlive.length === 0) return prevParty;

            setMessage(`${monster.name} attacks ${target.name} for ${damage} damage!`);

            const newParty = prevParty.map(p => {
              if (p.id === target.id) {
                const newHp = Math.max(0, p.hp - damage);
                return { ...p, hp: newHp, alive: newHp > 0 };
              }
              return p;
            });

            if (i === aliveMonsters.length - 1) {
              setTimeout(() => {
                setBattleAnimation(null);
                const stillAliveAfter = newParty.filter(p => p.alive);
                if (stillAliveAfter.length === 0) {
                  endCombat(false);
                }
              }, 500);
            }

            return newParty;
          });
        }, 600);
      }, i * 1400);
    });
  };

  const endCombat = (victory, monsters = combat.monsters) => {
    if (victory) {
      setIsVictory(true);

      const totalXp = monsters.reduce((sum, m) => sum + m.xp, 0);
      const totalGold = Math.floor(Math.random() * 30) + 10;
      const aliveCount = party.filter(p => p.alive).length;

      let updatedParty = party.map(p => p.alive ? {
        ...p,
        xp: p.xp + totalXp,
        gold: p.gold + Math.floor(totalGold / aliveCount)
      } : p);

      // Check for level ups
      const leveledUp = [];
      updatedParty = updatedParty.map(char => {
        if (!char.alive) return char;
        const beforeLevel = char.level;
        let newChar = checkLevelUp(char);
        while (newChar.level > char.level && newChar.xp >= getXpForLevel(newChar.level + 1)) {
          newChar = checkLevelUp(newChar);
        }
        if (newChar.level > beforeLevel) {
          leveledUp.push({ name: newChar.name, level: newChar.level });
          // Level up visual effect
          addParticles(ParticlePresets.levelUpBurst(window.innerWidth / 2, window.innerHeight / 2));
        }
        return newChar;
      });

      setParty(updatedParty);

      let victoryMsg = `Victory! Gained ${totalXp} XP and ${totalGold} gold!`;
      if (leveledUp.length > 0) {
        victoryMsg += '\n🎉 ' + leveledUp.map(c => `${c.name} reached level ${c.level}!`).join(' ');
      }
      setMessage(victoryMsg);

      const newDungeon = [...dungeon];
      newDungeon[position.y][position.x] = TILE_TYPES.FLOOR;
      setDungeon(newDungeon);

      setTimeout(() => {
        setCombat(null);
        setIsVictory(false);
        setGameState(GAME_STATES.EXPLORING);
      }, 3000);
    } else {
      setMessage('Your party has been defeated...');
      setGameState(GAME_STATES.GAME_OVER);
    }
  };

  const startGame = () => {
    if (party.length === 0) {
      setMessage('You need at least one party member!');
      return;
    }
    setDungeon(generateDungeon());
    setGameState(GAME_STATES.EXPLORING);
    setMessage('Your party enters the dungeon...');
  };

  const restartGame = () => {
    setGameState(GAME_STATES.PARTY_CREATION);
    setParty([]);
    setPosition({ x: 0, y: 0, facing: 'N' });
    setDungeonLevel(1);
    setMessage('Create a new party to try again...');
  };

  // Keyboard controls
  useKeyboardControls({
    gameState,
    combat,
    battleAnimation,
    party,
    selectedPartyMember,
    selectedAction,
    onMove: move,
    onRest: rest,
    onSelectPartyMember: setSelectedPartyMember,
    onSelectAction: setSelectedAction,
    onAttack: attack,
    onCastSpell: castSpell,
    onCancel: () => {
      setSelectedPartyMember(null);
      setSelectedAction(null);
    },
    setMessage
  });

  // Render appropriate screen
  if (gameState === GAME_STATES.PARTY_CREATION) {
    return (
      <PartyCreation
        party={party}
        setParty={setParty}
        onStartGame={startGame}
        message={message}
      />
    );
  }

  if (gameState === GAME_STATES.COMBAT && combat) {
    return (
      <Combat
        party={party}
        combat={combat}
        battleAnimation={battleAnimation}
        isVictory={isVictory}
        selectedPartyMember={selectedPartyMember}
        selectedAction={selectedAction}
        message={message}
        onAttack={attack}
        onCastSpell={castSpell}
        particles={particles}
        onParticleComplete={removeParticle}
        floatingTexts={texts}
        onTextComplete={removeText}
        screenEffects={effects}
      />
    );
  }

  if (gameState === GAME_STATES.GAME_OVER) {
    return (
      <GameOver
        message={message}
        onRestart={restartGame}
        party={party}
      />
    );
  }

  // Exploration
  return (
    <Exploration
      dungeon={dungeon}
      position={position}
      dungeonLevel={dungeonLevel}
      party={party}
      message={message}
      onMove={move}
      onRest={rest}
      particles={particles}
      onParticleComplete={removeParticle}
    />
  );
}
