import React, { useState, useEffect } from 'react';

/**
 * Screen Transition Component
 * Provides smooth fade/slide transitions between game states
 */
export function ScreenTransition({ children, transitionKey, type = 'fade', duration = 300 }) {
  const [isVisible, setIsVisible] = useState(false);
  const [currentKey, setCurrentKey] = useState(transitionKey);

  useEffect(() => {
    if (transitionKey !== currentKey) {
      // Fade out
      setIsVisible(false);

      const timeout = setTimeout(() => {
        setCurrentKey(transitionKey);
        // Fade in
        setIsVisible(true);
      }, duration);

      return () => clearTimeout(timeout);
    } else {
      setIsVisible(true);
    }
  }, [transitionKey, currentKey, duration]);

  const getTransitionClass = () => {
    const baseClasses = `transition-all duration-${duration}`;

    if (!isVisible) {
      switch (type) {
        case 'fade':
          return `${baseClasses} opacity-0`;
        case 'slideLeft':
          return `${baseClasses} opacity-0 -translate-x-full`;
        case 'slideRight':
          return `${baseClasses} opacity-0 translate-x-full`;
        case 'slideUp':
          return `${baseClasses} opacity-0 -translate-y-full`;
        case 'slideDown':
          return `${baseClasses} opacity-0 translate-y-full`;
        case 'scale':
          return `${baseClasses} opacity-0 scale-75`;
        default:
          return `${baseClasses} opacity-0`;
      }
    }

    return `${baseClasses} opacity-100 translate-x-0 translate-y-0 scale-100`;
  };

  return (
    <div className={getTransitionClass()}>
      {children}
    </div>
  );
}

/**
 * Page transition hook
 * Manages page transition state
 */
export function usePageTransition(initialState = 'party') {
  const [currentPage, setCurrentPage] = useState(initialState);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const transitionTo = (newPage, delay = 0) => {
    if (newPage === currentPage || isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentPage(newPage);
      setTimeout(() => {
        setIsTransitioning(false);
      }, 300);
    }, delay);
  };

  return {
    currentPage,
    isTransitioning,
    transitionTo
  };
}
