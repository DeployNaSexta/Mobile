import { View, Text, StyleSheet } from "react-native";
import {
  Thermometer,
  Activity,
  MoveHorizontal,
  MoveVertical,
  Waves,
} from "lucide-react-native";

import type { Machine } from "@/types";
import { theme } from "@/styles/theme";

interface TileGridProps {
  machine: Machine;
}

export default function TileGrid({ machine }: TileGridProps) {
  const tiles = [
    {
      label: "Temperatura",
      value: `${machine.temperatura}°C`,
      icon: Thermometer,
      color: theme.colors.warning,
    },
    {
      label: "Vibração geral",
      value: String(machine.vibracao),
      icon: Activity,
      color: theme.colors.primary,
    },
    {
      label: "Vibração eixo X",
      value: String(machine.vibracaoX),
      icon: MoveHorizontal,
      color: theme.colors.info,
    },
    {
      label: "Vibração eixo Y",
      value: String(machine.vibracaoY),
      icon: MoveVertical,
      color: theme.colors.primary,
    },
    {
      label: "Vibração eixo Z",
      value: String(machine.vibracaoZ),
      icon: Waves,
      color: theme.colors.warning,
    },
  ];

  return (
    <View style={styles.grid}>
      {tiles.map((tile) => {
        const Icon = tile.icon;

        return (
          <View key={tile.label} style={styles.tile}>
            <View style={styles.top}>
              <View
                style={[
                  styles.iconContainer,
                  { backgroundColor: `${tile.color}18` },
                ]}
              >
                <Icon size={16} color={tile.color} />
              </View>

              <Text style={styles.label}>{tile.label}</Text>
            </View>

            <Text style={styles.value}>{tile.value}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  tile: {
    width: "47%",
    flexGrow: 1,
    backgroundColor: theme.colors.surface,
    padding: 14,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    borderColor: theme.colors.border,
    gap: 12,
  },
  top: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  label: {
    flex: 1,
    fontSize: 12,
    color: theme.colors.muted,
    fontWeight: "600",
  },
  value: {
    fontSize: 21,
    fontWeight: "900",
    color: theme.colors.text,
  },
});