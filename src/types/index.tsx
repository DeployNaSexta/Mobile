export interface Alert {
  id: string | number;
  maquina: string;
  tipo: string;
  nivel: "atencao" | "critico" | "resolvido" | "info";
  mensagem: string;
  dataHora: string;
}

export interface Machine {
  id: string | number;
  name: string;
  model: string;
  temp: number;
  vib: number;
  updatedAt: Date | string | null;
}