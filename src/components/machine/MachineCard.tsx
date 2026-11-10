import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import {
  Cog,
  Thermometer,
  Activity,
  Clock,
} from "lucide-react-native";

import { useApp } from "@/components/contexts/AppContext";
import { formatUpdated } from "@/components/utils/format";

interface Machine {
  id: string | number;
  name: string;
  model: string;
  status: "operando" | "alerta" | "critico";
  temp: number;
  vib: number;
  updatedAt: string;
}

interface MachineCardProps {
  machine: Machine;
  selected: boolean;
}

const STATUS_LABEL = {
  operando: "Operando",
  alerta: "Alerta",
  critico: "Crítico",
};

const STATUS_COLORS = {
  operando: {
    background: "#DCFCE7",
    text: "#15803D",
  },
  alerta: {
    background: "#FEF3C7",
    text: "#B45309",
  },
  critico: {
    background: "#FEE2E2",
    text: "#B91C1C",
  },
};

export default function MachineCard({
  machine,
  selected,
}: MachineCardProps) {
  const router = useRouter();
  const { setSelectedMachineId } = useApp();

  function open() {
    setSelectedMachineId(machine.id);
    router.push("/dashboard");
  }

  const statusColor = STATUS_COLORS[machine.status];

  return (
    <Pressable
      onPress={open}
      style={({ pressed }) => [
        styles.container,
        selected && styles.selected,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.head}>
        <View style={styles.machineIcon}>
          <Cog size={22} color="#64748B" />
        </View>

        <View style={styles.info}>
          <Text style={styles.name}>{machine.name}</Text>
          <Text style={styles.model}>{machine.model}</Text>
        </View>

        <View
          style={[
            styles.badge,
            { backgroundColor: statusColor.background },
          ]}
        >
          <Text style={{ color: statusColor.text, fontSize: 11, fontWeight: "600" }}>
            {STATUS_LABEL[machine.status]}
          </Text>
        </View>
      </View>

      <View style={styles.specs}>
        <View style={styles.spec}>
          <Thermometer size={14} color="#64748B" />
          <Text style={styles.specText}>{machine.temp}°C</Text>
        </View>

        <View style={styles.spec}>
          <Activity size={14} color="#64748B" />
          <Text style={styles.specText}>{machine.vib} mm/s</Text>
        </View>

        <View style={styles.spec}>
          <Clock size={14} color="#64748B" />
          <Text style={styles.specText}>
            {formatUpdated(machine.updatedAt)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 16,
  },
  selected: {
    borderColor: "#2563EB",
    borderWidth: 2,
  },
  pressed: {
    opacity: 0.7,
  },
  head: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  machineIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  model: {
    fontSize: 12,
    color: "#64748B",
  },
  badge: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  specs: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  spec: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  specText: {
    fontSize: 11,
    color: "#64748B",
  },
});