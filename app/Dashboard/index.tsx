import { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";

import { useMachines } from "@/hooks/useMachine";
import { useApp } from "@/components/contexts/AppContext";

import Gauge from "@/components/dashboard/Gauge";
import MachineSelector from "@/components/dashboard/MachineSelector";
import TileGrid from "@/components/dashboard/TileGrid";

import { theme } from "@/styles/theme";

export default function Dashboard() {
  const { machines, loading } = useMachines();
  const { selectedMachineId, setSelectedMachineId } = useApp();

  useEffect(() => {
    if (!selectedMachineId && machines.length > 0) {
      setSelectedMachineId(machines[0].id);
    }
  }, [machines, selectedMachineId, setSelectedMachineId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Carregando dashboard...</Text>
      </View>
    );
  }

  const machine =
    machines.find(
      (m) => String(m.id) === String(selectedMachineId)
    ) || machines[0];

  if (!machine) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyTitle}>Nenhuma máquina cadastrada</Text>
        <Text style={styles.message}>
          Cadastre uma máquina para visualizar os dados.
        </Text>
      </View>
    );
  }

  const temperaturePct = Math.min(machine.temperatura / 90, 1);
  const vibrationPct = Math.min(machine.vibracao / 50, 1);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>DIAGNÓSTICO EM TEMPO REAL</Text>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subtitle}>
          Acompanhe o desempenho e as condições dos sensores.
        </Text>
      </View>

      <MachineSelector
        machines={machines}
        selected={machine}
        onSelect={setSelectedMachineId}
      />

      <View style={styles.cardBox}>
        <Text style={styles.kicker}>SENSORES ATIVOS</Text>

        <View style={styles.gaugeRow}>
          <Gauge
            value={`${machine.temperatura}°C`}
            label="Temperatura"
            pct={temperaturePct}
          />

          <Gauge
            value={machine.vibracao}
            label="Vibração"
            pct={vibrationPct}
          />
        </View>

        <Text style={styles.sensorInfo}>
          Limites de referência: 90°C para temperatura e 50 para vibração.
        </Text>
      </View>

      <TileGrid machine={machine} />

      <View style={styles.cardBox}>
        <View style={styles.chartWrap}>
          <View style={styles.chartLimit}>
            <View>
              <Text style={styles.chartLabel}>TEMPERATURA</Text>
              <Text style={styles.chartTitle}>Leitura atual</Text>
            </View>

            <Text style={styles.limitValue}>
              {machine.temperatura}°C
            </Text>
          </View>

          <View style={styles.chartPlaceholder}>
            <Text style={styles.chartPlaceholderText}>
              Histórico de temperatura indisponível
            </Text>
            <Text style={styles.chartDescription}>
              O backend ainda não disponibiliza uma série histórica de leituras.
            </Text>
          </View>
        </View>
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
    padding: 16,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 18,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: 24,
    gap: 8,
  },
  header: {
    gap: 6,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    color: theme.colors.primary,
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.colors.muted,
  },
  cardBox: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 16,
  },
  kicker: {
    fontSize: 11,
    fontWeight: "800",
    color: theme.colors.muted,
    letterSpacing: 1,
  },
  gaugeRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    gap: 8,
  },
  sensorInfo: {
    fontSize: 11,
    color: theme.colors.mutedSecondary,
    lineHeight: 16,
  },
  chartWrap: {
    gap: 16,
  },
  chartLimit: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 8,
  },
  chartLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: theme.colors.muted,
    letterSpacing: 0.8,
  },
  chartTitle: {
    fontSize: 13,
    color: theme.colors.text,
    fontWeight: "700",
    marginTop: 4,
  },
  limitValue: {
    color: theme.colors.primary,
    fontSize: 20,
    fontWeight: "900",
  },
  chartPlaceholder: {
    minHeight: 110,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: theme.radius.small,
    borderWidth: 1,
    borderColor: theme.colors.border,
    padding: 16,
    gap: 6,
  },
  chartPlaceholderText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "700",
    textAlign: "center",
  },
  chartDescription: {
    color: theme.colors.muted,
    fontSize: 11,
    textAlign: "center",
    lineHeight: 16,
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
