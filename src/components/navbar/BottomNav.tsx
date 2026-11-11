
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter, usePathname, type Href } from "expo-router";

import Icon from "@/components/icons/Icon";
import { NAV_ITEMS } from "@/components/shared/navConfig";
import { theme } from "@/styles/theme";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  console.log("ROTA ATUAL:", pathname);
  const currentPath = pathname.toLowerCase().replace(/\/$/, "");

  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const itemPath = item.to.toLowerCase().replace(/\/$/, "");

        const active =
          currentPath === itemPath ||
          (itemPath === "/" && currentPath === "/home") ||
          (itemPath !== "/" && currentPath.startsWith(`${itemPath}/`));
        return (
          <Pressable
            key={item.to}
            style={({ pressed }) => [
              styles.item,
              active && styles.itemActive,
              pressed && styles.itemPressed,
            ]}
            onPress={() => router.navigate(item.to as Href)}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
          >
            <Icon
              name={item.icon}
              size={26}
              color={
                active
                  ? theme.colors.primary
                  : theme.colors.muted
              }
            />

            <Text
              style={[
                styles.label,
                active && styles.activeLabel,
              ]}
              numberOfLines={1}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 75,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },

  item: {
    flex: 1,
    height: 68,
    alignItems: "center",
    justifyContent: "center",
    gap: 1,
    borderRadius: theme.radius.small,
    marginHorizontal: 3,
  },

  itemActive: {
    backgroundColor: "#1B3518",
  },

  itemPressed: {
    opacity: 0.65,
  },

  label: {
    color: theme.colors.muted,
    fontSize: 13,
    fontWeight: "600",
    textAlign: "center",
  },

  activeLabel: {
    color: theme.colors.primary,
    fontWeight: "800",
  },
});
