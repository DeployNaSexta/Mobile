
import { useCallback, useEffect, useState } from "react";

import { vibrationService } from "@/components/services/vibrationService";
import type { Leitura } from "@/types";

export function useMachineHistory(maquina: string | null) {
  const [history, setHistory] = useState<Leitura[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    if (!maquina) {
      setHistory([]);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await vibrationService.getHistory(maquina);
      setHistory(data);
    } catch (err) {
      console.error("Erro ao carregar histórico:", err);
      setError("Não foi possível carregar o histórico da máquina.");
    } finally {
      setLoading(false);
    }
  }, [maquina]);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    history,
    loading,
    error,
    reload,
  };
}
