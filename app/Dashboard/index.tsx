
import { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";

import { useMachines } from "@/hooks/useMachine";
import { useAlerts } from "@/hooks/useAlerts";
import { useApp } from "@/components/contexts/AppContext";
import { vibrationService } from "@/components/services/vibrationService";

import MachineSelector from "@/components/dashboard/MachineSelector";

import type { Monitoramento } from "@/types";
import { theme } from "@/styles/theme";

import {
  Thermometer,
  Activity,
  Settings,
  AlertTriangle,
  Clock,
} from "lucide-react-native";

export default function Dashboard() {
  const { machines, loading: machinesLoading } = useMachines();
  const { alerts, loading: alertsLoading } = useAlerts();

  const { selectedMachineId, setSelectedMachineId } = useApp();

  const [monitoramento, setMonitoramento] =
    useState<Monitoramento | null>(null);

  const [monitoramentoLoading, setMonitoramentoLoading] =
    useState(false);

  const [monitoramentoError, setMonitoramentoError] =
    useState<string | null>(null);

  useEffect(() => {
    if (!selectedMachineId && machines.length > 0) {
      setSelectedMachineId(machines[0].id);
    }
  }, [machines, selectedMachineId, setSelectedMachineId]);

  const machine =
    machines.find(
      (item) => String(item.id) === String(selectedMachineId)
    ) || machines[0];

  useEffect(() => {
    if (!machine) {
      setMonitoramento(null);
      return;
    }

    const machineId = String(machine.id);
    let cancelled = false;

    async function carregarMonitoramento() {
      try {
        setMonitoramentoLoading(true);
        setMonitoramentoError(null);
        setMonitoramento(null);

        const dados =
          await vibrationService.getMonitoramento(machineId);

        if (!cancelled) {
          setMonitoramento(dados);
        }
      } catch (error) {
        console.error("Erro ao carregar monitoramento:", error);

        if (!cancelled) {
          setMonitoramentoError(
            "Não foi possível carregar os dados dos sensores."
          );
        }
      } finally {
        if (!cancelled) {
          setMonitoramentoLoading(false);
        }
      }
    }

    void carregarMonitoramento();

    return () => {
      cancelled = true;
    };
  }, [machine?.id]);

  if (machinesLoading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator
          size="large"
          color={theme.colors.primary}
        />
        <Text style={styles.message}>
          Carregando dashboard...
        </Text>
      </View>
    );
  }

  if (!machine) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>
          Nenhuma máquina cadastrada
        </Text>
        <Text style={styles.message}>
          Cadastre uma máquina para visualizar os dados.
        </Text>
      </View>
    );
  }

  const temperature = monitoramento?.media.temperatura ?? null;
  const vibration = monitoramento?.media.vibracao ?? null;

  const conjuntosMonitorados =
    monitoramento?.conjuntos.length ?? 0;

  const conjuntosComAlertas = new Set(
    alerts
      .filter(
        (alerta) =>
          alerta.maquina === machine.nome &&
          (alerta.nivel === "critico" ||
            alerta.nivel === "atencao" ||
            alerta.nivel === "alerta")
      )
      .map((alerta) => alerta.conjunto)
  ).size;

  const ultimaLeitura = monitoramento?.conjuntos.reduce<
    string | null
  >((maisRecente, leitura) => {
    if (
      !maisRecente ||
      new Date(leitura.createdAt).getTime() >
        new Date(maisRecente).getTime()
    ) {
      return leitura.createdAt;
    }

    return maisRecente;
  }, null);

  const temperatureColor =
    temperature !== null && temperature >= 90
      ? theme.colors.danger
      : theme.colors.warning;

  const vibrationColor =
    vibration !== null && vibration >= 50
      ? theme.colors.danger
      : theme.colors.primary;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <MachineSelector
        machines={machines}
        selected={machine}
        onSelect={setSelectedMachineId}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Monitoramento em Tempo Real
        </Text>

        <Text style={styles.sectionSubtitle}>
          Acompanhe as condições atuais dos sensores da máquina.
        </Text>

        {monitoramentoLoading ? (
          <View style={styles.loadingCard}>
            <ActivityIndicator
              size="large"
              color={theme.colors.primary}
            />
            <Text style={styles.message}>
              Carregando dados dos sensores...
            </Text>
          </View>
        ) : monitoramentoError ? (
          <View style={styles.messageContainer}>
            <Text style={styles.error}>
              {monitoramentoError}
            </Text>
          </View>
        ) : monitoramento ? (
          <View style={styles.sensorGrid}>
            <View style={styles.sensorCard}>
              <View style={styles.sensorHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${temperatureColor}18` },
                  ]}
                >
                  <Thermometer
                    size={19}
                    color={temperatureColor}
                  />
                </View>

                <Text style={styles.sensorLabel}>
                  Temperatura atual
                </Text>
              </View>

              <Text
                style={[
                  styles.sensorValue,
                  { color: temperatureColor },
                ]}
              >
                {temperature === null
                  ? "--"
                  : `${temperature.toFixed(2)} °C`}
              </Text>

              <Text style={styles.sensorLimit}>
                Limite de referência: 90 °C
              </Text>
            </View>

            <View style={styles.sensorCard}>
              <View style={styles.sensorHeader}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: `${vibrationColor}18` },
                  ]}
                >
                  <Activity
                    size={19}
                    color={vibrationColor}
                  />
                </View>

                <Text style={styles.sensorLabel}>
                  Vibração atual
                </Text>
              </View>

              <Text
                style={[
                  styles.sensorValue,
                  { color: vibrationColor },
                ]}
              >
                {vibration === null
                  ? "--"
                  : vibration.toFixed(2)}
              </Text>

              <Text style={styles.sensorLimit}>
                Limite de referência: 50
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.empty}>
            Nenhum dado de monitoramento disponível.
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Resumo do Monitoramento
        </Text>

        <Text style={styles.sectionSubtitle}>
          Visão geral dos conjuntos da máquina selecionada.
        </Text>

        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <Settings
                size={18}
                color={theme.colors.primary}
              />
              <Text style={styles.metricLabel}>
                Conjuntos monitorados
              </Text>
            </View>

            <Text style={styles.metricValue}>
              {monitoramentoLoading
                ? "--"
                : conjuntosMonitorados}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <View style={styles.metricHeader}>
              <AlertTriangle
                size={18}
                color={theme.colors.warning}
              />
              <Text style={styles.metricLabel}>
                Conjuntos com alertas
              </Text>
            </View>

            <Text style={styles.metricValue}>
              {alertsLoading ? "--" : conjuntosComAlertas}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.lastUpdate}>
        <Clock
          size={16}
          color={theme.colors.muted}
        />

        <Text style={styles.lastUpdateText}>
          Última leitura:{" "}
          {ultimaLeitura
            ? new Date(ultimaLeitura).toLocaleString("pt-BR")
            : "Sem leituras disponíveis"}
        </Text>
      </View>
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
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: 24,
    gap: 10,
  },
  section: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  sectionSubtitle: {
    fontSize: 13,
    color: "#B0B0B0",
    marginTop: 5,
    marginBottom: 16,
  },
  sensorGrid: {
    flexDirection: "row",
    gap: 12,
  },
  sensorCard: {
    flex: 1,
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
  sensorHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sensorLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#B0B0B0",
  },
  sensorValue: {
    fontSize: 23,
    fontWeight: "700",
  },
  sensorLimit: {
    fontSize: 11,
    color: "#B0B0B0",
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 12,
  },
  metricCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#5a5a5a",
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
  metricHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  metricLabel: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#B0B0B0",
  },
  metricValue: {
    fontSize: 21,
    fontWeight: "700",
    color: "#FFFFFF",
  },
  lastUpdate: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingVertical: 8,
  },
  lastUpdateText: {
    flex: 1,
    fontSize: 12,
    color: "#B0B0B0",
  },
  loadingCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 24,
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: "#5a5a5a",
  },
  messageContainer: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 18,
    borderWidth: 1,
    borderColor: "#5a5a5a",
  },
  error: {
    color: theme.colors.danger,
    textAlign: "center",
    fontSize: 13,
  },
  empty: {
    color: theme.colors.muted,
    textAlign: "center",
    padding: 20,
  },
  emptyTitle: {
    color: theme.colors.text,
    fontSize: 16,
    fontWeight: "800",
    textAlign: "center",
  },
  message: {
    fontSize: 13,
    color: theme.colors.muted,
    textAlign: "center",
  },
});
