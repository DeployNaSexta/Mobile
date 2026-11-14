
import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ChevronDown, Check } from "lucide-react-native";

import type { Machine } from "@/types";
import { theme } from "@/styles/theme";

interface MachineSelectorProps {
  machines: Machine[];
  selected: Machine;
  onSelect: (id: string | number) => void;
}

export default function MachineSelector({
  machines,
  selected,
  onSelect,
}: MachineSelectorProps) {
  const [open, setOpen] = useState(false);

  if (!selected) return null;

  return (
    <View style={styles.wrapper}>
      <Pressable
        style={({ pressed }) => [
          styles.selector,
          pressed && styles.pressed,
        ]}
        onPress={() => setOpen((previous) => !previous)}
      >
        <View style={[styles.statusDot, styles.active]} />

        <View style={styles.info}>
          <Text style={styles.label}>MÁQUINA SELECIONADA</Text>
          <Text style={styles.value}>{selected.nome}</Text>
        </View>

        <ChevronDown
          size={20}
          color={theme.colors.text}
          style={open ? styles.rotated : undefined}
        />
      </Pressable>

      {open && (
        <View style={styles.dropdown}>
          <Text style={styles.dropdownTitle}>
            Selecionar máquina
          </Text>

          {machines.map((machine) => {
            const isSelected =
              String(machine.id) === String(selected.id);

            return (
              <Pressable
                key={machine.id}
                style={({ pressed }) => [
                  styles.option,
                  isSelected && styles.selectedOption,
                  pressed && styles.pressed,
                ]}
                onPress={() => {
                  onSelect(machine.id);
                  setOpen(false);
                }}
              >
                <View style={[styles.statusDot, styles.active]} />

                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.selectedOptionText,
                  ]}
                >
                  {machine.nome}
                </Text>

                {isSelected && (
                  <Check
                    size={18}
                    color={theme.colors.primary}
                  />
                )}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 10,
    elevation: 5,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: theme.colors.surface,
    padding: 16,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  pressed: {
    opacity: 0.75,
  },
  statusDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  active: {
    backgroundColor: "#22C55E",
  },
  critical: {
    backgroundColor: "#EF4444",
  },
  info: {
    flex: 1,
    gap: 5,
  },
  label: {
    fontSize: 10,
    fontWeight: "800",
    color: theme.colors.muted,
    letterSpacing: 1,
  },
  value: {
    fontSize: 16,
    fontWeight: "700",
    color: theme.colors.text,
  },
  rotated: {
    transform: [{ rotate: "180deg" }],
  },
  dropdown: {
    marginTop: 8,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: "hidden",
  },
  dropdownTitle: {
    fontSize: 11,
    fontWeight: "800",
    color: theme.colors.muted,
    letterSpacing: 0.8,
    paddingHorizontal: 14,
    paddingTop: 14,
    paddingBottom: 8,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 14,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  selectedOption: {
    backgroundColor: theme.colors.surfaceSecondary,
  },
  optionText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: theme.colors.text,
  },
  selectedOptionText: {
    color: theme.colors.primary,
    fontWeight: "800",
  },
});
