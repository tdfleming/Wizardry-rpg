import React, { useState } from 'react';
import { Users, Sword } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/Alert';
import { ClassSelector } from './ClassSelector';
import { PartyList } from './PartyList';
import { Button } from '../ui/Button';
import { AtmosphereEffects } from '../effects/AtmosphereEffects';
import { createCharacter } from '../../utils/characterUtils';
import { CLASSES } from '../../data/classes';
import { MAX_PARTY_SIZE } from '../../data/constants';

export function PartyCreation({ party, setParty, onStartGame, message }) {
  const [charNameInput, setCharNameInput] = useState('');
  const [selectedClass, setSelectedClass] = useState(null);

  const addCharacter = () => {
    if (!selectedClass || !charNameInput.trim() || party.length >= MAX_PARTY_SIZE) return;

    setParty([...party, createCharacter(charNameInput.trim(), selectedClass)]);
    setCharNameInput('');
    setSelectedClass(null);
  };

  const removeCharacter = (id) => {
    setParty(party.filter(p => p.id !== id));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && charNameInput.trim()) {
      addCharacter();
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-black text-gray-100 p-4 relative overflow-hidden">
      {/* Atmospheric Background */}
      <AtmosphereEffects intensity="low" theme="dungeon" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title */}
        <div className="text-center mb-8 animate-fadeIn">
          <h1
            className="text-5xl md:text-6xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-yellow-500 to-amber-400 drop-shadow-lg"
            style={{ fontFamily: "'Fondamento', serif" }}
          >
            ⚔️ WIZARDRY ⚔️
          </h1>
          <h2
            className="text-xl md:text-2xl text-gray-300 mb-2"
            style={{ fontFamily: "'Fondamento', serif" }}
          >
            Proving Grounds of the Mad Overlord
          </h2>
          <div className="h-1 w-32 mx-auto bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded-full"></div>
        </div>

        {message && (
          <Alert className="mb-6 bg-gray-800/90 border-2 border-amber-600 text-gray-100 backdrop-blur-sm animate-slideInFromTop">
            <AlertDescription className="text-center whitespace-pre-line">
              {message}
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-gradient-to-br from-gray-800/95 to-gray-900/95 border-2 border-amber-600 rounded-lg p-6 md:p-8 mb-6 shadow-2xl backdrop-blur-sm animate-fadeIn">
          <h3
            className="text-2xl md:text-3xl font-bold mb-6 flex items-center justify-center gap-3 text-amber-400"
            style={{ fontFamily: "'Fondamento', serif" }}
          >
            <Users className="animate-pulse" />
            Create Your Party
            <span className="text-base text-gray-400">({party.length}/{MAX_PARTY_SIZE})</span>
          </h3>

          {/* Class Selection */}
          <div className="mb-8">
            <label className="block mb-4 font-bold text-lg text-gray-200">
              Select a Class:
            </label>
            <ClassSelector selectedClass={selectedClass} onSelectClass={setSelectedClass} />

            {/* Name Input - Shows when class selected */}
            {selectedClass && (
              <div
                className="mt-6 p-4 bg-gray-700/50 border-2 border-amber-500/50 rounded-lg animate-slideInFromBottom"
              >
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-3xl">{CLASSES[selectedClass].icon}</span>
                  <div>
                    <div className="font-bold text-lg">{CLASSES[selectedClass].name} Selected</div>
                    <div className="text-sm text-gray-400">Enter a name for your hero</div>
                  </div>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={charNameInput}
                    onChange={(e) => setCharNameInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter character name..."
                    className="
                      flex-1 px-4 py-3
                      bg-gray-800 border-2 border-gray-600
                      rounded-lg text-white text-lg
                      focus:border-amber-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50
                      transition-all duration-200
                    "
                    maxLength={20}
                    autoFocus
                  />
                  <Button
                    onClick={addCharacter}
                    disabled={!charNameInput.trim() || party.length >= MAX_PARTY_SIZE}
                    variant="success"
                    size="lg"
                    icon="✓"
                  >
                    Add Hero
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Party List */}
          <PartyList party={party} onRemoveCharacter={removeCharacter} />

          {/* Start Game Button */}
          <div className="relative">
            {party.length === 0 ? (
              <div className="text-center p-8 border-2 border-dashed border-gray-600 rounded-lg">
                <div className="text-4xl mb-2 opacity-50">⚔️</div>
                <p className="text-gray-400">
                  Create at least one hero to begin your adventure
                </p>
              </div>
            ) : (
              <Button
                onClick={onStartGame}
                variant="primary"
                size="xl"
                icon={<Sword size={24} />}
                className="w-full text-xl font-bold shadow-xl hover:shadow-2xl"
              >
                Enter the Dungeon
              </Button>
            )}
          </div>
        </div>

        {/* Footer Info */}
        <div className="text-center text-sm text-gray-500 animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <p>Build a balanced party to survive the depths below...</p>
          <p className="mt-1">💡 Tip: A mix of fighters, healers, and mages works best!</p>
        </div>
      </div>
    </div>
  );
}
