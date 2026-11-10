import { useEffect, useState } from "react";
import { reportService } from "@/components/services/reportService";

export type ReportPeriod = "diario" | "mensal" | "anual";

interface ReportBar {
  day: string;
  pct: number;
}

interface ReportItem {
  title: string;
  subtitle: string;
  when: string;
  today?: boolean;
}

export interface Report {
  stats: {
    eficiencia: string | number;
    horas: string | number;
    alertas: number;
  };
  chartLabel: string;
  bars: ReportBar[];
  items: ReportItem[];
}

export function useReport(periodo: ReportPeriod) {
  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadReport() {
      setLoading(true);

      try {
        const data = await reportService.getByPeriod(periodo);
        setReport(data);
      } catch (error) {
        console.error("Erro ao carregar relatório:", error);
        setReport(null);
      } finally {
        setLoading(false);
      }
    }

    loadReport();
  }, [periodo]);

  return { report, loading };
}