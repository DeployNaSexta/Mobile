import { api } from "./api";

import type { Machine } from "@/types";

export const machineService = {
  async list(): Promise<Machine[]> {
    const { data } = await api.get<Machine[]>("/maquinas");

    return data;
  },

  async getById(id: string | number): Promise<Machine> {
    const { data } = await api.get<Machine>(`/maquinas/${id}`);

    return data;
  },
};