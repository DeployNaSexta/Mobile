
import { View, Text, Pressable, StyleSheet } from "react-native";
import { useRouter, usePathname } from "expo-router";

import { NAV_ITEMS } from "./navConfig";
import { theme } from "@/styles/theme";

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname.startsWith(
          item.name === "index" ? "/Home" : `/${item.name.split("/")[0]}`
        );

        const route =
          item.name === "index"
            ? "/Home"
            : `/${item.name.split("/")[0]}`;

        return (
          <Pressable
            key={item.name}
            style={styles.item}
            onPress={() => router.navigate(route as any)}
          >
            <Icon
              size={21}
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
    height: 70,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: theme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    paddingHorizontal: 4,
  },
  item: {
    flex: 1,
    height: "100%",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  label: {
    color: theme.colors.muted,
    fontSize: 9,
    fontWeight: "600",
  },
  activeLabel: {
    color: theme.colors.primary,
    fontWeight: "800",
  },
});
