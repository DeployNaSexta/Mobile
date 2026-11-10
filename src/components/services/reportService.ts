import { api } from "./api";

export const reportService = {
  async getByPeriod(periodo: string = "diario"): Promise<unknown> {
    const { data } = await api.get("/relatorios", {
      params: { periodo },
    });

    return data;
  },
};