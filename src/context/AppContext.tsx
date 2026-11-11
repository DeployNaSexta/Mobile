import { createContext, useContext, useState, useCallback, useRef } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [selectedMachineId, setSelectedMachineId] = useState(null);
  const [toast, setToast] = useState(null);
  const toastTimer = useRef(null);

  const showToast = useCallback((msg) => {
    setToast(msg);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 1800);
  }, []);

  return (
    <AppContext.Provider value={{ selectedMachineId, setSelectedMachineId, toast, showToast }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp precisa estar dentro de <AppProvider>");
  return ctx;
}
