import { CLASSES } from '../data/classes';

export function getXpForLevel(level) {
  return Math.floor(100 * Math.pow(1.5, level - 1));
}

export function checkLevelUp(character) {
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

export function createCharacter(name, classType) {
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
