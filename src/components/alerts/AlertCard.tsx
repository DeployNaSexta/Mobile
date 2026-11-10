
import { View, Text, StyleSheet } from "react-native";
import {
  AlertTriangle,
  AlertCircle,
  CheckCircle,
  Info,
} from "lucide-react-native";

import type { Alert } from "@/types";
import { theme } from "@/styles/theme";

interface AlertCardProps {
  alert: Alert;
}

const ICON_BY_LEVEL = {
  atencao: AlertTriangle,
  critico: AlertCircle,
  resolvido: CheckCircle,
  info: Info,
};

const LEVEL_COLORS = {
  atencao: {
    background: theme.colors.warningBackground,
    border: "rgba(242, 169, 59, 0.3)",
    color: theme.colors.warning,
    iconBackground: "rgba(242, 169, 59, 0.15)",
  },
  critico: {
    background: theme.colors.dangerBackground,
    border: "rgba(255, 92, 92, 0.3)",
    color: theme.colors.danger,
    iconBackground: "rgba(255, 92, 92, 0.15)",
  },
  resolvido: {
    background: theme.colors.successBackground,
    border: "rgba(93, 214, 44, 0.25)",
    color: theme.colors.primary,
    iconBackground: "rgba(93, 214, 44, 0.15)",
  },
  info: {
    background: theme.colors.infoBackground,
    border: "rgba(77, 159, 255, 0.3)",
    color: theme.colors.info,
    iconBackground: "rgba(77, 159, 255, 0.15)",
  },
};

export default function AlertCard({ alert }: AlertCardProps) {
  const Icon = ICON_BY_LEVEL[alert.nivel] || Info;
  const colors = LEVEL_COLORS[alert.nivel] || LEVEL_COLORS.info;

  const time = new Date(alert.dataHora).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.background,
          borderColor: colors.border,
        },
      ]}
    >
      <View
        style={[
          styles.iconContainer,
          { backgroundColor: colors.iconBackground },
        ]}
      >
        <Icon size={20} color={colors.color} />
      </View>

      <View style={styles.body}>
        <View style={styles.headRow}>
          <Text style={styles.name}>{alert.maquina}</Text>

          <View
            style={[
              styles.tag,
              { backgroundColor: colors.iconBackground },
            ]}
          >
            <Text style={[styles.tagText, { color: colors.color }]}>
              {alert.tipo}
            </Text>
          </View>
        </View>

        <Text style={styles.message}>{alert.mensagem}</Text>

        <View style={styles.footer}>
          <Text style={styles.footerText}>{time}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-start",
    padding: 14,
    borderRadius: theme.radius.medium,
    borderWidth: 1,
    gap: 12,
    marginBottom: 12,
  },
  iconContainer: {
    width: 34,
    height: 34,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  body: {
    flex: 1,
    gap: 10,
  },
  headRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 8,
  },
  name: {
    fontSize: 14,
    fontWeight: "800",
    color: theme.colors.text,
  },
  tag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 20,
  },
  tagText: {
    fontSize: 10,
    fontWeight: "800",
  },
  message: {
    fontSize: 12,
    color: "#C9C9C9",
    lineHeight: 19,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  footerText: {
    fontSize: 10.5,
    color: theme.colors.mutedSecondary,
    fontWeight: "700",
  },
});
