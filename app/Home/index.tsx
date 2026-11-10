import { View, Text, ScrollView, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";

import { useMachines } from "@/hooks/useMachine";
import { useAlerts } from "@/hooks/useAlerts";

import StatCard from "@/components/shared/StatCard";
import MachineListItem from "@/components/machine/MachineListItem";
import { theme } from "@/styles/theme";

export default function Home() {
  const router = useRouter();

  const { machines, loading: machinesLoading } = useMachines();
  const { alerts, loading: alertsLoading } = useAlerts();

  const ativas = machines.filter(
    (machine) => machine.status === "Normal"
  ).length;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Visão Geral da Fazenda</Text>
      </View>

      <View style={styles.statGrid}>
        <StatCard
          onPress={() => router.push("/maquinas")}
          icon="machine"
          value={machinesLoading ? "..." : `${ativas}/${machines.length}`}
          label="Máquinas Ativas"
        />

        <StatCard
          onPress={() => router.push("/alertas")}
          icon="warning"
          iconColor="#E5A000"
          value={alertsLoading ? "..." : alerts.length}
          label="Alertas"
        />
      </View>

      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>Suas Máquinas</Text>

        <Pressable onPress={() => router.push("/maquinas")}>
          <Text style={styles.link}>Ver todas</Text>
        </Pressable>
      </View>

      <View style={styles.machineList}>
        {machines.map((machine) => (
          <MachineListItem key={machine.id} machine={machine} />
        ))}

        {!machinesLoading && machines.length === 0 && (
          <Text style={styles.empty}>
            Nenhuma máquina encontrada.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: 20,
  },
  header: {
    marginTop: 20,
    marginBottom: 24,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#0F172A",
  },
  statGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 32,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: "bold",
    color: "#0F172A",
  },
  link: {
    color: "#2563EB",
    fontSize: 14,
    fontWeight: "600",
  },
  machineList: {
    gap: 12,
    paddingBottom: 30,
  },
  empty: {
    color: "#64748B",
    textAlign: "center",
    padding: 20,
  },
});