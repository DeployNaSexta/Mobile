
import { useCallback, useEffect, useState } from "react";

import { vibrationService } from "@/components/services/vibrationService";
import { useMachines } from "@/hooks/useMachine";

import type { Monitoramento } from "@/types";

const MAQUINA_LOCAL = "Colheitadeira-01";

export function useMonitoramentoLocal() {
  const {
    machines,
    loading: machinesLoading,
    error: machinesError,
  } = useMachines();

  const [monitoramento, setMonitoramento] =
    useState<Monitoramento | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const carregarMonitoramento = useCallback(async () => {
    if (machinesLoading) return;

    if (machinesError) {
      setError(machinesError);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const maquina = machines.find(
        (item) => item.nome === MAQUINA_LOCAL
      );

      if (!maquina) {
        throw new Error(
          `Máquina ${MAQUINA_LOCAL} não encontrada.`
        );
      }

      const maquinaId = Number(maquina.id);

      if (!Number.isInteger(maquinaId) || maquinaId <= 0) {
        throw new Error("ID da máquina inválido.");
      }

      const dados = await vibrationService.getMonitoramento(
        String(maquinaId)
      );

      setMonitoramento(dados);
    } catch (err) {
      console.error("Erro ao carregar monitoramento local:", err);

      setError("Não foi possível carregar o monitoramento.");
    } finally {
      setLoading(false);
    }
  }, [machines, machinesLoading, machinesError]);

  useEffect(() => {
    void carregarMonitoramento();
  }, [carregarMonitoramento]);

  return {
    monitoramento,
    loading: loading || machinesLoading,
    error,
    refresh: carregarMonitoramento,
  };
}
