
import { View, StyleSheet } from "react-native";
import { Stack } from "expo-router";

import { AppProvider } from "@/components/contexts/AppContext";
import BottomNav from "@/components/navbar/BottomNav";
import { theme } from "@/styles/theme";

export default function RootLayout() {
  return (
    <AppProvider>
      <View style={styles.container}>
        <View style={styles.content}>
          <Stack
            screenOptions={{
              headerShown: false,
            }}
          />
        </View>

        <BottomNav />
      </View>
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  content: {
    flex: 1,
  },
});
