import { useCallback, useEffect, useState } from "react";
import { machineService } from "@/components/services/machineService";
import type { Machine } from "@/types";

export function useMachines() {
  const [machines, setMachines] = useState<Machine[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const reload = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await machineService.list();
      setMachines(data);
    } catch (err) {
      console.error("Erro ao carregar máquinas:", err);
      setError("Não foi possível carregar as máquinas.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  return {
    machines,
    loading,
    error,
    reload,
  };
}