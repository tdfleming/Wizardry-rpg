import React from 'react';

/**
 * Enhanced Bar Component with smooth animations and visual effects
 * Used for HP, MP, and XP bars with color gradients and pulse effects
 */
export function EnhancedBar({
  current,
  max,
  label,
  type = 'hp',
  showNumbers = true,
  height = 'h-4'
}) {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100));
  const isLow = percentage < 30;
  const isMedium = percentage >= 30 && percentage < 70;
  const isFull = percentage === 100;

  // Color schemes based on type and percentage
  const getColors = () => {
    if (type === 'hp') {
      if (percentage >= 70) {
        return {
          bg: 'bg-gradient-to-r from-green-600 to-green-400',
          glow: 'shadow-[0_0_10px_rgba(34,197,94,0.5)]',
          text: 'text-green-400'
        };
      } else if (percentage >= 30) {
        return {
          bg: 'bg-gradient-to-r from-yellow-600 to-yellow-400',
          glow: 'shadow-[0_0_10px_rgba(234,179,8,0.5)]',
          text: 'text-yellow-400'
        };
      } else {
        return {
          bg: 'bg-gradient-to-r from-red-600 to-red-400',
          glow: 'shadow-[0_0_10px_rgba(239,68,68,0.5)]',
          text: 'text-red-400'
        };
      }
    } else if (type === 'mp') {
      return {
        bg: 'bg-gradient-to-r from-blue-600 to-blue-400',
        glow: percentage < 30 ? 'shadow-[0_0_10px_rgba(59,130,246,0.3)]' : 'shadow-[0_0_10px_rgba(59,130,246,0.5)]',
        text: 'text-blue-400'
      };
    } else if (type === 'xp') {
      return {
        bg: 'bg-gradient-to-r from-purple-600 to-purple-400',
        glow: percentage > 80 ? 'shadow-[0_0_15px_rgba(147,51,234,0.6)]' : 'shadow-[0_0_5px_rgba(147,51,234,0.3)]',
        text: 'text-purple-400'
      };
    }
  };

  const colors = getColors();

  return (
    <div className="space-y-1">
      {/* Label and Numbers */}
      {label && (
        <div className="flex justify-between items-center text-xs">
          <span className={`font-semibold ${colors.text}`}>{label}</span>
          {showNumbers && (
            <span className={`${colors.text} font-mono`}>
              {current}/{max}
            </span>
          )}
        </div>
      )}

      {/* Bar Container */}
      <div className="relative">
        {/* Background track */}
        <div className={`${height} bg-gray-900 rounded-full overflow-hidden border border-gray-700 relative`}>
          {/* Animated fill bar */}
          <div
            className={`
              ${height} ${colors.bg} rounded-full
              transition-all duration-500 ease-out
              ${isLow && type === 'hp' ? 'animate-barPulse' : ''}
              ${isFull ? 'animate-barGlow' : ''}
              ${colors.glow}
            `}
            style={{
              width: `${percentage}%`,
              transitionProperty: 'width'
            }}
          >
            {/* Shine effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer"></div>
          </div>

          {/* Percentage text overlay for larger bars */}
          {height !== 'h-2' && height !== 'h-3' && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xs font-bold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)] mix-blend-difference">
                {Math.round(percentage)}%
              </span>
            </div>
          )}
        </div>

        {/* Low warning indicator */}
        {isLow && type === 'hp' && (
          <div className="absolute -right-1 top-1/2 -translate-y-1/2">
            <span className="text-red-500 text-xs animate-pulse">⚠️</span>
          </div>
        )}

        {/* Full indicator */}
        {isFull && (
          <div className="absolute -right-1 top-1/2 -translate-y-1/2">
            <span className="text-yellow-300 text-xs animate-pulse">✨</span>
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Compact version for combat screens
 */
export function CompactBar({ current, max, type = 'hp' }) {
  return (
    <EnhancedBar
      current={current}
      max={max}
      type={type}
      showNumbers={false}
      height="h-2"
    />
  );
}
