import React from 'react';
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button, IconButton } from '../ui/Button';

export function NavigationControls({ onMove, onRest }) {
  return (
    <div className="bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-amber-600 rounded-lg p-6 shadow-xl">
      <h3 className="font-bold mb-4 text-lg text-amber-400 flex items-center gap-2" style={{ fontFamily: "'Fondamento', serif" }}>
        🧭 Navigation
      </h3>
      <div className="flex justify-center gap-8 flex-wrap">
        {/* D-Pad */}
        <div className="grid grid-cols-3 gap-2">
          <div></div>
          <IconButton
            icon={<ArrowUp size={24} />}
            onClick={() => onMove('forward')}
            tooltip="Move Forward (W/↑)"
            variant="solid"
            className="bg-amber-600 hover:bg-amber-500 text-white w-14 h-14"
          />
          <div></div>

          <IconButton
            icon={<ArrowLeft size={24} />}
            onClick={() => onMove('left')}
            tooltip="Turn Left (A/←)"
            variant="solid"
            className="bg-amber-600 hover:bg-amber-500 text-white w-14 h-14"
          />
          <IconButton
            icon={<ArrowDown size={24} />}
            onClick={() => onMove('back')}
            tooltip="Move Back (S/↓)"
            variant="solid"
            className="bg-amber-600 hover:bg-amber-500 text-white w-14 h-14"
          />
          <IconButton
            icon={<ArrowRight size={24} />}
            onClick={() => onMove('right')}
            tooltip="Turn Right (D/→)"
            variant="solid"
            className="bg-amber-600 hover:bg-amber-500 text-white w-14 h-14"
          />
        </div>

        {/* Rest Button */}
        <div className="flex items-center">
          <Button
            onClick={onRest}
            variant="success"
            size="lg"
            icon="💚"
          >
            Rest & Recover
          </Button>
        </div>
      </div>
    </div>
  );
}
