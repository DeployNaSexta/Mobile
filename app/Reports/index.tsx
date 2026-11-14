
import { useEffect, useMemo, useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import {
  Activity,
  ChevronDown,
  Thermometer,
  Tractor,
  AlertTriangle,
  RefreshCw,
  BarChart3,
} from "lucide-react-native";

import ReportBars from "@/components/reports/ReportBars";
import { useMachines } from "@/hooks/useMachine";
import { useApp } from "@/components/contexts/AppContext";
import { vibrationService } from "@/components/services/vibrationService";
import type { Leitura, Machine } from "@/types";
import { theme } from "@/styles/theme";
type Periodo = "24h" | "7d" | "30d";
type Dias = 1 | 7 | 30;

interface Barra {
  label: string;
  value: number;
}

interface Estatisticas {
  maxima: number;
  minima: number;
  ultima: number;
}

interface Conjunto {
  nome: string;
  temperatura: Estatisticas;
  vibracao: Estatisticas;
  totalLeituras: number;
  ultimaLeituraEm: string;
}

const PERIODOS: { key: Periodo; label: string; dias: Dias }[] = [
  { key: "24h", label: "24 horas", dias: 1 },
  { key: "7d", label: "7 dias", dias: 7 },
  { key: "30d", label: "30 dias", dias: 30 },
];

function calcularMedia(valores: number[]): number {
  const validos = valores
    .map(Number)
    .filter((valor) => Number.isFinite(valor));

  if (validos.length === 0) return 0;

  const soma = validos.reduce((total, valor) => total + valor, 0);

  return soma / validos.length;
}

function obterEstatisticas(valores: number[]): Estatisticas {
  const validos = valores
    .map(Number)
    .filter((valor) => Number.isFinite(valor));

  if (validos.length === 0) {
    return {
      maxima: 0,
      minima: 0,
      ultima: 0,
    };
  }

  return {
    maxima: Math.max(...validos),
    minima: Math.min(...validos),
    ultima: validos[0],
  };
}

function formatarData(data: Date, periodo: Periodo): string {
  if (periodo === "24h") {
    return `${String(data.getHours()).padStart(2, "0")}h`;
  }

  return `${String(data.getDate()).padStart(2, "0")}/${String(
    data.getMonth() + 1
  ).padStart(2, "0")}`;
}

function formatarDataHora(valor: string): string {
  const data = new Date(valor);

  if (Number.isNaN(data.getTime())) {
    return "Data indisponível";
  }

  return `${data.toLocaleDateString("pt-BR")} às ${data.toLocaleTimeString(
    "pt-BR",
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  )}`;
}

function agruparLeituras(
  leituras: Leitura[],
  periodo: Periodo
): { temperatura: Barra[]; vibracao: Barra[] } {
  const grupos = new Map<
    string,
    {
      data: Date;
      temperaturas: number[];
      vibracoes: number[];
    }
  >();

  leituras.forEach((leitura) => {
    const data = new Date(leitura.createdAt);

    if (Number.isNaN(data.getTime())) return;

    const chaveData = new Date(data);

    if (periodo === "24h") {
      chaveData.setMinutes(0, 0, 0);
    } else {
      chaveData.setHours(0, 0, 0, 0);
    }

    const chave = chaveData.toISOString();

    if (!grupos.has(chave)) {
      grupos.set(chave, {
        data: chaveData,
        temperaturas: [],
        vibracoes: [],
      });
    }

    const grupo = grupos.get(chave)!;

    const temperatura = Number(leitura.temperatura);
    const vibracao = Number(leitura.vibracao);

    if (Number.isFinite(temperatura)) {
      grupo.temperaturas.push(temperatura);
    }

    if (Number.isFinite(vibracao)) {
      grupo.vibracoes.push(vibracao);
    }
  });

  const ordenados = Array.from(grupos.values()).sort(
    (a, b) => a.data.getTime() - b.data.getTime()
  );

  return {
    temperatura: ordenados
      .filter((grupo) => grupo.temperaturas.length > 0)
      .map((grupo) => ({
        label: formatarData(grupo.data, periodo),
        value: calcularMedia(grupo.temperaturas),
      })),

    vibracao: ordenados
      .filter((grupo) => grupo.vibracoes.length > 0)
      .map((grupo) => ({
        label: formatarData(grupo.data, periodo),
        value: calcularMedia(grupo.vibracoes),
      })),
  };
}

function agruparPorConjunto(leituras: Leitura[]): Conjunto[] {
  const grupos = new Map<string, Leitura[]>();

  leituras.forEach((leitura) => {
    const nome = leitura.conjunto || "Conjunto não identificado";

    if (!grupos.has(nome)) {
      grupos.set(nome, []);
    }

    grupos.get(nome)!.push(leitura);
  });

  return Array.from(grupos.entries()).map(([nome, leiturasGrupo]) => {
    const ordenadas = [...leiturasGrupo].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    const temperaturas = leiturasGrupo
      .map((leitura) => Number(leitura.temperatura))
      .filter((valor) => Number.isFinite(valor));

    const vibracoes = leiturasGrupo
      .map((leitura) => Number(leitura.vibracao))
      .filter((valor) => Number.isFinite(valor));

    const ultimaLeitura = ordenadas[0];

    const ultimaTemperatura = Number(ultimaLeitura?.temperatura);
    const ultimaVibracao = Number(ultimaLeitura?.vibracao);

    return {
      nome,
      temperatura: {
        ...obterEstatisticas(temperaturas),
        ultima: Number.isFinite(ultimaTemperatura)
          ? ultimaTemperatura
          : 0,
      },
      vibracao: {
        ...obterEstatisticas(vibracoes),
        ultima: Number.isFinite(ultimaVibracao)
          ? ultimaVibracao
          : 0,
      },
      totalLeituras: leiturasGrupo.length,
      ultimaLeituraEm: ultimaLeitura?.createdAt ?? "",
    };
  });
}

function formatarValor(valor: number): string {
  return valor.toFixed(1);
}

function IndicadoresConjunto({
  titulo,
  estatisticas,
  unidade,
}: {
  titulo: string;
  estatisticas: Estatisticas;
  unidade: string;
}) {
  return (
    <View style={styles.conjuntoSensor}>
      <Text style={styles.sensorTitle}>{titulo}</Text>

      <View style={styles.conjuntoStats}>
        <View style={styles.conjuntoStat}>
          <Text style={styles.metricLabel}>Mínima</Text>
          <Text style={styles.metricMinima}>
            {formatarValor(estatisticas.minima)} {unidade}
          </Text>
        </View>

        <View style={styles.conjuntoStat}>
          <Text style={styles.metricLabel}>Máxima</Text>
          <Text style={styles.metricMaxima}>
            {formatarValor(estatisticas.maxima)} {unidade}
          </Text>
        </View>

        <View style={styles.conjuntoStat}>
          <Text style={styles.metricLabel}>Última</Text>
          <Text style={styles.metricUltima}>
            {formatarValor(estatisticas.ultima)} {unidade}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default function Reports() {
  const {
    machines,
    loading: loadingMachines,
    error: machinesError,
  } = useMachines();

  const { selectedMachineId, setSelectedMachineId } = useApp();

  const [periodo, setPeriodo] = useState<Periodo>("24h");
  const [seletorAberto, setSeletorAberto] = useState(false);
  const [leituras, setLeituras] = useState<Leitura[]>([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  const maquinaSelecionada = useMemo(
    () =>
      machines.find(
        (maquina) =>
          String(maquina.id) === String(selectedMachineId)
      ),
    [machines, selectedMachineId]
  );

  const report = useMemo(
    () => ({
      totalLeituras: leituras.length,
      ...agruparLeituras(leituras, periodo),
      conjuntos: agruparPorConjunto(leituras),
    }),
    [leituras, periodo]
  );

  useEffect(() => {
    if (!selectedMachineId && machines.length > 0) {
      setSelectedMachineId(machines[0].id);
    }
  }, [machines, selectedMachineId, setSelectedMachineId]);

  useEffect(() => {
    if (!maquinaSelecionada) {
      setLeituras([]);
      setLoadingHistory(false);
      return;
    }

    let ativo = true;

    async function carregarHistorico() {
      if (!maquinaSelecionada) return;

      try {
        setLoadingHistory(true);
        setHistoryError(null);
        setLeituras([]);

        const dias = PERIODOS.find(
          (item) => item.key === periodo
        )!.dias;

        const dados = await vibrationService.getHistory(
          maquinaSelecionada.id,
          dias
        );

        if (ativo) {
          setLeituras(dados);
        }
      } catch (error) {
        console.error("Erro ao carregar histórico:", error);

        if (ativo) {
          setHistoryError("Não foi possível carregar o histórico.");
          setLeituras([]);
        }
      } finally {
        if (ativo) {
          setLoadingHistory(false);
        }
      }
    }

    carregarHistorico();

    return () => {
      ativo = false;
    };
  }, [maquinaSelecionada?.id, periodo, reloadKey]);

  const selecionarMaquina = (maquina: Machine) => {
    setSelectedMachineId(maquina.id);
    setSeletorAberto(false);
  };

  if (loadingMachines) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#22C55E" />
        <Text style={styles.loadingText}>Carregando máquinas...</Text>
      </View>
    );
  }

  if (machinesError) {
    return (
      <View style={styles.centerContainer}>
        <AlertTriangle size={28} color="#F59E0B" />
        <Text style={styles.emptyTitle}>Erro ao carregar máquinas</Text>
        <Text style={styles.emptyText}>
          Verifique sua conexão e tente novamente.
        </Text>
      </View>
    );
  }

  if (machines.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Tractor size={32} color="#64748B" />
        <Text style={styles.emptyTitle}>
          Nenhuma máquina cadastrada
        </Text>
        <Text style={styles.emptyText}>
          Cadastre uma máquina para visualizar os relatórios.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Relatórios</Text>
        <Text style={styles.subtitle}>
          Histórico e análise dos sensores
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>MÁQUINA MONITORADA</Text>

        <Pressable
          style={styles.machineSelector}
          onPress={() => setSeletorAberto(!seletorAberto)}
        >
          <View style={styles.machineIcon}>
            <Tractor size={21} color="#22C55E" />
          </View>

          <View style={styles.machineInfo}>
            <Text style={styles.machineName}>
              {maquinaSelecionada?.nome ?? "Selecione uma máquina"}
            </Text>
            <Text style={styles.machineType}>
              {maquinaSelecionada?.tipo ?? ""}
            </Text>
          </View>

          <ChevronDown
            size={20}
            color="#94A3B8"
            style={seletorAberto ? styles.chevronUp : undefined}
          />
        </Pressable>

        {seletorAberto && (
          <View style={styles.machineOptions}>
            {machines.map((maquina) => {
              const selecionada =
                String(maquina.id) === String(maquinaSelecionada?.id);

              return (
                <Pressable
                  key={maquina.id}
                  style={[
                    styles.machineOption,
                    selecionada && styles.machineOptionActive,
                  ]}
                  onPress={() => selecionarMaquina(maquina)}
                >
                  <Text
                    style={[
                      styles.machineOptionText,
                      selecionada && styles.machineOptionTextActive,
                    ]}
                  >
                    {maquina.nome}
                  </Text>

                  {selecionada && <View style={styles.selectedDot} />}
                </Pressable>
              );
            })}
          </View>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionLabel}>PERÍODO DE ANÁLISE</Text>

        <View style={styles.periodTabs}>
          {PERIODOS.map((item) => {
            const ativo = periodo === item.key;

            return (
              <Pressable
                key={item.key}
                onPress={() => setPeriodo(item.key)}
                style={[
                  styles.periodTab,
                  ativo && styles.periodTabActive,
                ]}
              >
                <Text
                  style={[
                    styles.periodText,
                    ativo && styles.periodTextActive,
                  ]}
                >
                  {item.label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {loadingHistory ? (
        <View style={styles.loadingCard}>
          <ActivityIndicator size="small" color="#22C55E" />
          <Text style={styles.loadingText}>
            Carregando histórico dos sensores...
          </Text>
        </View>
      ) : historyError ? (
        <View style={styles.emptyCard}>
          <AlertTriangle size={24} color="#F59E0B" />
          <Text style={styles.emptyTitle}>
            Falha ao carregar relatório
          </Text>
          <Text style={styles.emptyText}>{historyError}</Text>

          <Pressable
            style={styles.retryButton}
            onPress={() => setReloadKey((atual) => atual + 1)}
          >
            <RefreshCw size={15} color="#22C55E" />
            <Text style={styles.retryText}>Tentar novamente</Text>
          </Pressable>
        </View>
      ) : leituras.length === 0 ? (
        <View style={styles.emptyCard}>
          <Activity size={28} color="#64748B" />
          <Text style={styles.emptyTitle}>
            Nenhuma leitura encontrada
          </Text>
          <Text style={styles.emptyText}>
            Não existem dados registrados para esta máquina no período
            selecionado.
          </Text>
        </View>
      ) : (
        <>
          <View style={styles.readingsCard}>
            <View style={styles.readingsHeader}>
              <View style={styles.readingsIcon}>
                <BarChart3 size={20} color="#22C55E" />
              </View>

              <View style={styles.readingsInfo}>
                <Text style={styles.readingsTitle}>
                  Leituras registradas
                </Text>
                <Text style={styles.readingsSubtitle}>
                  Total de registros no período
                </Text>
              </View>

              <Text style={styles.readingsCount}>
                {report.totalLeituras}
              </Text>
            </View>
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <View style={styles.temperatureIcon}>
                  <Thermometer size={19} color="#F59E0B" />
                </View>

                <View>
                  <Text style={styles.cardTitle}>Temperatura</Text>
                  <Text style={styles.cardSubtitle}>
                    {periodo === "24h"
                      ? "Média das leituras por hora"
                      : "Média das leituras por dia"}
                  </Text>
                </View>
              </View>

              <Text style={styles.unitLabel}>°C</Text>
            </View>

            <ReportBars
              bars={report.temperatura}
              unit="°C"
              color="#F59E0B"
            />
          </View>

          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <View style={styles.cardTitleContainer}>
                <View style={styles.vibrationIcon}>
                  <Activity size={19} color="#3B82F6" />
                </View>

                <View>
                  <Text style={styles.cardTitle}>Vibração</Text>
                  <Text style={styles.cardSubtitle}>
                    {periodo === "24h"
                      ? "Média das leituras por hora"
                      : "Média das leituras por dia"}
                  </Text>
                </View>
              </View>

              <Text style={styles.unitLabel}>mm/s</Text>
            </View>

            <ReportBars
              bars={report.vibracao}
              unit="mm/s"
              color="#3B82F6"
            />
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View>
                <Text style={styles.sectionTitle}>
                  Análise por conjunto
                </Text>
                <Text style={styles.sectionSubtitle}>
                  Mínimas, máximas e últimas leituras de cada componente
                </Text>
              </View>
            </View>

            <View style={styles.conjuntoList}>
              {report.conjuntos.map((conjunto) => (
                <View
                  key={conjunto.nome}
                  style={styles.conjuntoCard}
                >
                  <View style={styles.conjuntoHeader}>
                    <Text style={styles.conjuntoName}>
                      {conjunto.nome}
                    </Text>

                    <Text style={styles.conjuntoReadings}>
                      {conjunto.totalLeituras} leituras
                    </Text>
                  </View>

                  <IndicadoresConjunto
                    titulo="Temperatura"
                    estatisticas={conjunto.temperatura}
                    unidade="°C"
                  />

                  <View style={styles.sensorDivider} />

                  <IndicadoresConjunto
                    titulo="Vibração"
                    estatisticas={conjunto.vibracao}
                    unidade="mm/s"
                  />

                  <Text style={styles.lastReading}>
                    Último registro:{" "}
                    {formatarDataHora(conjunto.ultimaLeituraEm)}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          <Text style={styles.disclaimer}>
            Os gráficos apresentam médias agrupadas por hora ou dia. Os
            cartões mostram os valores mínimos, máximos e a última leitura
            registrada de cada conjunto. Essas informações são históricas e
            não representam, isoladamente, o status operacional atual da
            máquina.
          </Text>
        </>
      )}
    </ScrollView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 12,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  header: {
    marginBottom: 8,
    gap: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: "#B0B0B0",
  },
  section: {
    marginBottom: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#B0B0B0",
    marginBottom: 10,
  },
  sectionTitle: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "700",
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#B0B0B0",
    marginTop: 5,
    marginBottom: 16,
  },

  // Seletor de máquina
  machineSelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "#5a5a5a",
    borderRadius: 12,
    padding: 14,
    gap: 12,
    shadowColor: "#ffffff",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  machineIcon: {
    width: 42,
    height: 42,
    borderRadius: 10,
    backgroundColor: "#183324",
    alignItems: "center",
    justifyContent: "center",
  },
  machineInfo: {
    flex: 1,
    gap: 3,
  },
  machineName: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  machineType: {
    color: "#B0B0B0",
    fontSize: 12,
    textTransform: "capitalize",
  },
  chevronUp: {
    transform: [{ rotate: "180deg" }],
  },
  machineOptions: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "#5a5a5a",
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 8,
  },
  machineOption: {
    minHeight: 46,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#303030",
  },
  machineOptionActive: {
    backgroundColor: "#1B2B22",
  },
  machineOptionText: {
    color: "#CBD5E1",
    fontSize: 13,
  },
  machineOptionTextActive: {
    color: "#4ADE80",
    fontWeight: "700",
  },
  selectedDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: "#22C55E",
  },

  // Filtro de período
  periodTabs: {
    flexDirection: "row",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 4,
    borderWidth: 1,
    borderColor: "#5a5a5a",
    gap: 4,
  },
  periodTab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 11,
    borderRadius: 9,
  },
  periodTabActive: {
    backgroundColor: "#1B2B22",
  },
  periodText: {
    color: "#B0B0B0",
    fontSize: 12,
    fontWeight: "600",
  },
  periodTextActive: {
    color: "#4ADE80",
    fontWeight: "700",
  },

  // Total de leituras
  readingsCard: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "#5a5a5a",
    borderRadius: 12,
    padding: 14,
    shadowColor: "#ffffff",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  readingsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  readingsIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#183324",
    alignItems: "center",
    justifyContent: "center",
  },
  readingsInfo: {
    flex: 1,
    gap: 3,
  },
  readingsTitle: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  readingsSubtitle: {
    color: "#B0B0B0",
    fontSize: 12,
  },
  readingsCount: {
    color: "#4ADE80",
    fontSize: 23,
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },

  // Gráficos
  card: {
    backgroundColor: theme.colors.surface,
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#5a5a5a",
    gap: 14,
    shadowColor: "#ffffff",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  cardTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  temperatureIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#422B12",
    alignItems: "center",
    justifyContent: "center",
  },
  vibrationIcon: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#172B49",
    alignItems: "center",
    justifyContent: "center",
  },
  cardTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
  },
  cardSubtitle: {
    color: "#B0B0B0",
    fontSize: 12,
    marginTop: 3,
  },
  unitLabel: {
    color: "#B0B0B0",
    fontSize: 13,
    fontWeight: "600",
  },

  // Análise por conjunto
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  conjuntoList: {
    gap: 10,
  },
  conjuntoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#5a5a5a",
    gap: 14,
    shadowColor: "#ffffff",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  conjuntoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  conjuntoName: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "700",
  },
  conjuntoReadings: {
    color: "#B0B0B0",
    fontSize: 12,
  },
  conjuntoSensor: {
    gap: 10,
  },
  sensorTitle: {
    color: theme.colors.text,
    fontSize: 14,
    fontWeight: "700",
  },
  conjuntoStats: {
    flexDirection: "row",
    gap: 8,
  },
  conjuntoStat: {
    flex: 1,
    gap: 5,
  },
  sensorDivider: {
    height: 1,
    backgroundColor: "#303030",
  },
  metricLabel: {
    color: "#B0B0B0",
    fontSize: 14,
  },
  metricMinima: {
    color: "#60A5FA",
    fontSize: 15,
    fontWeight: "700",
  },

  metricMaxima: {
    color: "#F59E0B",
    fontSize: 15,
    fontWeight: "700",
  },

  metricUltima: {
    color: "#4ADE80",
    fontSize: 15,
    fontWeight: "700",
  },
  lastReading: {
    color: "#B0B0B0",
    fontSize: 12,
    marginTop: 2,
  },

  // Estados e mensagens
  loadingCard: {
    minHeight: 130,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "#5a5a5a",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
    padding: 24,
  },
  loadingText: {
    color: "#B0B0B0",
    fontSize: 13,
  },
  emptyCard: {
    minHeight: 190,
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: "#5a5a5a",
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    padding: 22,
    gap: 10,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "700",
    textAlign: "center",
  },
  emptyText: {
    color: "#B0B0B0",
    fontSize: 13,
    lineHeight: 18,
    textAlign: "center",
  },
  retryButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 14,
    paddingVertical: 9,
    borderRadius: 9,
    backgroundColor: "#1B2B22",
    marginTop: 4,
  },
  retryText: {
    color: "#4ADE80",
    fontSize: 13,
    fontWeight: "700",
  },
  disclaimer: {
    color: "#B0B0B0",
    fontSize: 11,
    lineHeight: 17,
    textAlign: "center",
    paddingHorizontal: 12,
  },
});

