import React from 'react';

/**
 * Enhanced Button Component
 * Provides multiple variants with smooth animations and feedback
 */
export function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  disabled = false,
  className = '',
  icon = null,
  ...props
}) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 ease-out flex items-center justify-center gap-2 relative overflow-hidden';

  const variants = {
    primary: `
      bg-gradient-to-br from-amber-600 to-amber-700
      hover:from-amber-500 hover:to-amber-600
      active:from-amber-700 active:to-amber-800
      text-white shadow-lg shadow-amber-900/50
      hover:shadow-xl hover:shadow-amber-900/60
      hover:scale-105 active:scale-95
      border-2 border-amber-500
    `,
    secondary: `
      bg-gradient-to-br from-gray-700 to-gray-800
      hover:from-gray-600 hover:to-gray-700
      active:from-gray-800 active:to-gray-900
      text-gray-100 shadow-lg shadow-gray-900/50
      hover:shadow-xl hover:shadow-gray-900/60
      hover:scale-105 active:scale-95
      border-2 border-gray-600
    `,
    danger: `
      bg-gradient-to-br from-red-600 to-red-700
      hover:from-red-500 hover:to-red-600
      active:from-red-700 active:to-red-800
      text-white shadow-lg shadow-red-900/50
      hover:shadow-xl hover:shadow-red-900/60
      hover:scale-105 active:scale-95
      border-2 border-red-500
    `,
    success: `
      bg-gradient-to-br from-green-600 to-green-700
      hover:from-green-500 hover:to-green-600
      active:from-green-700 active:to-green-800
      text-white shadow-lg shadow-green-900/50
      hover:shadow-xl hover:shadow-green-900/60
      hover:scale-105 active:scale-95
      border-2 border-green-500
    `,
    ghost: `
      bg-transparent
      hover:bg-white/10
      active:bg-white/20
      text-gray-300 hover:text-white
      border-2 border-gray-600 hover:border-gray-500
      hover:scale-105 active:scale-95
    `,
    outline: `
      bg-transparent
      hover:bg-amber-600/20
      active:bg-amber-600/30
      text-amber-400 hover:text-amber-300
      border-2 border-amber-600 hover:border-amber-500
      hover:scale-105 active:scale-95
    `
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl'
  };

  const disabledClasses = `
    opacity-50 cursor-not-allowed
    hover:scale-100 active:scale-100
    hover:shadow-lg
  `;

  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${disabled ? disabledClasses : ''}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {/* Shine effect on hover */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0 hover:opacity-100 hover:animate-shimmer pointer-events-none" />

      {icon && <span className="text-xl">{icon}</span>}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

/**
 * Action Button - For combat actions
 */
export function ActionButton({
  children,
  onClick,
  selected = false,
  disabled = false,
  hotkey = null,
  className = '',
  ...props
}) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      className={`
        relative px-4 py-3 rounded-lg font-semibold
        transition-all duration-200
        border-2
        ${selected
          ? 'bg-amber-600 border-amber-400 text-white shadow-lg shadow-amber-600/50 scale-105'
          : 'bg-gray-800 border-gray-600 text-gray-200 hover:border-amber-500 hover:bg-gray-700'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 active:scale-95'}
        ${className}
      `}
      disabled={disabled}
      {...props}
    >
      {hotkey && (
        <span className="absolute -top-2 -right-2 bg-amber-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
          {hotkey}
        </span>
      )}
      {children}
    </button>
  );
}

/**
 * Card Component - For character/item cards
 */
export function Card({
  children,
  onClick,
  selected = false,
  disabled = false,
  className = '',
  glowColor = 'amber',
  ...props
}) {
  const glowColors = {
    amber: 'hover:shadow-amber-500/50 border-amber-500',
    red: 'hover:shadow-red-500/50 border-red-500',
    blue: 'hover:shadow-blue-500/50 border-blue-500',
    green: 'hover:shadow-green-500/50 border-green-500',
    purple: 'hover:shadow-purple-500/50 border-purple-500'
  };

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={`
        relative rounded-lg p-4
        bg-gradient-to-br from-gray-800 to-gray-900
        border-2 transition-all duration-300
        ${selected
          ? `${glowColors[glowColor]} shadow-2xl scale-105`
          : 'border-gray-700 hover:border-gray-600'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:shadow-xl hover:scale-102'}
        ${className}
      `}
      {...props}
    >
      {selected && (
        <div className="absolute -inset-1 bg-gradient-to-r from-amber-500 to-amber-600 opacity-30 rounded-lg blur animate-pulse" />
      )}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/**
 * Icon Button - For toolbar actions
 */
export function IconButton({
  icon,
  onClick,
  tooltip,
  variant = 'ghost',
  size = 'md',
  className = '',
  ...props
}) {
  const sizes = {
    sm: 'w-8 h-8 text-lg',
    md: 'w-10 h-10 text-xl',
    lg: 'w-12 h-12 text-2xl'
  };

  return (
    <button
      onClick={onClick}
      className={`
        ${sizes[size]}
        rounded-lg
        flex items-center justify-center
        transition-all duration-200
        ${variant === 'ghost'
          ? 'hover:bg-white/10 text-gray-400 hover:text-white'
          : 'bg-gray-800 hover:bg-gray-700 text-gray-300'
        }
        hover:scale-110 active:scale-95
        ${className}
      `}
      title={tooltip}
      {...props}
    >
      {icon}
    </button>
  );
}

/**
 * Badge Component - For status indicators
 */
export function Badge({
  children,
  variant = 'default',
  size = 'md',
  pulse = false,
  className = ''
}) {
  const variants = {
    default: 'bg-gray-700 text-gray-200',
    primary: 'bg-amber-600 text-white',
    success: 'bg-green-600 text-white',
    danger: 'bg-red-600 text-white',
    warning: 'bg-yellow-600 text-white',
    info: 'bg-blue-600 text-white'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base'
  };

  return (
    <span
      className={`
        inline-flex items-center justify-center
        rounded-full font-semibold
        ${variants[variant]}
        ${sizes[size]}
        ${pulse ? 'animate-pulse' : ''}
        ${className}
      `}
    >
      {children}
    </span>
  );
}
