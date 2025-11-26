import React from 'react';
import { CLASSES } from '../../data/classes';

export function ClassSelector({ selectedClass, onSelectClass }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
      {Object.entries(CLASSES).map(([key, cls]) => (
        <button
          key={key}
          onClick={() => onSelectClass(key)}
          className={`p-4 rounded border-2 transition-all ${
            selectedClass === key
              ? 'bg-amber-600 border-amber-400'
              : 'bg-gray-700 border-gray-600 hover:border-amber-500'
          }`}
        >
          <div className="text-3xl mb-2">{cls.icon}</div>
          <div className="font-bold">{cls.name}</div>
          <div className="text-xs text-gray-400">
            HP:{cls.hp} MP:{cls.mp} STR:{cls.str}
          </div>
        </button>
      ))}
    </div>
  );
}
