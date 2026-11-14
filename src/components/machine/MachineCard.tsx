
import { View, Text, Pressable, StyleSheet } from "react-native";
import { theme } from "@/styles/theme";
import {
  Cog,
  Thermometer,
  Activity,
  Clock,
} from "lucide-react-native";

import { formatUpdated } from "@/components/utils/format";

interface Machine {
  id: string | number;
  nome: string;
  temperatura: number;
  vibracao: number;
  status: "Alerta" | "Normal";
  createdAt: string;
}

interface MachineCardProps {
  machine: Machine;
  selected: boolean;
  onPress: () => void;
}

export default function MachineCard({
  machine,
  selected,
  onPress,
}: MachineCardProps) {
  const isAlert = machine.status === "Alerta";

  const statusColor = isAlert
    ? { background: "#FEE2E2", text: "#B91C1C" }
    : { background: "#DCFCE7", text: "#15803D" };

  return (
    <Pressable
      onPress={onPress}
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
          <Text style={styles.name}>{machine.nome}</Text>
          <Text style={styles.model}>Máquina monitorada</Text>
        </View>

        <View
          style={[
            styles.badge,
            { backgroundColor: statusColor.background },
          ]}
        >
          <Text
            style={{
              color: statusColor.text,
              fontSize: 11,
              fontWeight: "600",
            }}
          >
            {isAlert ? "Alerta" : "Operando"}
          </Text>
        </View>
      </View>

      <View style={styles.specs}>
        <View style={styles.spec}>
          <Thermometer size={14} color="#64748B" />
          <Text style={styles.specText}>
            {machine.temperatura}°C
          </Text>
        </View>

        <View style={styles.spec}>
          <Activity size={14} color="#64748B" />
          <Text style={styles.specText}>
            {machine.vibracao} mm/s
          </Text>
        </View>

        <View style={styles.spec}>
          <Clock size={14} color="#64748B" />
          <Text style={styles.specText}>
            {formatUpdated(machine.createdAt)}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 16,
  },
  selected: {
    borderColor: theme.colors.primary,
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
    backgroundColor: theme.colors.background,
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
    color: theme.colors.text,
  },
  model: {
    fontSize: 12,
    color: theme.colors.muted,
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
    color: theme.colors.muted,
  },
});
