
export interface Alert {
  id: string;
  maquina: string;
  conjunto: string;
  tipo: string;
  nivel: "critico" | "atencao" | "alerta";
  mensagem: string;
  dataHora: string;
}

export interface Machine {
  id: string | number;
  nome: string;
  marca?: string | null;
  tipo: "colheitadeira" | "pulverizador" | "trator";
  createdAt: string;
}

export interface MachineListItemProps {
  machine: Machine;
  onPress: () => void;
}

export interface Leitura {
  id: number;
  maquina: string;
  conjunto: string;
  temperatura: number;
  vibracao: number;
  createdAt: string;
}

export interface HistoricoResponse {
  sucesso: boolean;
  dados: Leitura[];
}

export interface Monitoramento {
  maquina: string;
  totalConjuntos: number;
  media: {
    temperatura: number | null;
    vibracao: number | null;
  };
  conjuntos: Leitura[];
}

export interface MonitoramentoResponse {
  sucesso: boolean;
  dados: Monitoramento;
}
