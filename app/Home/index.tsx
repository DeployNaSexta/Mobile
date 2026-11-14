
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Pressable,
  ActivityIndicator,
} from "react-native";

import { useAlerts } from "@/hooks/useAlerts";
import { useMonitoramentoLocal } from "@/hooks/useMonitorLocal";
import type { Leitura } from "@/types";
import { theme } from "@/styles/theme";
import { AlertTriangle } from "lucide-react-native";

const MAQUINA_LOCAL = "Colheitadeira-01";

type NivelStatus = "Normal" | "Atenção" | "Crítico";

export default function Home() {

  const { alerts, loading: alertsLoading } = useAlerts();

  const {
    monitoramento,
    loading: monitoramentoLoading,
    error,
    refresh,
  } = useMonitoramentoLocal();

  const conjuntosMonitorados = monitoramento?.conjuntos.length ?? 0;

  const conjuntosComAlertas = new Set(
    alerts
      .filter(
        (alerta) =>
          alerta.maquina === MAQUINA_LOCAL &&
          (alerta.nivel === "critico" ||
            alerta.nivel === "atencao" ||
            alerta.nivel === "alerta")
      )
      .map((alerta) => alerta.conjunto)
  ).size;

  function obterStatus(conjunto: string): NivelStatus {
    const alertasConjunto = alerts.filter(
      (alerta) =>
        alerta.maquina === MAQUINA_LOCAL &&
        alerta.conjunto === conjunto
    );

    if (alertasConjunto.some((alerta) => alerta.nivel === "critico")) {
      return "Crítico";
    }

    if (
      alertasConjunto.some(
        (alerta) =>
          alerta.nivel === "atencao" || alerta.nivel === "alerta"
      )
    ) {
      return "Atenção";
    }

    return "Normal";
  }

  function obterEstiloStatus(status: NivelStatus) {
    switch (status) {
      case "Crítico":
        return styles.statusCritical;
      case "Atenção":
        return styles.statusWarning;
      default:
        return styles.statusNormal;
    }
  }

  function obterCorStatus(status: NivelStatus) {
    switch (status) {
      case "Crítico":
        return "#F87171";
      case "Atenção":
        return "#FBBF24";
      default:
        return "#4ADE80";
    }
  }
  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      {/* Médias da máquina local */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Monitoramento em Tempo Real</Text>
        <Text style={styles.sectionSubtitle}>
          Acompanhe as condições atuais dos sensores da máquina.
        </Text>

        {monitoramentoLoading ? (
          <ActivityIndicator
            size="large"
            color={theme.colors.primary}
            style={styles.loader}
          />
        ) : error ? (
          <View style={styles.messageContainer}>
            <Text style={styles.error}>{error}</Text>

            <Pressable onPress={refresh}>
              <Text style={styles.link}>Tentar novamente</Text>
            </Pressable>
          </View>
        ) : monitoramento ? (
          <View style={styles.metricsGrid}>
            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Conjuntos monitorados</Text>
              <Text style={styles.metricValue}>
                {conjuntosMonitorados}
              </Text>
            </View>

            <View style={styles.metricCard}>
              <Text style={styles.metricLabel}>Conjuntos com alertas</Text>
              <Text style={styles.metricValue}>
                {conjuntosComAlertas}
              </Text>
            </View>
          </View>
        ) : (
          <Text style={styles.empty}>
            Nenhum dado de monitoramento disponível.
          </Text>
        )}
      </View>

      {/* Conjuntos monitorados */}
      <View style={styles.section}>
        <View style={styles.sectionHead}>
          <Text style={styles.sectionTitle}>Conjuntos Monitorados</Text>

          <Text style={styles.count}>
            {monitoramento?.totalConjuntos ?? 0} conjuntos
          </Text>
        </View>

        {monitoramentoLoading || alertsLoading ? (
          <ActivityIndicator
            size="small"
            color={theme.colors.primary}
          />
        ) : monitoramento?.conjuntos.length ? (
          <View style={styles.conjuntoList}>
            {monitoramento.conjuntos.map((conjunto: Leitura) => {
              const status = obterStatus(conjunto.conjunto);

              return (
                <View
                  key={conjunto.id}
                  style={styles.conjuntoCard}
                >
                  {/* Nome e status */}
                  <View style={styles.conjuntoHeader}>
                    <Text style={styles.conjuntoName}>
                      {conjunto.conjunto}
                    </Text>

                    <View
                      style={[
                        styles.statusBadge,
                        obterEstiloStatus(status),
                      ]}
                    >
                      {status !== "Normal" && (
                        <AlertTriangle
                          size={12}
                          color={
                            status === "Crítico"
                              ? "#F87171"
                              : "#FBBF24"
                          }
                        />
                      )}

                      <Text
                        style={[
                          styles.statusText,
                          obterEstiloStatus(status),
                        ]}
                      >
                        {status}
                      </Text>
                    </View>
                  </View>

                  {/* Indicadores */}
                  <View style={styles.conjuntoMetrics}>
                    <View style={styles.metric}>
                      <Text style={styles.metricLabel}>
                        Temperatura
                      </Text>

                      <Text
                        style={[
                          styles.conjuntoValue,
                          { color: obterCorStatus(status) },
                        ]}
                      >
                        {conjunto.temperatura.toFixed(1)} °C
                      </Text>
                    </View>

                    <View style={styles.metricDivider} />

                    <View style={styles.metric}>
                      <Text style={styles.metricLabel}>
                        Vibração
                      </Text>

                      <Text
                        style={[
                          styles.conjuntoValue,
                          { color: obterCorStatus(status) },
                        ]}
                      >
                        {conjunto.vibracao.toFixed(1)}
                      </Text>
                    </View>
                  </View>
                </View>
              );
            })}
          </View>
        ) : (
          !error && (
            <Text style={styles.empty}>
              Nenhum conjunto possui leituras disponíveis.
            </Text>
          )
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 20,
    paddingTop: 24,
    paddingBottom: 32,
  },
  section: {
    marginTop: 0,
    marginBottom: 12
  },
  sectionHead: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: theme.colors.text,
  },
  loader: {
    padding: 24,
  },
  metricsGrid: {
    flexDirection: "row",
    gap: 12,
    marginTop: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    gap: 10,

    borderWidth: 1,
    borderColor: "#979797",

    shadowColor: "#ffffff",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  metricLabel: {
    fontSize: 14,
    color: "#B0B0B0",
  },
  count: {
    color: "#B0B0B0",
    fontSize: 13,
  },
  metricValue: {
    fontSize: 21,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  messageContainer: {
    alignItems: "center",
    padding: 20,
    gap: 12,
  },
  error: {
    color: theme.colors.danger,
    textAlign: "center",
  },
  link: {
    color: theme.colors.primary,
    fontWeight: "600",
  },
  conjuntoList: {
    gap: 10,
    marginTop: 16,
    backgroundColor: "transparent",
  },
  conjuntoCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: "#5a5a5a",
    gap: 14,

    shadowColor: "#ffffff",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    elevation: 4,
  },
  conjuntoHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  conjuntoName: {
    fontSize: 19,
    fontWeight: "700",
    color: theme.colors.text,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 20,
  },
  statusNormal: {
    backgroundColor: "#123524",
    color: "#4ADE80",
  },
  statusWarning: {
    backgroundColor: "#422B12",
    color: "#FBBF24",
  },
  statusCritical: {
    backgroundColor: "#451A1A",
    color: "#F87171",
  },
  statusText: {
    fontSize: 11,
    fontWeight: "700",
  },
  conjuntoMetrics: {
    flexDirection: "row",
    alignItems: "center",
  },
  metric: {
    flex: 1,
    gap: 5,
  },
  conjuntoValue: {
    fontSize: 15,
    fontWeight: "700",
    color: theme.colors.text,
  },
  metricDivider: {
    width: 1,
    height: 30,
    backgroundColor: "#303030",
    marginHorizontal: 12,
  },
  empty: {
    color: theme.colors.muted,
    textAlign: "center",
    padding: 20,
  },
  sectionSubtitle: {
  fontSize: 13,
  color: "#B0B0B0",
  marginTop: 5,
},
});
