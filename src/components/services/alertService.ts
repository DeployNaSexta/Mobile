import { api } from "./api";

export const alertService = {
  async list() {
    const { data } = await api.get("/alertas");
    return data;
  },
};