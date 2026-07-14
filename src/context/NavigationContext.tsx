import React, { createContext, useContext, useState } from 'react';

export interface Route {
  name: string;
  params?: any;
}

interface NavigationContextType {
  currentRoute: Route;
  history: Route[];
  navigate: (screenName: string, params?: any) => void;
  goBack: () => void;
  resetTo: (screenName: string, params?: any) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [history, setHistory] = useState<Route[]>([{ name: 'splash' }]);

  const currentRoute = history[history.length - 1] || { name: 'splash' };

  const navigate = (screenName: string, params?: any) => {
    setHistory(prev => [...prev, { name: screenName, params }]);
  };

  const goBack = () => {
    if (history.length > 1) {
      setHistory(prev => prev.slice(0, -1));
    }
  };

  const resetTo = (screenName: string, params?: any) => {
    setHistory([{ name: screenName, params }]);
  };

  return (
    <NavigationContext.Provider value={{ currentRoute, history, navigate, goBack, resetTo }}>
      {children}
    </NavigationContext.Provider>
  );
};

export const useNavigateApp = () => {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigateApp must be used within a NavigationProvider');
  }
  return context;
};
