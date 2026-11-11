
import {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
  type ReactNode,
} from "react";

interface AppContextData {
  selectedMachineId: string | number | null;
  setSelectedMachineId: (id: string | number | null) => void;
  toast: string | null;
  showToast: (msg: string) => void;
}

interface AppProviderProps {
  children: ReactNode;
}

const AppContext = createContext<AppContextData | null>(null);

export function AppProvider({ children }: AppProviderProps) {
  const [selectedMachineId, setSelectedMachineId] = useState<
    string | number | null
  >(null);

  const [toast, setToast] = useState<string | null>(null);

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((msg: string) => {
    setToast(msg);

    if (toastTimer.current) {
      clearTimeout(toastTimer.current);
    }

    toastTimer.current = setTimeout(() => {
      setToast(null);
      toastTimer.current = null;
    }, 1800);
  }, []);

  useEffect(() => {
    return () => {
      if (toastTimer.current) {
        clearTimeout(toastTimer.current);
      }
    };
  }, []);

  return (
    <AppContext.Provider
      value={{
        selectedMachineId,
        setSelectedMachineId,
        toast,
        showToast,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppContextData {
  const ctx = useContext(AppContext);

  if (!ctx) {
    throw new Error("useApp precisa estar dentro de <AppProvider>");
  }

  return ctx;
}
