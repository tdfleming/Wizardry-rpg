import React from 'react';
import { CLASSES } from '../../data/classes';

export function PartyList({ party, onRemoveCharacter }) {
  if (party.length === 0) return null;

  return (
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
              onClick={() => onRemoveCharacter(char.id)}
              className="text-red-400 hover:text-red-300 px-3 py-1 rounded hover:bg-gray-600"
            >
              Remove
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
