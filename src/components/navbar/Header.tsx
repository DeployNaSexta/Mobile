
import { useState, useEffect } from "react";
import {
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";

import { Menu, Bell } from "lucide-react-native";
import { useApp } from "@/components/contexts/AppContext";
import { theme } from "@/styles/theme";

interface HeaderProps {
  onOpenMenu?: () => void;
  showMenuButton?: boolean;
}

export default function Header({
  onOpenMenu,
  showMenuButton = true,
}: HeaderProps) {
  const { showToast } = useApp();
  const [clock, setClock] = useState("");

  useEffect(() => {
    const tick = () => {
      const date = new Date();

      setClock(
        `${String(date.getHours()).padStart(2, "0")}:${String(
          date.getMinutes()
        ).padStart(2, "0")}`
      );
    };

    tick();

    const interval = setInterval(tick, 30000);

    return () => clearInterval(interval);
  }, []);

  return (
    <View style={styles.container}>
      {showMenuButton && (
        <Pressable
          style={styles.iconButton}
          onPress={onOpenMenu}
          accessibilityLabel="Abrir menu"
        >
          <Menu size={22} color={theme.colors.text} />
        </Pressable>
      )}

      <View style={styles.logoBadge}>
        <Text style={styles.logoText}>SENSUS</Text>
        <Text style={styles.tag}>AGRO</Text>
      </View>

      <View style={styles.clockBadge}>
        <Text style={styles.clockText}>{clock}</Text>
      </View>

      <Pressable
        style={styles.iconButton}
        onPress={() => showToast("2 alertas não lidos")}
        accessibilityLabel="Notificações"
      >
        <Bell size={22} color={theme.colors.text} />

        <View style={styles.bellBadge}>
          <Text style={styles.bellBadgeText}>2</Text>
        </View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 64,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  iconButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  logoBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  logoText: {
    color: theme.colors.text,
    fontSize: 18,
    fontWeight: "900",
    letterSpacing: 1,
  },
  tag: {
    color: theme.colors.primary,
    fontSize: 11,
    fontWeight: "800",
  },
  clockBadge: {
    backgroundColor: theme.colors.surfaceSecondary,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clockText: {
    color: theme.colors.text,
    fontSize: 13,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  bellBadge: {
    position: "absolute",
    top: 2,
    right: 1,
    backgroundColor: theme.colors.danger,
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  bellBadgeText: {
    color: "#FFFFFF",
    fontSize: 9,
    fontWeight: "bold",
  },
});
