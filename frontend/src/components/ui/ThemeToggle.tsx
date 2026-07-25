import React from 'react';
import { cn } from '../../lib/utils';
import { useTheme } from '../../context/ThemeContext';

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useTheme();
  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      className={cn(
        'relative inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors duration-200',
        'text-luxury-charcoal/70 hover:text-luxury-charcoal hover:bg-luxury-ivory',
        className
      )}
    >
      <span
        className={cn(
          'absolute text-base leading-none transition-all duration-300',
          isDark ? 'scale-0 opacity-0 rotate-90' : 'scale-100 opacity-100 rotate-0'
        )}
        aria-hidden
      >
        ☀️
      </span>
      <span
        className={cn(
          'absolute text-base leading-none transition-all duration-300',
          isDark ? 'scale-100 opacity-100 rotate-0' : 'scale-0 opacity-0 -rotate-90'
        )}
        aria-hidden
      >
        🌙
      </span>
      <span className="sr-only">{isDark ? 'Dark mode' : 'Light mode'}</span>
    </button>
  );
}
