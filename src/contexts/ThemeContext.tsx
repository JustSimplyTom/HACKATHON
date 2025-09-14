/**
 * Theme Context Provider
 * 
 * Manages the application's theme state (light/dark mode):
 * - Theme state management
 * - Local storage persistence
 * - Context provider for theme access
 * - Theme toggle functionality
 * 
 * Features:
 * - Automatic theme detection from system preferences
 * - Persistent theme selection
 * - Context-based theme access
 * - Error handling for context usage
 * 
 * @author Dang Minh Duc - RMIT University VN
 * @version 1.0.0
 */

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Theme } from '../types/Task';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ThemeProviderProps) => {
  const [theme, setTheme] = useState<Theme>(() => {
    // Check localStorage first, then system preference
    const savedTheme = localStorage.getItem('task-manager-theme') as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  });

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('task-manager-theme', theme);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
