import React from 'react';
import { Alert, AlertDescription } from '../ui/Alert';
import { DungeonMap } from './DungeonMap';
import { NavigationControls } from './NavigationControls';
import { PartyStatus } from './PartyStatus';

export function Exploration({
  dungeon,
  position,
  dungeonLevel,
  party,
  message,
  onMove,
  onRest
}) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        {message && (
          <Alert className="mb-4 bg-gray-800 border-2 border-amber-600 text-gray-100">
            <AlertDescription className="text-center text-lg whitespace-pre-line">
              {message}
            </AlertDescription>
          </Alert>
        )}

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-amber-400" style={{ fontFamily: "'Fondamento', serif" }}>
            Dungeon Level {dungeonLevel}
          </h2>
          <div className="text-sm text-gray-400">
            Pos: ({position.x}, {position.y}) | Facing: {position.facing}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 space-y-4">
            <DungeonMap dungeon={dungeon} position={position} />
            <NavigationControls onMove={onMove} onRest={onRest} />
          </div>

          <div className="space-y-4">
            <PartyStatus party={party} />

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
