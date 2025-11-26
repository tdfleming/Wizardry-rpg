import React from 'react';
import { Map } from 'lucide-react';
import { TILE_TYPES } from '../../data/constants';

export function DungeonMap({ dungeon, position }) {
  return (
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
                  : cell === TILE_TYPES.WALL
                  ? 'bg-gray-600'
                  : cell === TILE_TYPES.ENCOUNTER
                  ? 'bg-red-900'
                  : cell === TILE_TYPES.TREASURE
                  ? 'bg-yellow-700'
                  : cell === TILE_TYPES.STAIRS
                  ? 'bg-blue-700'
                  : 'bg-gray-700'
              }`}
            >
              {x === position.x && y === position.y ? position.facing : ''}
            </div>
          ))
        )}
      </div>

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
  );
}
