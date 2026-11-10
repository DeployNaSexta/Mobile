import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";

interface GaugeProps {
  value: string | number;
  label: string;
  pct: number;
}

export default function Gauge({ value, label, pct }: GaugeProps) {
  const r = 32;
  const c = 2 * Math.PI * r;

  const percentage = Math.min(Math.max(pct, 0), 1);
  const off = c * (1 - percentage);

  return (
    <View style={styles.container}>
      <View style={styles.ring}>
        <Svg width={80} height={80} viewBox="0 0 80 80">
          {/* Círculo de fundo */}
          <Circle
            cx={40}
            cy={40}
            r={r}
            stroke="#E2E8F0"
            strokeWidth={6}
            fill="none"
          />

          {/* Círculo de progresso */}
          <Circle
            cx={40}
            cy={40}
            r={r}
            stroke="#2563EB"
            strokeWidth={6}
            fill="none"
            strokeDasharray={`${c} ${c}`}
            strokeDashoffset={off}
            strokeLinecap="round"
            rotation={-90}
            origin="40, 40"
          />
        </Svg>

        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
        </View>
      </View>

      <Text style={styles.label}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    gap: 8,
  },
  ring: {
    width: 80,
    height: 80,
    justifyContent: "center",
    alignItems: "center",
  },
  valueContainer: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#0F172A",
  },
  label: {
    fontSize: 12,
    color: "#64748B",
    textAlign: "center",
  },
});