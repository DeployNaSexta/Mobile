
import { View, Text, StyleSheet } from "react-native";
import { theme } from "@/styles/theme"
interface Bar {
  label: string;
  value: number;
}

interface ReportBarsProps {
  bars: Bar[];
  unit: string;
  color?: string;
  maxValue?: number;
}

export default function ReportBars({
  bars,
  unit,
  color = "#2563EB",
  maxValue,
}: ReportBarsProps) {
  const maiorValor = Math.max(
    maxValue ?? 0,
    ...bars.map((bar) => bar.value),
    1
  );

  if (bars.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>
          Nenhum dado disponível para este período.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {bars.map((bar, index) => {
        const altura = Math.max(
          (Math.max(bar.value, 0) / maiorValor) * 100,
          3
        );

        return (
          <View
            key={`${bar.label}-${index}`}
            style={styles.column}
          >
            <Text style={styles.value}>
              {bar.value.toFixed(1)}
            </Text>

            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${altura}%`,
                    backgroundColor: color,
                  },
                ]}
              />
            </View>

            <Text style={styles.label} numberOfLines={1}>
              {bar.label}
            </Text>
          </View>
        );
      })}

      <Text style={styles.unit}>{unit}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 175,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    gap: 8,
    paddingTop: 22,
    position: "relative",
  },
  column: {
    flex: 1,
    height: 150,
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 7,
  },
  value: {
    fontSize: 10,
    fontWeight: "600",
    color: "#CBD5E1",
  },
  barContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 6,
    overflow: "hidden",
  },
  bar: {
    width: "65%",
    minHeight: 3,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  label: {
    fontSize: 10,
    color: "#94A3B8",
    fontWeight: "500",
  },
  unit: {
    position: "absolute",
    top: 0,
    right: 0,
    fontSize: 10,
    color: "#64748B",
  },
  emptyContainer: {
    height: 150,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
});
