
import { View, Text, StyleSheet, ScrollView,  } from "react-native";
import { useRouter } from "expo-router";
import { useMachines } from "@/hooks/useMachine";
import { useApp } from "@/components/contexts/AppContext";

import MachineCard from "@/components/machine/MachineCard";

export default function Machines() {
  const { machines, loading } = useMachines();
  const { selectedMachineId, setSelectedMachineId } = useApp();
  const router = useRouter();

  function handleMachinePress(machineId: string | number) {
    setSelectedMachineId(String(machineId));

    router.push("/Dashboard");
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Carregando máquinas...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View>
        <Text style={styles.title}>Máquinas</Text>
      </View>

      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.statusDot, styles.operando]} />
          <Text style={styles.legendText}>Normal</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.statusDot, styles.alerta]} />
          <Text style={styles.legendText}>Alerta</Text>
        </View>

        <View style={styles.legendItem}>
          <View style={[styles.statusDot, styles.critico]} />
          <Text style={styles.legendText}>Crítico</Text>
        </View>
      </View>

      <View style={styles.machineList}>
        {machines.map((machine) => (
          <MachineCard
            key={machine.id}
            machine={machine}
            selected={
              String(machine.id) === String(selectedMachineId)
            }
            onPress={() => handleMachinePress(machine.id)}
          />
        ))}

        {machines.length === 0 && (
          <Text style={styles.message}>
            Nenhuma máquina cadastrada.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F0F",
  },
  content: {
    padding: 16,
    gap: 20,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#F8F8F8",
    marginTop: 4,
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 16,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  statusDot: {
    width: 9,
    height: 9,
    borderRadius: 5,
  },
  operando: {
    backgroundColor: "#22C55E",
  },
  alerta: {
    backgroundColor: "#F59E0B",
  },
  critico: {
    backgroundColor: "#EF4444",
  },
  legendText: {
    fontSize: 12,
    color: "#64748B",
  },
  machineList: {
    gap: 12,
  },
  message: {
    fontSize: 14,
    color: "#64748B",
  },
});
