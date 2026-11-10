import { Pressable, View, Text, StyleSheet } from "react-native";
import { theme } from "@/styles/theme";

import {
  Cog,
  AlertTriangle,
  ChevronRight,
} from "lucide-react-native";

interface StatCardProps {
  onPress: () => void;
  icon: "machine" | "warning";
  iconColor?: string;
  value: string | number;
  label: string;
}

const icons = {
  machine: Cog,
  warning: AlertTriangle,
};

export default function StatCard({
  onPress,
  icon,
  iconColor,
  value,
  label,
}: StatCardProps) {
  const Icon = icons[icon];

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
    >
      <View style={styles.topRow}>
        <Icon size={22} color={iconColor ?? "#64748B"} />
        <ChevronRight size={18} color="#94A3B8" />
      </View>

      <Text style={styles.value}>{value}</Text>
      <Text style={styles.label}>{label}</Text>
    </Pressable>
  );
}


const styles = StyleSheet.create({
  container: {
    width: "48%",
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 8,
  },
  pressed: {
    opacity: 0.7,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  value: {
    fontSize: 25,
    fontWeight: "900",
    color: theme.colors.text,
  },
  label: {
    fontSize: 13,
    color: theme.colors.muted,
  },
});
