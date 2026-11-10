import { View, Text, StyleSheet } from "react-native";

interface Bar {
  day: string;
  pct: number;
}

interface ReportBarsProps {
  bars: Bar[];
}

export default function ReportBars({ bars }: ReportBarsProps) {
  return (
    <View style={styles.container}>
      {bars.map((bar) => (
        <View key={bar.day} style={styles.column}>
          <View style={styles.barContainer}>
            <View
              style={[
                styles.bar,
                { height: `${Math.min(Math.max(bar.pct, 0), 100)}%` },
              ]}
            />
          </View>

          <Text style={styles.label}>{bar.day}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 150,
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-around",
    gap: 8,
  },
  column: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "flex-end",
  },
  barContainer: {
    width: "100%",
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  bar: {
    width: "65%",
    minHeight: 3,
    backgroundColor: "#2563EB",
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  label: {
    marginTop: 8,
    fontSize: 11,
    color: "#64748B",
  },
});