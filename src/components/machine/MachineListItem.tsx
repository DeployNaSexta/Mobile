import { Pressable, View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import { Cog } from "lucide-react-native";
import { theme } from "@/styles/theme";
import { useApp } from "@/components/contexts/AppContext";
import type { Machine } from "@/types";

interface MachineListItemProps {
  machine: Machine;
}

export default function MachineListItem({
  machine,
}: MachineListItemProps) {
  const router = useRouter();
  const { setSelectedMachineId } = useApp();

  function open() {
    setSelectedMachineId(String(machine.id));
    router.push("/dashboard");
  }

  return (
    <Pressable
      onPress={open}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.machineIcon}>
        <Cog size={22} color="#64748B" />
      </View>

      <View style={styles.machineInfo}>
        <View style={styles.row}>
          <View
            style={[
              styles.statusDot,
              machine.status === "Alerta"
                ? styles.critical
                : styles.active,
            ]}
          />

          <Text style={styles.name}>{machine.nome}</Text>
        </View>

        <Text style={styles.details}>
          Temperatura: {machine.temperatura}
        </Text>

        <Text style={styles.details}>
          Vibração: {machine.vibracao}
        </Text>
      </View>

      <View style={styles.machineSide}>
        <Text
          style={[
            styles.status,
            machine.status === "Alerta"
              ? styles.statusCritical
              : styles.statusNormal,
          ]}
        >
          {machine.status}
        </Text>
      </View>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    padding: 14,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 12,
  },
  pressed: {
    opacity: 0.7,
  },
  machineIcon: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.small,
    backgroundColor: "rgba(93, 214, 44, 0.1)",
    borderWidth: 1,
    borderColor: "rgba(93, 214, 44, 0.25)",
    justifyContent: "center",
    alignItems: "center",
  },
  machineInfo: {
    flex: 1,
    gap: 5,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  active: {
    backgroundColor: theme.colors.primary,
  },
  critical: {
    backgroundColor: theme.colors.danger,
  },
  name: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.colors.text,
  },
  details: {
    fontSize: 13,
    color: theme.colors.muted,
  },
  machineSide: {
    justifyContent: "center",
  },
  status: {
    fontSize: 12,
    fontWeight: "800",
  },
  statusCritical: {
    color: theme.colors.danger,
  },
  statusNormal: {
    color: theme.colors.primary,
  },
});
