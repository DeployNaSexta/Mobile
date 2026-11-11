
import { Pressable, View, Text, StyleSheet } from "react-native";
import {
  Cog,
  AlertTriangle,
  ChevronRight,
} from "lucide-react-native";

import { theme } from "@/styles/theme";

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
      accessibilityRole="button"
    >
      <View style={styles.topRow}>
        <Icon
          size={22}
          color={iconColor ?? theme.colors.muted}
          strokeWidth={2}
        />

        <ChevronRight
          size={18}
          color={theme.colors.mutedSecondary}
        />
      </View>

      <Text style={styles.value}>{value}</Text>

      <Text style={styles.label} numberOfLines={2}>
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minWidth: 0,
    backgroundColor: theme.colors.surface,
    padding: theme.spacing.md,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: theme.spacing.sm,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  value: {
    fontSize: 26,
    fontWeight: "900",
    color: theme.colors.text,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: theme.colors.muted,
  },
});
