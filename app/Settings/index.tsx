import { ScrollView, View, Text, Pressable, StyleSheet } from "react-native";
import {
  ChevronRight,
  LogOut,
  User,
} from "lucide-react-native";
import { useApp } from "@/components/contexts/AppContext";

interface SettingRowProps {
  label: string;
  value: string;
  onPress: () => void;
}

function SettingRow({ label, value, onPress }: SettingRowProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.settingRow,
        pressed && styles.pressed,
      ]}
      onPress={onPress}
    >
      <Text style={styles.settingLabel}>{label}</Text>

      <View style={styles.settingValueContainer}>
        <Text style={styles.settingValue}>{value}</Text>
        <ChevronRight size={16} color="#94A3B8" />
      </View>
    </Pressable>
  );
}

export default function Settings() {
  const { showToast } = useApp();

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Text style={styles.eyebrow}>Preferências</Text>
      <Text style={styles.title}>Configurações</Text>

      {/* Perfil */}
      <View style={styles.profileBox}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>C</Text>
        </View>

        <View style={styles.profileInfo}>
          <Text style={styles.profileName}>Carlos Ferreira</Text>
          <Text style={styles.profileRole}>
            Operador Principal · Fazenda São Bento
          </Text>
        </View>
      </View>

      {/* Limites de alerta */}
      <Text style={styles.groupLabel}>LIMITES DE ALERTA</Text>

      <View style={styles.settingList}>
        <SettingRow
          label="Temperatura Máxima"
          value="90°C"
          onPress={() => showToast("Ajustar temperatura máxima")}
        />

        <SettingRow
          label="Vibração Máxima"
          value="3.0 mm/s"
          onPress={() => showToast("Ajustar vibração máxima")}
        />

        <SettingRow
          label="Pressão Mínima Óleo"
          value="2.5 bar"
          onPress={() => showToast("Ajustar pressão mínima")}
        />
      </View>

      {/* Notificações */}
      <Text style={styles.groupLabel}>NOTIFICAÇÕES</Text>

      <View style={styles.settingList}>
        <SettingRow
          label="Alertas Críticos"
          value="Ativo"
          onPress={() => showToast("Alertas críticos: ativo")}
        />

        <SettingRow
          label="Relatório Diário"
          value="18:00"
          onPress={() => showToast("Editar horário do relatório diário")}
        />

        <SettingRow
          label="Resumo Semanal"
          value="Dom 08:00"
          onPress={() => showToast("Editar resumo semanal")}
        />
      </View>

      {/* Sair */}
      <Pressable
        style={({ pressed }) => [
          styles.logoutButton,
          pressed && styles.pressed,
        ]}
        onPress={() => showToast("Sessão encerrada")}
      >
        <LogOut size={18} color="#EF4444" />
        <Text style={styles.logoutText}>Sair da Conta</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  eyebrow: {
    fontSize: 13,
    color: "#94A3B8",
    marginBottom: 6,
  },
  title: {
    fontSize: 26,
    fontWeight: "700",
    color: "#0F172A",
    marginBottom: 24,
  },
  profileBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 28,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#DBEAFE",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2563EB",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0F172A",
  },
  profileRole: {
    fontSize: 12,
    color: "#64748B",
    marginTop: 4,
  },
  groupLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94A3B8",
    letterSpacing: 1,
    marginBottom: 10,
  },
  settingList: {
    backgroundColor: "#FFFFFF",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    marginBottom: 24,
    overflow: "hidden",
  },
  settingRow: {
    minHeight: 58,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderBottomColor: "#F1F5F9",
  },
  settingLabel: {
    fontSize: 14,
    color: "#334155",
  },
  settingValueContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  settingValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#64748B",
  },
  pressed: {
    opacity: 0.65,
  },
  logoutButton: {
    height: 54,
    backgroundColor: "#FEF2F2",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginTop: 4,
  },
  logoutText: {
    color: "#EF4444",
    fontSize: 14,
    fontWeight: "700",
  },
});