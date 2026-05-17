import { useEffect, useState, useSyncExternalStore } from 'react';
import { PartyCreation } from './components/party/PartyCreation';
import { GameOver } from './components/GameOver';
import { PhaserGame } from './game/PhaserGame';
import { GameHUD } from './game/GameHUD';
import { gameStore } from './game/store';
import { audio } from './game/audio';
import './styles/animations.css';

export default function App() {
  const state = useSyncExternalStore(gameStore.subscribe, gameStore.getState);
  const [draftParty, setDraftParty] = useState([]);

  // Browsers block audio until a user gesture — unlock on the first one.
  useEffect(() => {
    const unlock = () => audio.unlock();
    window.addEventListener('pointerdown', unlock);
    window.addEventListener('keydown', unlock);
    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
    };
  }, []);

  // Music only plays in the dungeon — silence it on the menu screens.
  useEffect(() => {
    if (state.screen !== 'playing') audio.stopMusic();
  }, [state.screen]);

  if (state.screen === 'creation') {
    return (
      <PartyCreation
        party={draftParty}
        setParty={setDraftParty}
        message={state.message}
        hasSave={gameStore.hasSave()}
        onContinue={() => gameStore.loadSave()}
        onStartGame={() => {
          if (draftParty.length === 0) {
            gameStore.setState({
              message: 'You need at least one party member!',
            });
            return;
          }
          gameStore.startGame(draftParty);
        }}
      />
    );
  }

  if (state.screen === 'gameover') {
    return (
      <GameOver
        message={state.message}
        party={state.party}
        onRestart={() => {
          setDraftParty([]);
          gameStore.reset();
        }}
      />
    );
  }

  // Playing: Phaser canvas with the React HUD overlaid on top.
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <PhaserGame />
      <GameHUD />
    </div>
  );
}
