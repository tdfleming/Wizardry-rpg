import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';

export function NavigationControls({ onMove, onRest }) {
  return (
    <div className="bg-gray-800 border-2 border-amber-600 rounded-lg p-6">
      <h3 className="font-bold mb-4 text-lg" style={{ fontFamily: "'Fondamento', serif" }}>
        Navigation
      </h3>
      <div className="flex justify-center gap-8">
        <div className="grid grid-cols-3 gap-2">
          <div></div>
          <button
            onClick={() => onMove('forward')}
            className="bg-amber-600 hover:bg-amber-500 p-4 rounded transition-colors"
          >
            <ArrowUp size={24} />
          </button>
          <div></div>

          <button
            onClick={() => onMove('left')}
            className="bg-amber-600 hover:bg-amber-500 p-4 rounded transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <button
            onClick={() => onMove('back')}
            className="bg-amber-600 hover:bg-amber-500 p-4 rounded transition-colors"
          >
            <ArrowDown size={24} />
          </button>
          <button
            onClick={() => onMove('right')}
            className="bg-amber-600 hover:bg-amber-500 p-4 rounded transition-colors"
          >
            <ArrowRight size={24} />
          </button>
        </div>

        <div className="flex items-center">
          <button
            onClick={onRest}
            className="bg-green-600 hover:bg-green-500 px-8 py-4 rounded font-bold text-lg"
          >
            💚 Rest & Recover
          </button>
        </div>
      </div>
    </div>
  );
}
