import { api } from "./api";
import type {
  Leitura,
  HistoricoResponse,
  MonitoramentoResponse,
} from "@/types";

export const vibrationService = {
  async getHistory(
    maquinaId: string | number,
    dias: 1 | 7 | 30
  ): Promise<Leitura[]> {
    const { data } = await api.get<HistoricoResponse>(
      `/vibracao/${encodeURIComponent(String(maquinaId))}/historico`,
      {
        params: { dias },
      }
    );

    return data.dados;
  },

  async getMonitoramento(
    maquina: string
  ): Promise<MonitoramentoResponse["dados"]> {
    const { data } = await api.get<MonitoramentoResponse>(
      `/vibracao/${encodeURIComponent(maquina)}/monitoramento`
    );

    return data.dados;
  },
};