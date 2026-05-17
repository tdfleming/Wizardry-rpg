import { useState, useSyncExternalStore } from 'react';
import { gameStore } from './store';
import { audio } from './audio';
import { CLASSES } from '../data/classes';

function MuteButton() {
  const [muted, setMuted] = useState(audio.muted);
  return (
    <button
      onClick={() => setMuted(audio.toggleMute())}
      className="pointer-events-auto absolute right-4 top-4 rounded-lg border-2 border-amber-700/70 bg-gray-900/90 px-3 py-1.5 text-xs font-bold text-amber-200 backdrop-blur-sm transition-colors hover:bg-gray-800"
      style={{ fontFamily: "'Fondamento', serif" }}
    >
      {muted ? 'Sound: Off' : 'Sound: On'}
    </button>
  );
}

function StatBar({ value, max, color }) {
  const ratio = max > 0 ? Math.max(0, Math.min(1, value / max)) : 0;
  return (
    <div className="h-2 w-full rounded-full bg-black/70 overflow-hidden border border-black/60">
      <div
        className={`h-full ${color} transition-all duration-300`}
        style={{ width: `${ratio * 100}%` }}
      />
    </div>
  );
}

function PartyCard({ member }) {
  const cls = CLASSES[member.class];
  return (
    <div
      className={`w-40 rounded-lg border-2 px-3 py-2 backdrop-blur-sm ${
        member.alive
          ? 'border-amber-700/70 bg-gray-900/85'
          : 'border-red-900/60 bg-red-950/50 opacity-60'
      }`}
    >
      <div className="flex items-center justify-between gap-1">
        <span className="truncate text-sm font-bold text-gray-100">
          {cls?.icon} {member.name}
        </span>
        <span className="text-xs text-amber-400">Lv{member.level}</span>
      </div>
      <div className="mt-1.5 flex items-center gap-1">
        <span className="w-6 text-[10px] font-bold text-green-400">HP</span>
        <StatBar value={member.hp} max={member.maxHp} color="bg-green-500" />
        <span className="w-12 text-right font-mono text-[10px] text-gray-300">
          {member.hp}/{member.maxHp}
        </span>
      </div>
      {member.maxMp > 0 && (
        <div className="mt-1 flex items-center gap-1">
          <span className="w-6 text-[10px] font-bold text-blue-400">MP</span>
          <StatBar value={member.mp} max={member.maxMp} color="bg-blue-500" />
          <span className="w-12 text-right font-mono text-[10px] text-gray-300">
            {member.mp}/{member.maxMp}
          </span>
        </div>
      )}
    </div>
  );
}

export function GameHUD() {
  const state = useSyncExternalStore(gameStore.subscribe, gameStore.getState);

  return (
    <div className="pointer-events-none absolute inset-0">
      {/* Mute toggle stays visible during combat too. */}
      <MuteButton />

      {/* The rest of the HUD hides during combat — Phaser draws its own UI. */}
      {!state.inCombat && (
        <div className="absolute inset-0 flex flex-col justify-between p-4">
          <div className="flex justify-center">
            <div className="max-w-2xl rounded-lg border-2 border-amber-700/70 bg-gray-900/90 px-6 py-2 text-center backdrop-blur-sm">
              <div
                className="text-sm font-bold tracking-widest text-amber-400"
                style={{ fontFamily: "'Fondamento', serif" }}
              >
                DUNGEON LEVEL {state.dungeonLevel}
              </div>
              <p
                className="whitespace-pre-line text-base text-amber-100"
                style={{ fontFamily: "'Fondamento', serif" }}
              >
                {state.message}
              </p>
            </div>
          </div>

          <div className="flex flex-col items-center gap-2">
            <div className="text-xs tracking-wide text-gray-400">
              Arrows / WASD — move      ·      R — rest the party
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              {state.party.map((member) => (
                <PartyCard key={member.id} member={member} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
