import { useState } from 'react';
import { GAME_STATES } from '../data/constants';

export function useGameState() {
  const [gameState, setGameState] = useState(GAME_STATES.PARTY_CREATION);
  const [party, setParty] = useState([]);
  const [position, setPosition] = useState({ x: 0, y: 0, facing: 'N' });
  const [dungeon, setDungeon] = useState(null);
  const [combat, setCombat] = useState(null);
  const [battleAnimation, setBattleAnimation] = useState(null);
  const [isVictory, setIsVictory] = useState(false);
  const [selectedPartyMember, setSelectedPartyMember] = useState(null);
  const [selectedAction, setSelectedAction] = useState(null);
  const [message, setMessage] = useState('Welcome, adventurer! Create your party to begin.');
  const [dungeonLevel, setDungeonLevel] = useState(1);

  return {
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
  };
}
