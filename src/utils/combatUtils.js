import { MONSTERS } from '../data/monsters';
import { CRIT_BASE_CHANCE, CRIT_MULTIPLIER } from '../data/constants';

export function generateMonsters(dungeonLevel) {
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

  return monsters;
}

export function calculateDamage(attacker, isPhysical = true) {
  const stat = isPhysical ? attacker.str : attacker.int;
  const baseDamage = Math.floor(Math.random() * stat / 2) + Math.floor(stat / 2);
  return isPhysical ? baseDamage : baseDamage + 5;
}

export function checkCriticalHit(attacker) {
  const critChance = CRIT_BASE_CHANCE + (attacker.dex / 200);
  return Math.random() < critChance;
}

export function applyCriticalMultiplier(damage) {
  return Math.floor(damage * CRIT_MULTIPLIER);
}

export function calculateHealing() {
  return Math.floor(Math.random() * 10) + 10;
}
