import { View, Text, StyleSheet, ScrollView } from "react-native";

import { useAlerts } from "@/hooks/useAlerts";
import AlertCard from "@/components/alerts/AlertCard";
import { theme } from "@/styles/theme";

export default function Alerts() {
  const { alerts, loading, error } = useAlerts();

  if (loading) {
    return (
      <View style={styles.center}>
        <Text style={styles.message}>Carregando alertas...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.eyebrow}>NOTIFICAÇÕES DO SISTEMA</Text>
        <Text style={styles.title}>Alertas</Text>
        <Text style={styles.subtitle}>
          Acompanhe os alertas registrados pelas máquinas.
        </Text>
      </View>

      {error ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.errorTitle}>Erro ao carregar alertas</Text>
          <Text style={styles.message}>{error}</Text>
        </View>
      ) : alerts.length > 0 ? (
        <View style={styles.alertList}>
          {alerts.map((alert) => (
            <AlertCard key={alert.id} alert={alert} />
          ))}
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Tudo tranquilo!</Text>
          <Text style={styles.message}>
            Nenhum alerta registrado no momento.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    padding: 16,
    paddingTop: 24,
    paddingBottom: 32,
    gap: 24,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
  header: {
    gap: 6,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.2,
    color: theme.colors.primary,
  },
  title: {
    fontSize: 28,
    fontWeight: "900",
    color: theme.colors.text,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 20,
    color: theme.colors.muted,
    marginTop: 2,
  },
  alertList: {
    gap: 12,
  },
  emptyContainer: {
    backgroundColor: theme.colors.surface,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: theme.radius.medium,
    padding: 24,
    alignItems: "center",
    gap: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.text,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: theme.colors.danger,
  },
  message: {
    fontSize: 13,
    color: theme.colors.muted,
    textAlign: "center",
  },
});