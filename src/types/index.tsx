export interface Alert {
  id: string | number;
  maquina: string;
  tipo: string;
  nivel: "atencao" | "critico" | "resolvido" | "info";
  mensagem: string;
  dataHora: string;
}

export interface Machine {
  id: number;
  nome: string;
  temperatura: number;
  vibracao: number;
  vibracaoX: number;
  vibracaoY: number;
  vibracaoZ: number;
  status: string;
}