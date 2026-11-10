import { useState } from "react";
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
} from "react-native";
import { FileText } from "lucide-react-native";

import { useReport } from "@/hooks/useReport";
import ReportBars from "@/components/reports/ReportBars";

type Periodo = "diario" | "mensal" | "anual";

const TABS: { key: Periodo; label: string }[] = [
  { key: "diario", label: "Diário" },
  { key: "mensal", label: "Mensal" },
  { key: "anual", label: "Anual" },
];

export default function Reports() {
  const [periodo, setPeriodo] = useState<Periodo>("diario");

  const { report, loading } = useReport(periodo);

  if (loading || !report) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Carregando...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
    >
      <View>
        <Text style={styles.eyebrow}>Histórico e Análise</Text>
        <Text style={styles.title}>Relatórios</Text>
      </View>

      {/* Abas de período */}
      <View style={styles.tabs}>
        {TABS.map((tab) => {
          const active = periodo === tab.key;

          return (
            <Pressable
              key={tab.key}
              onPress={() => setPeriodo(tab.key)}
              style={[
                styles.tab,
                active && styles.activeTab,
              ]}
            >
              <Text
                style={[
                  styles.tabText,
                  active && styles.activeTabText,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Indicadores */}
      <View style={styles.statRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {report.stats.eficiencia}
          </Text>
          <Text style={styles.statLabel}>Eficiência</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {report.stats.horas}
          </Text>
          <Text style={styles.statLabel}>Horas Op.</Text>
        </View>

        <View style={styles.statBox}>
          <Text style={styles.statValue}>
            {report.stats.alertas}
          </Text>
          <Text style={styles.statLabel}>Alertas</Text>
        </View>
      </View>

      {/* Gráfico */}
      <View style={styles.cardBox}>
        <Text style={styles.kicker}>
          EFICIÊNCIA OPERACIONAL
        </Text>

        <Text style={styles.chartLabel}>
          {report.chartLabel}
        </Text>

        {report.bars.length > 0 ? (
          <ReportBars bars={report.bars} />
        ) : (
          <Text style={styles.emptyText}>
            Ainda sem histórico suficiente para o gráfico.
          </Text>
        )}
      </View>

      {/* Relatórios gerados */}
      <View style={styles.sectionHead}>
        <Text style={styles.sectionTitle}>
          Relatórios Gerados
        </Text>
      </View>

      {report.items.length === 0 && (
        <Text style={styles.emptyText}>
          Nenhum relatório gerado ainda.
        </Text>
      )}

      <View style={styles.reportList}>
        {report.items.map((item, index) => (
          <View style={styles.reportItem} key={index}>
            <View style={styles.reportIcon}>
              <FileText size={19} color="#64748B" />
            </View>

            <View style={styles.reportInfo}>
              <Text style={styles.reportTitle}>
                {item.title}
              </Text>

              <Text style={styles.reportSubtitle}>
                {item.subtitle}
              </Text>
            </View>

            <Text
              style={[
                styles.reportWhen,
                item.today && styles.today,
              ]}
            >
              {item.when}
            </Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 16,
    gap: 18,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#F8FAFC",
  },
  message: {
    fontSize: 14,
    color: "#64748B",
  },
  eyebrow: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748B",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#0F172A",
    marginTop: 4,
  },
  tabs: {
    flexDirection: "row",
    backgroundColor: "#E2E8F0",
    borderRadius: 10,
    padding: 4,
    gap: 4,
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 10,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: "#FFFFFF",
  },
  tabText: {
    fontSize: 13,
    fontWeight: "500",
    color: "#64748B",
  },
  activeTabText: {
    color: "#0F172A",
    fontWeight: "700",
  },
  statRow: {
    flexDirection: "row",
    gap: 10,
  },
  statBox: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    alignItems: "center",
    gap: 6,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#0F172A",
  },
  statLabel: {
    fontSize: 11,
    color: "#64748B",
  },
  cardBox: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 14,
  },
  kicker: {
    fontSize: 11,
    fontWeight: "700",
    color: "#64748B",
    letterSpacing: 0.8,
  },
  chartLabel: {
    fontSize: 13,
    fontWeight: "800",
    color: "#0F172A",
  },
  emptyText: {
    fontSize: 13,
    color: "#94A3B8",
  },
  sectionHead: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0F172A",
  },
  reportList: {
    gap: 10,
  },
  reportItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    gap: 10,
  },
  reportIcon: {
    width: 38,
    height: 38,
    borderRadius: 9,
    backgroundColor: "#F1F5F9",
    alignItems: "center",
    justifyContent: "center",
  },
  reportInfo: {
    flex: 1,
    gap: 4,
  },
  reportTitle: {
    fontSize: 13,
    fontWeight: "600",
    color: "#0F172A",
  },
  reportSubtitle: {
    fontSize: 11,
    color: "#64748B",
  },
  reportWhen: {
    fontSize: 11,
    color: "#94A3B8",
  },
  today: {
    color: "#2563EB",
    fontWeight: "700",
  },
});