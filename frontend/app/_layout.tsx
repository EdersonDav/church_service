import { Stack } from 'expo-router';
import * as NavigationBar from 'expo-navigation-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import { Platform } from 'react-native';
import { useSessionStore } from '@/stores/session-store';
import '../global.css';

// Previne o splash screen de ficar "preso" em alguns dispositivos
SplashScreen.preventAutoHideAsync().catch(() => {});

export default function Layout() {
  const hasHydrated = useSessionStore((state) => state.hasHydrated);

  useEffect(() => {
    if (Platform.OS !== 'android') {
      return;
    }

    NavigationBar.setVisibilityAsync('hidden').catch(() => {});
    NavigationBar.setBehaviorAsync('overlay-swipe').catch(() => {});
  }, []);

  useEffect(() => {
    if (!hasHydrated) {
      return;
    }

    // Só libera a UI quando a sessão persistida já foi restaurada
    SplashScreen.hideAsync();
  }, [hasHydrated]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="verify-code" />
      <Stack.Screen name="church/[churchId]" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}
