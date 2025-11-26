import React from 'react';

export function GameOver({ message, onRestart }) {
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-gray-900 to-black text-gray-100 p-8 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4 text-red-500" style={{ fontFamily: "'Fondamento', serif" }}>
          💀 GAME OVER 💀
        </h1>
        <p className="text-xl mb-8">{message}</p>
        <button
          onClick={onRestart}
          className="bg-amber-600 hover:bg-amber-500 px-8 py-4 rounded font-bold text-lg"
        >
          Create New Party
        </button>
      </div>
    </div>
  );
}
