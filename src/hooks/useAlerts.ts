
import { useEffect, useState } from "react";
import { alertService } from "@/components/services/alertService";

import type { Alert } from "@/types/index";

export function useAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadAlerts() {
      try {
        setLoading(true);
        const data = await alertService.list();

        setAlerts(data);
      } catch (err) {
        setError("Não foi possível carregar os alertas.");
      } finally {
        setLoading(false);
      }
    }

    loadAlerts();
  }, []);

  return {
    alerts,
    loading,
    error,
  };
}
