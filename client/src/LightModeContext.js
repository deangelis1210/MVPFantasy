import React, { createContext, useContext, useState } from 'react';

const LightModeContext = createContext();

export function useLightMode() {
  return useContext(LightModeContext);
}

export function LightModeProvider({ children }) {
  const [isLightMode, setIsLightMode] = useState(false);

  const toggleLightMode = () => {
    setIsLightMode(!isLightMode);
  };

  return (
    <LightModeContext.Provider value={{ isLightMode, toggleLightMode }}>
      {children}
    </LightModeContext.Provider>
  );
}
