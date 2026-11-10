export interface Alert {
  id: string | number;
  level: "atencao" | "critico" | "resolvido" | "info";
  machine: string;
  label: string;
  message: string;
  sensor: string;
  when: string | number | Date;
}