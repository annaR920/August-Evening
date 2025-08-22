import React, { createContext, useContext, useState, useEffect } from 'react';

interface DebugContextType {
  isDebugVisible: boolean;
  toggleDebug: () => void;
}

const DebugContext = createContext<DebugContextType | undefined>(undefined);

export const useDebug = () => {
  const context = useContext(DebugContext);
  if (context === undefined) {
    throw new Error('useDebug must be used within a DebugProvider');
  }
  return context;
};

interface DebugProviderProps {
  children: React.ReactNode;
}

export const DebugProvider: React.FC<DebugProviderProps> = ({ children }) => {
  const [isDebugVisible, setIsDebugVisible] = useState(false);

  // Load debug visibility state from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('bb_debug_visible');
      if (stored) {
        setIsDebugVisible(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading debug visibility state:', error);
    }
  }, []);

  // Save debug visibility state to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('bb_debug_visible', JSON.stringify(isDebugVisible));
    } catch (error) {
      console.error('Error saving debug visibility state:', error);
    }
  }, [isDebugVisible]);

  const toggleDebug = () => {
    setIsDebugVisible(prev => !prev);
  };

  return (
    <DebugContext.Provider value={{ isDebugVisible, toggleDebug }}>
      {children}
    </DebugContext.Provider>
  );
};
