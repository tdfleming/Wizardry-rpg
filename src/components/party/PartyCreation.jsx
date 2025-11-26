import React, { useState } from 'react';
import { Users } from 'lucide-react';
import { Alert, AlertDescription } from '../ui/Alert';
import { ClassSelector } from './ClassSelector';
import { PartyList } from './PartyList';
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

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-amber-400" style={{ fontFamily: "'Fondamento', serif" }}>
          ⚔️ WIZARDRY ⚔️
        </h1>
        <h2 className="text-xl text-center mb-8 text-gray-400" style={{ fontFamily: "'Fondamento', serif" }}>
          Proving Grounds of the Mad Overlord
        </h2>

        {message && (
          <Alert className="mb-6 bg-gray-800 border-2 border-amber-600 text-gray-100">
            <AlertDescription className="text-center whitespace-pre-line">
              {message}
            </AlertDescription>
          </Alert>
        )}

        <div className="bg-gray-800 border-2 border-amber-600 rounded-lg p-6 mb-6">
          <h3 className="text-2xl font-bold mb-4 flex items-center gap-2" style={{ fontFamily: "'Fondamento', serif" }}>
            <Users /> Create Your Party ({party.length}/{MAX_PARTY_SIZE})
          </h3>

          <div className="mb-6">
            <label className="block mb-2 font-bold">Select a Class:</label>
            <ClassSelector selectedClass={selectedClass} onSelectClass={setSelectedClass} />

            {selectedClass && (
              <div className="flex gap-2 mt-4">
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
                  disabled={!charNameInput.trim() || party.length >= MAX_PARTY_SIZE}
                  className="bg-green-600 hover:bg-green-500 disabled:bg-gray-600 disabled:cursor-not-allowed px-6 py-2 rounded font-bold"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          <PartyList party={party} onRemoveCharacter={removeCharacter} />

          <button
            onClick={onStartGame}
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
