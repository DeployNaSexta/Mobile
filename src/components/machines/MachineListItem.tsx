
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import Icon from "@/components/icons/Icon";
import { useApp } from "@/components/contexts/AppContext";
import { formatUpdated } from "@/utils/format";
import { theme } from "@/styles/theme";

interface MachineListItemProps {
  machine: {
    id: string | number;
    name: string;
    model: string;
    updatedAt?: Date | string | null;
  };
}

export default function MachineListItem({
  machine,
}: MachineListItemProps) {
  const router = useRouter();
  const { setSelectedMachineId } = useApp();

  function open() {
    setSelectedMachineId(machine.id);
    router.push("/dashboard");
  }

  return (
    <Pressable
      style={({ pressed }) => [
        styles.container,
        pressed && styles.pressed,
      ]}
      onPress={open}
      accessibilityRole="button"
    >
      <View style={styles.iconContainer}>
        <Icon
          name="machine"
          size={22}
          color={theme.colors.primary}
        />
      </View>

      <View style={styles.info}>
        <Text style={styles.name} numberOfLines={1}>
          {machine.name}
        </Text>

        <Text style={styles.model} numberOfLines={1}>
          {machine.model}
        </Text>
      </View>

      <View style={styles.side}>
        <Text style={styles.updated} numberOfLines={1}>
          {formatUpdated(machine.updatedAt)}
        </Text>

        <Icon
          name="chevron"
          size={18}
          color={theme.colors.mutedSecondary}
        />
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    padding: theme.spacing.md,
    gap: theme.spacing.md,
  },
  pressed: {
    opacity: 0.7,
    backgroundColor: theme.colors.surfaceSecondary,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: theme.radius.small,
    backgroundColor: theme.colors.surfaceSecondary,
    alignItems: "center",
    justifyContent: "center",
  },
  info: {
    flex: 1,
    gap: 5,
  },
  name: {
    color: theme.colors.text,
    fontSize: 15,
    fontWeight: "700",
  },
  model: {
    color: theme.colors.muted,
    fontSize: 12,
  },
  side: {
    alignItems: "flex-end",
    justifyContent: "center",
    gap: 6,
  },
  updated: {
    color: theme.colors.mutedSecondary,
    fontSize: 10,
  },
});
