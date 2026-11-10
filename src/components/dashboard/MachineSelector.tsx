import { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { ChevronDown } from "lucide-react-native";
import type { Machine } from "@/types";

interface MachineSelectorProps {
  machines: Machine[];
  selected: Machine;
  onSelect: (id: number) => void;
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
        style={styles.selector}
        onPress={() => setOpen((previous) => !previous)}
      >
        <View
          style={[
            styles.statusDot,
            selected.status === "critico"
              ? styles.critical
              : styles.active,
          ]}
        />

        <View style={styles.info}>
          <Text style={styles.label}>Máquina Selecionada</Text>
          <Text style={styles.value}>{selected.nome}</Text>
        </View>

        <ChevronDown
          size={20}
          color="#64748B"
          style={open ? styles.rotated : undefined}
        />
      </Pressable>

      {open && (
        <View style={styles.dropdown}>
          {machines.map((machine) => (
            <Pressable
              key={machine.id}
              style={styles.option}
              onPress={() => {
                onSelect(machine.id);
                setOpen(false);
              }}
            >
              <View
                style={[
                  styles.statusDot,
                  machine.status === "critico"
                    ? styles.critical
                    : styles.active,
                ]}
              />

              <Text style={styles.optionText}>
                {machine.nome}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 10,
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  statusDot: {
    width: 9,
    height: 9,
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
    gap: 3,
  },
  label: {
    fontSize: 11,
    color: "#64748B",
  },
  value: {
    fontSize: 15,
    fontWeight: "600",
    color: "#0F172A",
  },
  rotated: {
    transform: [{ rotate: "180deg" }],
  },
  dropdown: {
    marginTop: 5,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    overflow: "hidden",
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  optionText: {
    fontSize: 14,
    color: "#334155",
  },
});