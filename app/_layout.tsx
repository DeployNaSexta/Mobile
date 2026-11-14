
import { useEffect, useState } from "react";
import {
  View,
  Image,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Stack } from "expo-router";
import {
  SafeAreaProvider,
  SafeAreaView,
} from "react-native-safe-area-context";

import { AppProvider } from "@/components/contexts/AppContext";
import BottomNav from "@/components/navbar/BottomNav";
import { theme } from "@/styles/theme";

export default function RootLayout() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timeout);
  }, []);

  if (loading) {
    return (
      <View style={styles.splash}>
        <Image
          source={require("../assets/logo.jpg")}
          style={styles.logo}
          resizeMode="contain"
        />

        <ActivityIndicator
          size="large"
          color="#FFFFFF"
          style={styles.spinner}
        />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <SafeAreaView
          style={styles.container}
          edges={["top", "bottom"]}
        >
          <View style={styles.content}>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            />
          </View>

          <BottomNav />
        </SafeAreaView>
      </AppProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  splash: {
    flex: 1,
    backgroundColor: "#000000",
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    width: 220,
    height: 220,
  },
  spinner: {
    marginTop: 20,
  },
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    flex: 1,
  },
});
