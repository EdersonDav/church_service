import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useSessionStore } from '@/stores/session-store';

export default function TabLayout() {
  const token = useSessionStore((state) => state.token);
  const hasHydrated = useSessionStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return null;
  }

  if (!token) {
    return <Redirect href="/login" />;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: '#F8FAFC',
        tabBarInactiveTintColor: '#94A3B8',
        tabBarActiveBackgroundColor: '#334155',
        tabBarHideOnKeyboard: true,
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '700',
          letterSpacing: 0.3,
        },
        tabBarItemStyle: {
          marginHorizontal: 6,
          marginVertical: 6,
          borderRadius: 18,
        },
        tabBarStyle: {
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 20,
          height: 74,
          paddingTop: 8,
          paddingBottom: Platform.OS === 'ios' ? 10 : 8,
          borderTopWidth: 0,
          borderRadius: 28,
          backgroundColor: '#1E293B',
          elevation: 0,
          shadowColor: '#020617',
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.35,
          shadowRadius: 18,
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Igrejas',
          tabBarIcon: ({ color }) => <IconSymbol size={28} name="building.2.fill" color={color} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Conta',
          tabBarIcon: ({ color }) => (
            <IconSymbol size={28} name="person.crop.circle.fill" color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
