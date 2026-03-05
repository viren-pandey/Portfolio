
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface UIContextType {
  isChatOpen: boolean;
  isTerminalOpen: boolean;
  toggleChat: () => void;
  toggleTerminal: () => void;
  openTerminal: () => void;
  closeTerminal: () => void;
  setChatOpen: (isOpen: boolean) => void;
}

const UIContext = createContext<UIContextType | undefined>(undefined);

export const UIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);

  const toggleChat = () => setIsChatOpen(prev => !prev);
  const toggleTerminal = () => setIsTerminalOpen(prev => !prev);
  const openTerminal = () => setIsTerminalOpen(true);
  const closeTerminal = () => setIsTerminalOpen(false);
  const setChatOpen = (isOpen: boolean) => setIsChatOpen(isOpen);

  return (
    <UIContext.Provider value={{ 
      isChatOpen, 
      isTerminalOpen, 
      toggleChat, 
      toggleTerminal, 
      openTerminal, 
      closeTerminal,
      setChatOpen
    }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => {
  const context = useContext(UIContext);
  if (context === undefined) {
    throw new Error('useUI must be used within a UIProvider');
  }
  return context;
};
