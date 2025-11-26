import React, { useState, useEffect } from 'react';
import { Users, Map, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const CLASSES = {
  FIGHTER: { name: 'Fighter', hp: 12, mp: 0, str: 15, int: 8, dex: 12, icon: '⚔️' },
  MAGE: { name: 'Mage', hp: 6, mp: 10, str: 8, int: 16, dex: 10, icon: '🔮' },
  PRIEST: { name: 'Priest', hp: 10, mp: 8, str: 10, int: 14, dex: 10, icon: '✨' },
  THIEF: { name: 'Thief', hp: 8, mp: 0, str: 10, int: 10, dex: 16, icon: '🗝️' },
  RANGER: { name: 'Ranger', hp: 10, mp: 4, str: 12, int: 10, dex: 14, icon: '🏹' },
  PALADIN: { name: 'Paladin', hp: 11, mp: 6, str: 14, int: 11, dex: 10, icon: '🛡️' }
};

const SPELLS = {
  MAGE: ['Fireball', 'Ice Lance', 'Lightning'],
  PRIEST: ['Heal', 'Bless', 'Smite'],
  RANGER: ['Quick Shot'],
  PALADIN: ['Lay on Hands']
};

const MONSTERS = [
  { name: 'Goblin', hp: 8, damage: 3, xp: 10, icon: '👺' },
  { name: 'Skeleton', hp: 12, damage: 4, xp: 15, icon: '💀' },
  { name: 'Orc', hp: 18, damage: 6, xp: 25, icon: '👹' },
  { name: 'Dark Wizard', hp: 15, damage: 8, xp: 30, icon: '🧙' },
  { name: 'Dragon', hp: 50, damage: 15, xp: 100, icon: '🐉' }
];

export default function WizardryGame() {
  const [gameState, setGameState] = useState('partyCreation');
  const [party, setParty] = useState([]);
  const [position, setPosition] = useState({ x: 0, y: 0, facing: 'N' });
  const [dungeon, setDungeon] = useState(null);
  const [combat, setCombat] = useState(null);
  const [battleAnimation, setBattleAnimation] = useState(null); // { type: 'attack'|'spell', attackerId, targetId, damage }
  const [isVictory, setIsVictory] = useState(false);
  const [selectedPartyMember, setSelectedPartyMember] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null); // 'attack' or 'spell'

  // Load Google Font
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Fondamento:ital@0;1&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => document.head.removeChild(link);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyPress = (e) => {
      // Exploration controls
      if (gameState === 'exploring' && !combat) {
        switch(e.key.toLowerCase()) {
          case 'arrowup':
          case 'w':
            e.preventDefault();
            move('forward');
            break;
          case 'arrowdown':
          case 's':
            e.preventDefault();
            move('back');
            break;
          case 'arrowleft':
          case 'a':
            e.preventDefault();
            move('left');
            break;
          case 'arrowright':
          case 'd':
            e.preventDefault();
            move('right');
            break;
          case 'r':
            e.preventDefault();
            rest();
            break;
        }
      }
      
      // Combat controls
      if (gameState === 'combat' && combat && !battleAnimation) {
        const aliveParty = party.filter(p => p.alive);
        const aliveMonsters = combat.monsters.filter(m => m.currentHp > 0);
        
        // Select party member with number keys 1-6
        if (e.key >= '1' && e.key <= '6') {
          const index = parseInt(e.key) - 1;
          if (index < aliveParty.length) {
            setSelectedPartyMember(aliveParty[index].id);
            setSelectedAction(null);
            setMessage(`${aliveParty[index].name} selected. Press A to attack or S to cast spell.`);
          }
        }
        
        // If party member selected, choose action
        if (selectedPartyMember) {
          if (e.key.toLowerCase() === 'a') {
            setSelectedAction('attack');
            setMessage('Select target with 1-' + aliveMonsters.length);
          } else if (e.key.toLowerCase() === 's') {
            const char = party.find(p => p.id === selectedPartyMember);
            if (char && char.mp >= 3 && SPELLS[char.class]) {
              setSelectedAction('spell');
              setMessage('Select target with 1-' + (SPELLS[char.class][0] === 'Heal' ? aliveParty.length : aliveMonsters.length));
            }
          }
        }
        
        // If action selected, execute with target
        if (selectedAction && selectedPartyMember) {
          const targetIndex = parseInt(e.key) - 1;
          
          if (selectedAction === 'attack' && targetIndex >= 0 && targetIndex < aliveMonsters.length) {
            attack(selectedPartyMember, aliveMonsters[targetIndex].id);
            setSelectedPartyMember(null);
            setSelectedAction(null);
          } else if (selectedAction === 'spell' && targetIndex >= 0) {
            const char = party.find(p => p.id === selectedPartyMember);
            if (char && SPELLS[char.class]) {
              const spell = SPELLS[char.class][0];
              const targets = spell === 'Heal' ? aliveParty : aliveMonsters;
              if (targetIndex < targets.length) {
                castSpell(selectedPartyMember, spell, targets[targetIndex].id);
                setSelectedPartyMember(null);
                setSelectedAction(null);
              }
            }
          }
        }
        
        // ESC to cancel selection
        if (e.key === 'Escape') {
          setSelectedPartyMember(null);
          setSelectedAction(null);
          setMessage('Selection cancelled.');
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [gameState, combat, battleAnimation, selectedPartyMember, selectedAction, party, position, dungeon]);

  const [message, setMessage] = useState('Welcome, adventurer! Create your party to begin.');
  const [dungeonLevel, setDungeonLevel] = useState(1);
  const [charNameInput, setCharNameInput] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);

  function getXpForLevel(level) {
    return Math.floor(100 * Math.pow(1.5, level - 1));
  }

  function checkLevelUp(character) {
    const xpNeeded = getXpForLevel(character.level + 1);
    if (character.xp >= xpNeeded) {
      const classStats = CLASSES[character.class];
      return {
        ...character,
        level: character.level + 1,
        maxHp: character.maxHp + Math.floor(classStats.hp / 2) + 2,
        hp: character.maxHp + Math.floor(classStats.hp / 2) + 2,
        maxMp: character.maxMp + Math.floor(classStats.mp / 2) + 1,
        mp: character.maxMp + Math.floor(classStats.mp / 2) + 1,
        str: character.str + (classStats.str > 12 ? 2 : 1),
        int: character.int + (classStats.int > 12 ? 2 : 1),
        dex: character.dex + (classStats.dex > 12 ? 2 : 1)
      };
    }
    return character;
  }

  function generateDungeon() {
    const size = 10;
    const grid = Array(size).fill().map(() => Array(size).fill('floor'));
    
    for (let i = 0; i < 20; i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (!(x === 0 && y === 0)) grid[y][x] = 'wall';
    }
    
    for (let i = 0; i < 8; i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (!(x === 0 && y === 0) && grid[y][x] === 'floor') grid[y][x] = 'encounter';
    }
    
    for (let i = 0; i < 3; i++) {
      const x = Math.floor(Math.random() * size);
      const y = Math.floor(Math.random() * size);
      if (!(x === 0 && y === 0) && grid[y][x] === 'floor') grid[y][x] = 'treasure';
    }
    
    grid[size-1][size-1] = 'stairs';
    
    return grid;
  }

  function createCharacter(name, classType) {
    const baseStats = CLASSES[classType];
    return {
      id: Date.now() + Math.random(),
      name,
      class: classType,
      level: 1,
      xp: 0,
      hp: baseStats.hp,
      maxHp: baseStats.hp,
      mp: baseStats.mp,
      maxMp: baseStats.mp,
      str: baseStats.str,
      int: baseStats.int,
      dex: baseStats.dex,
      gold: 0,
      alive: true
    };
  }

  function addCharacter() {
    if (!selectedClass || !charNameInput.trim() || party.length >= 6) return;
    
    setParty([...party, createCharacter(charNameInput.trim(), selectedClass)]);
    setCharNameInput('');
    setSelectedClass(null);
    setMessage(`${charNameInput} the ${CLASSES[selectedClass].name} joins your party!`);
  }

  function startGame() {
    if (party.length === 0) {
      setMessage('You need at least one party member!');
      return;
    }
    setDungeon(generateDungeon());
    setGameState('exploring');
    setMessage('Your party enters the dungeon...');
  }

  function move(direction) {
    const directions = {
      N: { x: 0, y: -1 },
      S: { x: 0, y: 1 },
      E: { x: 1, y: 0 },
      W: { x: -1, y: 0 }
    };

    let newFacing = position.facing;
    let movement = { x: 0, y: 0 };

    if (direction === 'forward') {
      movement = directions[position.facing];
    } else if (direction === 'back') {
      const opposite = { N: 'S', S: 'N', E: 'W', W: 'E' };
      movement = directions[opposite[position.facing]];
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

    if (tile === 'wall') {
      setMessage('A wall blocks your path!');
      return;
    }

    setPosition({ x: newX, y: newY, facing: newFacing });

    if (tile === 'encounter') {
      startCombat();
    } else if (tile === 'treasure') {
      const gold = Math.floor(Math.random() * 50) + 20;
      const goldPerChar = Math.floor(gold / party.filter(p => p.alive).length);
      setParty(party.map(p => p.alive ? ({ ...p, gold: p.gold + goldPerChar }) : p));
      setMessage(`You found ${gold} gold!`);
      const newDungeon = [...dungeon];
      newDungeon[newY][newX] = 'floor';
      setDungeon(newDungeon);
    } else if (tile === 'stairs') {
      setMessage('You descend deeper into the dungeon...');
      setDungeonLevel(dungeonLevel + 1);
      setDungeon(generateDungeon());
      setPosition({ x: 0, y: 0, facing: 'N' });
    } else {
      setMessage('You move forward.');
    }
  }

  function startCombat() {
    const monsterCount = Math.floor(Math.random() * 3) + 1;
    const monsters = [];
    for (let i = 0; i < monsterCount; i++) {
      const maxIndex = Math.min(MONSTERS.length - 1, Math.floor(dungeonLevel / 2) + 1);
      const baseMonster = MONSTERS[Math.floor(Math.random() * (maxIndex + 1))];
      monsters.push({
        ...baseMonster,
        id: Date.now() + Math.random() + i,
        currentHp: baseMonster.hp
      });
    }
    
    setCombat({ monsters });
    setBattleAnimation(null);
    setIsVictory(false);
    setGameState('combat');
    setMessage('Monsters attack!');
  }

  function attack(attackerId, targetId) {
    const attacker = party.find(p => p.id === attackerId);
    const target = combat.monsters.find(m => m.id === targetId);
    
    if (!attacker || !target || !attacker.alive) return;

    // Critical hit calculation
    const critChance = 0.15 + (attacker.dex / 200); // Higher DEX = more crits
    const isCrit = Math.random() < critChance;
    const baseDamage = Math.floor(Math.random() * attacker.str / 2) + Math.floor(attacker.str / 2);
    const damage = isCrit ? Math.floor(baseDamage * 1.8) : baseDamage;
    
    // Show attack animation
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
    
    setTimeout(() => {
      const newMonsters = combat.monsters.map(m => 
        m.id === targetId ? { ...m, currentHp: Math.max(0, m.currentHp - damage) } : m
      );

      setMessage(`${attacker.name} attacks ${target.name} for ${damage} damage!${isCrit ? ' 💥 CRITICAL HIT!' : ''}`);
      
      const aliveMonsters = newMonsters.filter(m => m.currentHp > 0);
      
      if (aliveMonsters.length === 0) {
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

  function castSpell(casterId, spell, targetId) {
    const caster = party.find(p => p.id === casterId);
    if (!caster || !caster.alive || caster.mp < 3) return;

    const newParty = party.map(p => p.id === casterId ? { ...p, mp: p.mp - 3 } : p);

    if (spell === 'Heal') {
      const healing = Math.floor(Math.random() * 10) + 10;
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
      const damage = Math.floor(Math.random() * caster.int / 2) + Math.floor(caster.int / 2) + 5;
      
      setBattleAnimation({ 
        type: 'spell', 
        casterId, 
        targetId, 
        damage,
        casterName: caster.name,
        targetName: target.name,
        spell
      });
      
      setTimeout(() => {
        const newMonsters = combat.monsters.map(m => 
          m.id === targetId ? { ...m, currentHp: Math.max(0, m.currentHp - damage) } : m
        );
        
        setMessage(`${caster.name} casts ${spell} on ${target.name} for ${damage} damage!`);
        
        const aliveMonsters = newMonsters.filter(m => m.currentHp > 0);
        
        if (aliveMonsters.length === 0) {
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
  }

  function monsterTurn(aliveMonsters) {
    const aliveParty = party.filter(p => p.alive);
    if (aliveParty.length === 0) {
      endCombat(false);
      return;
    }

    aliveMonsters.forEach((monster, i) => {
      setTimeout(() => {
        const target = party.filter(p => p.alive)[Math.floor(Math.random() * party.filter(p => p.alive).length)];
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
  }

  function endCombat(victory, monsters = combat.monsters) {
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
        // Keep checking in case they level up multiple times
        while (newChar.level > char.level && newChar.xp >= getXpForLevel(newChar.level + 1)) {
          newChar = checkLevelUp(newChar);
        }
        if (newChar.level > beforeLevel) {
          leveledUp.push({ name: newChar.name, level: newChar.level });
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
      newDungeon[position.y][position.x] = 'floor';
      setDungeon(newDungeon);
      
      setTimeout(() => {
        setCombat(null);
        setIsVictory(false);
        setGameState('exploring');
      }, 3000);
    } else {
      setMessage('Your party has been defeated...');
      setGameState('gameOver');
    }
  }

  function rest() {
    setParty(party.map(p => ({
      ...p,
      hp: p.alive ? p.maxHp : p.hp,
      mp: p.alive ? p.maxMp : p.mp
    })));
    setMessage('Your party rests and recovers...');
  }

  // Party Creation Screen
  if (gameState === 'partyCreation') {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-center mb-2 text-amber-400" style={{ fontFamily: "'Fondamento', serif" }}>⚔️ WIZARDRY ⚔️</h1>
          <h2 className="text-xl text-center mb-8 text-gray-400" style={{ fontFamily: "'Fondamento', serif" }}>Proving Grounds of the Mad Overlord</h2>
          
          {/* Alert at Top */}
          {message && (
            <Alert className="mb-6 bg-gray-800 border-2 border-amber-600 text-gray-100">
              <AlertDescription className="text-center whitespace-pre-line">
                {message}
              </AlertDescription>
            </Alert>
          )}
          
          <div className="bg-gray-800 border-2 border-amber-600 rounded-lg p-6 mb-6">
            <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Fondamento', serif" }}>
              <Users /> Create Your Party ({party.length}/6)
            </h3>
            
            <div className="mb-6">
              <label className="block mb-2 font-bold">Select a Class:</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
                {Object.entries(CLASSES).map(([key, cls]) => (
                  <button
                    key={key}
                    onClick={() => setSelectedClass(key)}
                    className={`p-4 rounded border-2 transition-all ${
                      selectedClass === key
                        ? 'bg-amber-600 border-amber-400'
                        : 'bg-gray-700 border-gray-600 hover:border-amber-500'
                    }`}
                  >
                    <div className="text-3xl mb-2">{cls.icon}</div>
                    <div className="font-bold">{cls.name}</div>
                    <div className="text-xs text-gray-400">
                      HP:{cls.hp} MP:{cls.mp} STR:{cls.str}
                    </div>
                  </button>
                ))}
              </div>

              {selectedClass && (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={charNameInput}
                    onChange={(e) => setCharNameInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addCharacter()}
                    placeholder="Enter character name..."
                    className="flex-1 px-4 py-2 bg-gray-700 border-2 border-gray-600 rounded text-white"
                    maxLength={20}
                  />
                  <button
                    onClick={addCharacter}
                    disabled={!charNameInput.trim() || party.length >= 6}
                    className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded font-bold"
                  >
                    Add
                  </button>
                </div>
              )}
            </div>

            {party.length > 0 && (
              <div className="mb-6">
                <h4 className="font-bold mb-3">Your Party:</h4>
                <div className="space-y-2">
                  {party.map((char) => (
                    <div key={char.id} className="bg-gray-700 p-3 rounded flex justify-between items-center">
                      <div>
                        <span className="font-bold">{char.name}</span>
                        <span className="text-gray-400 ml-2">({CLASSES[char.class].name})</span>
                      </div>
                      <button
                        onClick={() => {
                          setParty(party.filter(p => p.id !== char.id));
                          setMessage('Character removed from party.');
                        }}
                        className="text-red-400 hover:text-red-300 px-3 py-1 rounded hover:bg-gray-600"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <button
              onClick={startGame}
              disabled={party.length === 0}
              className="w-full bg-amber-600 hover:bg-amber-500 disabled:bg-gray-600 disabled:cursor-not-allowed p-4 rounded font-bold text-lg"
            >
              Enter the Dungeon
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Combat Screen
  if (gameState === 'combat' && combat) {
    return (
      <div className={`w-full min-h-screen bg-gradient-to-b from-red-950 to-gray-900 text-gray-100 p-4 ${
        battleAnimation?.isCrit ? 'animate-screenShake' : ''
      }`}>
        <div className="max-w-6xl mx-auto">
          {/* Alert at Top */}
          {message && (
            <Alert className="mb-4 bg-gray-800 border-2 border-red-600 text-gray-100">
              <AlertDescription className="text-center text-lg whitespace-pre-line">
                {message}
              </AlertDescription>
            </Alert>
          )}
          
          <h2 className="text-3xl font-bold text-center mb-6 text-red-400" style={{ fontFamily: "'Fondamento', serif" }}>⚔️ COMBAT ⚔️</h2>
          
          {/* Battlefield Stage */}
          <div className="bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 border-4 border-red-800 rounded-lg p-8 mb-4 min-h-96 relative overflow-hidden">
            {/* Background texture */}
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: 'repeating-linear-gradient(90deg, #444 0px, #444 1px, transparent 1px, transparent 40px)',
            }}></div>
            
            {/* Party Members (Left Side) */}
            <div className="absolute left-8 top-1/2 transform -translate-y-1/2 space-y-6">
              {party.filter(p => p.alive).map((char, index) => (
                <div 
                  key={char.id}
                  className={`relative transition-all duration-300 ${
                    battleAnimation?.attackerId === char.id || battleAnimation?.casterId === char.id
                      ? 'transform translate-x-16 scale-110'
                      : isVictory
                      ? 'animate-victory'
                      : ''
                  } ${
                    battleAnimation?.targetId === char.id
                      ? 'animate-shake'
                      : ''
                  }`}
                >
                  {/* Character Sprite */}
                  <div className={`relative ${
                    battleAnimation?.targetId === char.id 
                      ? 'animate-pulse' 
                      : ''
                  }`}>
                    {/* Class Aura */}
                    <div className={`absolute inset-0 rounded-full blur-lg opacity-40 ${
                      char.class === 'FIGHTER' || char.class === 'PALADIN' ? 'bg-red-500' :
                      char.class === 'MAGE' ? 'bg-purple-500' :
                      char.class === 'PRIEST' ? 'bg-yellow-500' :
                      char.class === 'THIEF' ? 'bg-gray-500' :
                      char.class === 'RANGER' ? 'bg-green-500' : ''
                    } animate-pulse`} style={{ animationDuration: '2s' }}></div>
                    
                    <div className="text-6xl filter drop-shadow-lg relative z-10">
                      {CLASSES[char.class].icon}
                    </div>
                    {battleAnimation?.targetId === char.id && (
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
                      {char.name}
                    </div>
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-green-500 transition-all duration-500"
                        style={{ width: `${(char.hp / char.maxHp) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                  
                  {/* Casting Effect */}
                  {battleAnimation?.casterId === char.id && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 animate-bounce">
                      <div className="text-3xl">✨</div>
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {/* Enemies (Right Side) */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2 space-y-6">
              {combat.monsters.filter(m => m.currentHp > 0).map((monster) => (
                <div 
                  key={monster.id}
                  className={`relative transition-all duration-300 ${
                    battleAnimation?.attackerId === monster.id
                      ? 'transform -translate-x-16 scale-110'
                      : ''
                  } ${
                    battleAnimation?.targetId === monster.id
                      ? 'animate-shake'
                      : ''
                  }`}
                >
                  {/* Monster Sprite */}
                  <div className={`relative ${
                    battleAnimation?.targetId === monster.id 
                      ? 'animate-pulse' 
                      : ''
                  }`}>
                    {/* Monster Aura - Menacing Red */}
                    <div className="absolute inset-0 rounded-full blur-lg bg-red-900 opacity-30 animate-pulse" 
                         style={{ animationDuration: '1.5s' }}></div>
                    
                    <div className="text-6xl filter drop-shadow-lg relative z-10">
                      {monster.icon}
                    </div>
                    {battleAnimation?.targetId === monster.id && (
                      <>
                        <div className="absolute inset-0 bg-red-500 opacity-50 rounded-full animate-ping"></div>
                        <div className="absolute inset-0 text-6xl animate-spin" style={{ animationDuration: '0.5s' }}>
                          💥
                        </div>
                      </>
                    )}
                  </div>
                  
                  {/* Monster Name & HP Bar */}
                  <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                    <div className="text-xs font-bold text-red-300 bg-gray-900 px-2 py-1 rounded mb-1">
                      {monster.name}
                    </div>
                    <div className="w-20 h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-red-500 transition-all duration-500"
                        style={{ width: `${(monster.currentHp / monster.hp) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Projectile/Effect Animations */}
            {battleAnimation && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                {/* Physical Attack - Class Specific */}
                {battleAnimation.type === 'attack' && (
                  <>
                    {/* Fighter/Paladin - Sword Slash */}
                    {(battleAnimation.attackerClass === 'FIGHTER' || battleAnimation.attackerClass === 'PALADIN') && (
                      <div className="absolute" style={{
                        left: '30%',
                        animation: 'projectile 0.6s ease-out'
                      }}>
                        <div className={`text-8xl ${battleAnimation.isCrit ? 'animate-spin text-red-500' : ''}`} 
                             style={{ animationDuration: battleAnimation.isCrit ? '0.15s' : '0.2s' }}>
                          ⚔️
                        </div>
                      </div>
                    )}
                    
                    {/* Thief - Dagger Stab */}
                    {battleAnimation.attackerClass === 'THIEF' && (
                      <div className="absolute" style={{
                        left: '30%',
                        animation: 'quickStrike 0.4s ease-out'
                      }}>
                        <div className={`text-6xl ${battleAnimation.isCrit ? 'text-yellow-500' : ''}`}>
                          🗡️💨
                        </div>
                      </div>
                    )}
                    
                    {/* Ranger - Arrow Shot */}
                    {battleAnimation.attackerClass === 'RANGER' && (
                      <div className="absolute" style={{
                        left: '30%',
                        animation: 'arrow 0.5s linear'
                      }}>
                        <div className={`text-6xl ${battleAnimation.isCrit ? 'text-amber-500' : ''}`}>
                          🏹➤
                        </div>
                      </div>
                    )}
                    
                    {/* Mage/Priest Physical (rare) */}
                    {(battleAnimation.attackerClass === 'MAGE' || battleAnimation.attackerClass === 'PRIEST') && (
                      <div className="absolute" style={{
                        left: '30%',
                        animation: 'projectile 0.6s ease-out'
                      }}>
                        <div className="text-6xl">✨💫</div>
                      </div>
                    )}
                    
                    {/* Critical Hit Screen Shake & Flash */}
                    {battleAnimation.isCrit && (
                      <>
                        <div className="absolute inset-0 bg-red-500 opacity-30 animate-ping"></div>
                        <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-6xl font-bold text-yellow-400 animate-bounce" style={{ fontFamily: "'Fondamento', serif" }}>
                          💥 CRITICAL! 💥
                        </div>
                      </>
                    )}
                  </>
                )}
                
                {/* Spell - Enhanced Effects by Type */}
                {battleAnimation.type === 'spell' && (
                  <>
                    {/* Fireball */}
                    {battleAnimation.spell === 'Fireball' && (
                      <div className="absolute" style={{
                        left: '30%',
                        animation: 'projectile 0.6s ease-out'
                      }}>
                        <div className="relative">
                          <div className="text-8xl animate-pulse">🔥</div>
                          <div className="absolute inset-0 text-6xl animate-spin" style={{ animationDuration: '0.3s' }}>💥</div>
                        </div>
                      </div>
                    )}
                    
                    {/* Ice Lance */}
                    {battleAnimation.spell === 'Ice Lance' && (
                      <div className="absolute" style={{
                        left: '30%',
                        animation: 'projectile 0.5s linear'
                      }}>
                        <div className="text-8xl">❄️💎</div>
                      </div>
                    )}
                    
                    {/* Lightning */}
                    {battleAnimation.spell === 'Lightning' && (
                      <div className="absolute inset-0">
                        <div className="absolute left-1/4 top-0 bottom-0 w-1 bg-yellow-400 animate-pulse"></div>
                        <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-blue-300 animate-ping"></div>
                        <div className="text-8xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">⚡</div>
                      </div>
                    )}
                    
                    {/* Smite - Holy Power */}
                    {battleAnimation.spell?.includes('Smite') && (
                      <div className="absolute inset-0">
                        <div className="absolute inset-0 bg-yellow-200 opacity-40 animate-ping"></div>
                        <div className="text-9xl absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 animate-pulse">
                          ⚡✨
                        </div>
                      </div>
                    )}
                    
                    {/* Bless - Buff Spell */}
                    {battleAnimation.spell === 'Bless' && (
                      <div className="absolute" style={{
                        left: '30%',
                        animation: 'healing 0.6s ease-out'
                      }}>
                        <div className="text-8xl animate-pulse">🌟✨🌟</div>
                      </div>
                    )}
                    
                    {/* Quick Shot - Ranger Ability */}
                    {battleAnimation.spell === 'Quick Shot' && (
                      <div className="absolute" style={{
                        left: '30%',
                        animation: 'arrow 0.3s linear'
                      }}>
                        <div className="text-7xl">🏹💨➤➤</div>
                      </div>
                    )}
                    
                    {/* Lay on Hands - Paladin Heal */}
                    {battleAnimation.spell === 'Lay on Hands' && (
                      <div className="absolute" style={{
                        left: '30%',
                        animation: 'healing 0.6s ease-out'
                      }}>
                        <div className="text-8xl animate-pulse">🙏✨💚</div>
                      </div>
                    )}
                  </>
                )}
                
                {/* Heal Effect - Enhanced */}
                {battleAnimation.type === 'heal' && (
                  <div className="absolute" style={{
                    left: '30%',
                    animation: 'healing 0.6s ease-out'
                  }}>
                    <div className="relative">
                      <div className="text-8xl animate-pulse">💚</div>
                      <div className="absolute inset-0 text-6xl animate-spin" style={{ animationDuration: '1s' }}>
                        ✨✨✨
                      </div>
                    </div>
                  </div>
                )}
                
                {/* Monster Attack - Enhanced */}
                {battleAnimation.type === 'monsterAttack' && (
                  <div className="absolute" style={{
                    left: '70%',
                    animation: 'projectileReverse 0.6s ease-out'
                  }}>
                    <div className="text-8xl animate-spin" style={{ animationDuration: '0.2s' }}>
                      💥🔥
                    </div>
                  </div>
                )}
                
                {/* Damage Number - Enhanced with Critical */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                  <div className={`font-bold animate-damage ${
                    battleAnimation.type === 'heal' ? 'text-green-400 text-7xl' : 
                    battleAnimation.isCrit ? 'text-yellow-400 text-9xl' : 
                    'text-red-500 text-7xl'
                  }`}>
                    {battleAnimation.type === 'heal' ? '+' : '-'}{battleAnimation.damage}
                    {battleAnimation.isCrit && <span className="text-5xl">!!!</span>}
                  </div>
                </div>
              </div>
            )}
            
            {/* Victory Celebration Overlay */}
            {isVictory && (
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute inset-0 bg-yellow-400 opacity-20 animate-pulse"></div>
                <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-center">
                  <div className="text-9xl font-bold text-yellow-400 animate-bounce drop-shadow-2xl" style={{ fontFamily: "'Fondamento', serif" }}>
                    VICTORY!
                  </div>
                  <div className="text-5xl mt-4 animate-pulse">
                    ⭐✨🎉✨⭐
                  </div>
                </div>
                {/* Confetti */}
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute text-3xl animate-ping"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 0.5}s`,
                      animationDuration: `${1 + Math.random()}s`
                    }}
                  >
                    {['🎊', '🎉', '⭐', '✨', '💫'][Math.floor(Math.random() * 5)]}
                  </div>
                ))}
              </div>
            )}
            
            {/* Action Text */}
            {battleAnimation && (
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className="text-xl font-bold text-amber-300 bg-gray-900 bg-opacity-90 inline-block px-6 py-3 rounded-lg border-2 border-amber-600">
                  {battleAnimation.attackerName || battleAnimation.casterName} → {battleAnimation.targetName}
                </div>
              </div>
            )}
            
            {/* Battle Ready Text */}
            {!battleAnimation && (
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <div className="text-2xl font-bold text-gray-500 animate-pulse">
                  Choose your action...
                </div>
              </div>
            )}
          </div>
          
          {/* Action Panels */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Party Actions */}
            <div className="bg-gray-800 border-2 border-amber-600 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                👥 Your Party
              </h3>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {party.filter(p => p.alive).map((char, index) => (
                  <div
                    key={char.id}
                    className={`p-3 rounded border-2 transition-all relative ${
                      char.alive ? 'bg-gray-700 border-gray-600' : 'bg-gray-900 border-gray-800 opacity-40'
                    } ${(battleAnimation?.attackerId === char.id || battleAnimation?.casterId === char.id) ? 'ring-2 ring-blue-500' : ''}
                       ${selectedPartyMember === char.id ? 'ring-4 ring-yellow-400 bg-gray-600' : ''}`}
                  >
                    {/* Keyboard Number Badge */}
                    <div className="absolute -top-2 -left-2 bg-amber-500 text-black rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-gray-900">
                      {index + 1}
                    </div>
                    
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-2xl">{CLASSES[char.class].icon}</span>
                      <div className="flex-1">
                        <div className="font-bold text-sm">{char.name}</div>
                        <div className="text-xs text-gray-400">{CLASSES[char.class].name} Lv.{char.level}</div>
                      </div>
                      <div className="text-right text-xs">
                        <div className="text-green-400">HP: {char.hp}/{char.maxHp}</div>
                        <div className="text-blue-400">MP: {char.mp}/{char.maxMp}</div>
                      </div>
                    </div>
                    
                    {char.alive && !battleAnimation && (
                      <div className="flex flex-wrap gap-1">
                        {combat.monsters.filter(m => m.currentHp > 0).map(monster => (
                          <button
                            key={monster.id}
                            onClick={() => attack(char.id, monster.id)}
                            className="flex-1 min-w-fit bg-red-600 hover:bg-red-500 px-2 py-1 rounded text-xs font-bold"
                          >
                            ⚔️ {monster.name}
                          </button>
                        ))}
                        {char.mp >= 3 && SPELLS[char.class] && SPELLS[char.class].map(spell => (
                          <button
                            key={spell}
                            onClick={() => {
                              const target = spell === 'Heal' 
                                ? party.find(p => p.alive && p.hp < p.maxHp)?.id
                                : combat.monsters.find(m => m.currentHp > 0)?.id;
                              if (target) castSpell(char.id, spell, target);
                            }}
                            className="flex-1 min-w-fit bg-blue-600 hover:bg-blue-500 px-2 py-1 rounded text-xs font-bold"
                          >
                            ✨ {spell}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            
            {/* Enemy Info */}
            <div className="bg-gray-800 border-2 border-red-600 rounded-lg p-4">
              <h3 className="text-lg font-bold mb-3 flex items-center gap-2">
                👹 Enemies
              </h3>
              <div className="space-y-3">
                {combat.monsters.filter(m => m.currentHp > 0).map((monster, index) => (
                  <div
                    key={monster.id}
                    className={`p-3 rounded border-2 transition-all relative ${
                      monster.currentHp > 0 
                        ? 'bg-gray-700 border-red-900' 
                        : 'bg-gray-900 border-gray-800 opacity-40'
                    } ${battleAnimation?.attackerId === monster.id ? 'ring-2 ring-orange-500' : ''}`}
                  >
                    {/* Keyboard Number Badge */}
                    {monster.currentHp > 0 && (
                      <div className="absolute -top-2 -left-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-gray-900">
                        {index + 1}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-3">
                      <span className="text-4xl">{monster.icon}</span>
                      <div className="flex-1">
                        <div className="font-bold">{monster.name}</div>
                        <div className="text-sm text-gray-400">DMG: {monster.damage} | XP: {monster.xp}</div>
                        <div className="mt-2 w-full h-3 bg-gray-900 rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-500"
                            style={{ width: `${(monster.currentHp / monster.hp) * 100}%` }}
                          ></div>
                        </div>
                        <div className="text-xs text-red-300 mt-1">
                          {monster.currentHp} / {monster.hp} HP
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Keyboard Controls Hint */}
          <div className="mt-4 bg-gray-900 border-2 border-gray-700 rounded p-3">
            <div className="text-xs text-gray-400 text-center">
              <span className="font-bold text-amber-400">⌨️ Keys:</span>
              {!selectedPartyMember && !battleAnimation && (
                <>
                  <span className="ml-2">1-6 = Select Party Member</span>
                </>
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
                  <span className="ml-2 text-green-300">1-{selectedAction === 'attack' ? combat.monsters.filter(m => m.currentHp > 0).length : party.filter(p => p.alive).length} = Select Target</span>
                  <span className="mx-1">|</span>
                  <span className="text-gray-300">ESC = Cancel</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        {/* Animation Keyframes */}
        <style>{`
          @keyframes projectile {
            0% { transform: translateX(0) scale(0.5); opacity: 0; }
            50% { transform: translateX(200px) scale(1.2) rotate(360deg); opacity: 1; }
            100% { transform: translateX(400px) scale(0.5) rotate(720deg); opacity: 0; }
          }
          
          @keyframes projectileReverse {
            0% { transform: translateX(0) scale(0.5); opacity: 0; }
            50% { transform: translateX(-200px) scale(1.2) rotate(-360deg); opacity: 1; }
            100% { transform: translateX(-400px) scale(0.5) rotate(-720deg); opacity: 0; }
          }
          
          @keyframes arrow {
            0% { transform: translateX(0) scale(0.8) rotate(0deg); opacity: 0; }
            20% { opacity: 1; }
            100% { transform: translateX(450px) scale(1) rotate(5deg); opacity: 0; }
          }
          
          @keyframes quickStrike {
            0% { transform: translateX(0) translateY(0) scale(0.5); opacity: 0; }
            30% { transform: translateX(150px) translateY(-20px) scale(1.3); opacity: 1; }
            60% { transform: translateX(300px) translateY(20px) scale(1.3); opacity: 1; }
            100% { transform: translateX(450px) translateY(0) scale(0.5); opacity: 0; }
          }
          
          @keyframes healing {
            0% { transform: translateY(50px) scale(0.5); opacity: 0; }
            50% { transform: translateY(-20px) scale(1.2); opacity: 1; }
            100% { transform: translateY(-100px) scale(0.5); opacity: 0; }
          }
          
          @keyframes damage {
            0% { transform: translateY(0) scale(0.5); opacity: 0; }
            50% { transform: translateY(-30px) scale(1.2); opacity: 1; }
            100% { transform: translateY(-80px) scale(0.8); opacity: 0; }
          }
          
          @keyframes shake {
            0%, 100% { transform: translateX(0); }
            10%, 30%, 50%, 70%, 90% { transform: translateX(-10px); }
            20%, 40%, 60%, 80% { transform: translateX(10px); }
          }
          
          .animate-shake {
            animation: shake 0.4s ease-in-out;
          }
          
          .animate-damage {
            animation: damage 1.2s ease-out;
          }
          
          @keyframes victoryBounce {
            0%, 100% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-30px) rotate(10deg); }
          }
          
          .animate-victory {
            animation: victoryBounce 0.6s ease-in-out infinite;
          }
          
          @keyframes screenShake {
            0%, 100% { transform: translate(0, 0); }
            10%, 30%, 50%, 70%, 90% { transform: translate(-5px, 5px); }
            20%, 40%, 60%, 80% { transform: translate(5px, -5px); }
          }
          
          .animate-screenShake {
            animation: screenShake 0.5s ease-in-out;
          }
        `}</style>
      </div>
    );
  }

  // Game Over Screen
  if (gameState === 'gameOver') {
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-8 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4 text-red-500" style={{ fontFamily: "'Fondamento', serif" }}>💀 GAME OVER 💀</h1>
          <p className="text-xl mb-8">{message}</p>
          <button
            onClick={() => {
              setGameState('partyCreation');
              setParty([]);
              setPosition({ x: 0, y: 0, facing: 'N' });
              setDungeonLevel(1);
              setMessage('Create a new party to try again...');
            }}
            className="bg-amber-600 hover:bg-amber-500 px-8 py-4 rounded font-bold text-lg"
          >
            Create New Party
          </button>
        </div>
      </div>
    );
  }

  // Exploration Screen
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Alert at Top */}
        {message && (
          <Alert className="mb-4 bg-gray-800 border-2 border-amber-600 text-gray-100">
            <AlertDescription className="text-center text-lg whitespace-pre-line">
              {message}
            </AlertDescription>
          </Alert>
        )}
        
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'Fondamento', serif" }}>Dungeon Level {dungeonLevel}</h2>
          <div className="text-sm text-gray-400">
            Pos: ({position.x}, {position.y}) | Facing: {position.facing}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            {/* Dungeon Map - Now Primary */}
            <div className="bg-gray-800 border-2 border-amber-600 rounded-lg p-6">
              <h3 className="font-bold mb-4 flex items-center gap-2 text-xl" style={{ fontFamily: "'Fondamento', serif" }}>
                <Map size={24} /> Dungeon Map
              </h3>
              <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${dungeon[0].length}, minmax(0, 1fr))` }}>
                {dungeon.map((row, y) =>
                  row.map((cell, x) => (
                    <div
                      key={`${x}-${y}`}
                      className={`aspect-square flex items-center justify-center text-xs font-bold ${
                        x === position.x && y === position.y
                          ? 'bg-amber-500 text-black'
                          : cell === 'wall'
                          ? 'bg-gray-600'
                          : cell === 'encounter'
                          ? 'bg-red-900'
                          : cell === 'treasure'
                          ? 'bg-yellow-700'
                          : cell === 'stairs'
                          ? 'bg-blue-700'
                          : 'bg-gray-700'
                      }`}
                    >
                      {x === position.x && y === position.y ? position.facing : ''}
                    </div>
                  ))
                )}
              </div>
              
              {/* Map Legend */}
              <div className="mt-4 grid grid-cols-5 gap-2 text-xs">
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-amber-500 rounded"></div>
                  <span>You</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-700 rounded"></div>
                  <span>Floor</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-gray-600 rounded"></div>
                  <span>Wall</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-red-900 rounded"></div>
                  <span>Enemy</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-4 h-4 bg-yellow-700 rounded"></div>
                  <span>Treasure</span>
                </div>
              </div>
            </div>

            {/* Movement Controls */}
            <div className="bg-gray-800 border-2 border-amber-600 rounded-lg p-6">
              <h3 className="font-bold mb-4 text-lg" style={{ fontFamily: "'Fondamento', serif" }}>Navigation</h3>
              <div className="flex justify-center gap-8">
                <div className="grid grid-cols-3 gap-2">
                  <div></div>
                  <button
                    onClick={() => move('forward')}
                    className="bg-amber-600 hover:bg-amber-500 p-4 rounded transition-colors"
                  >
                    <ArrowUp size={24} />
                  </button>
                  <div></div>
                  
                  <button
                    onClick={() => move('left')}
                    className="bg-amber-600 hover:bg-amber-500 p-4 rounded transition-colors"
                  >
                    <ArrowLeft size={24} />
                  </button>
                  <button
                    onClick={() => move('back')}
                    className="bg-amber-600 hover:bg-amber-500 p-4 rounded transition-colors"
                  >
                    <ArrowDown size={24} />
                  </button>
                  <button
                    onClick={() => move('right')}
                    className="bg-amber-600 hover:bg-amber-500 p-4 rounded transition-colors"
                  >
                    <ArrowRight size={24} />
                  </button>
                </div>
                
                <div className="flex items-center">
                  <button
                    onClick={rest}
                    className="bg-green-600 hover:bg-green-500 px-8 py-4 rounded font-bold text-lg"
                  >
                    💚 Rest & Recover
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-gray-800 border-2 border-amber-600 rounded-lg p-4">
              <h3 className="font-bold mb-4 flex items-center gap-2"><Users size={20} /> Party Status</h3>
              <div className="space-y-3">
                {party.map((char) => (
                  <div
                    key={char.id}
                    className={`p-3 rounded ${
                      char.alive ? 'bg-gray-700' : 'bg-gray-900 opacity-50'
                    }`}
                  >
                    <div className="font-bold text-lg">{char.name}</div>
                    <div className="text-xs text-gray-400 mb-2">
                      {CLASSES[char.class].name} Lv.{char.level}
                    </div>
                    <div className="text-sm space-y-1">
                      <div className="flex justify-between">
                        <span className="text-green-400">HP:</span>
                        <span>{char.hp}/{char.maxHp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-blue-400">MP:</span>
                        <span>{char.mp}/{char.maxMp}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-purple-400">XP:</span>
                        <span>{char.xp}/{getXpForLevel(char.level + 1)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-amber-400">Gold:</span>
                        <span>{char.gold}g</span>
                      </div>
                      <div className="text-xs text-gray-500 mt-2 pt-2 border-t border-gray-600">
                        STR:{char.str} INT:{char.int} DEX:{char.dex}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="bg-gray-900 border-2 border-gray-700 rounded-lg p-3">
              <div className="text-xs text-gray-400 text-center">
                <span className="font-bold text-amber-400">⌨️ Keys:</span> 
                <span className="ml-2">↑/W=Forward</span>
                <span className="mx-1">|</span>
                <span>↓/S=Back</span>
                <span className="mx-1">|</span>
                <span>←/A ➜/D=Turn</span>
                <span className="mx-1">|</span>
                <span>R=Rest</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}