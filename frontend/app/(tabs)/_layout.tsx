import { Redirect, Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text, View } from 'react-native';

import { HapticTab } from '@/components/haptic-tab';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useSessionStore } from '@/stores/session-store';

type TabIconProps = {
  color: string;
  focused: boolean;
  icon: React.ComponentProps<typeof IconSymbol>['name'];
  label: string;
};

function TabIcon({ color, focused, icon, label }: TabIconProps) {
  return (
    <View
      className={`h-12 flex-row items-center justify-center rounded-full ${
        focused ? 'min-w-[116px] bg-surfaceAlt px-5' : 'w-14'
      }`}>
      <IconSymbol size={24} name={icon} color={color} />
      {focused ? <Text className="ml-3 text-sm font-extrabold text-white">{label}</Text> : null}
    </View>
  );
}

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
        tabBarInactiveTintColor: '#F8FAFC',
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          height: 56,
          marginHorizontal: 4,
          marginVertical: 4,
          borderRadius: 999,
        },
        tabBarStyle: {
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: 0,
          height: Platform.OS === 'ios' ? 78 : 68,
          paddingHorizontal: 14,
          paddingTop: 6,
          paddingBottom: Platform.OS === 'ios' ? 16 : 6,
          borderTopWidth: 0,
          borderRadius: 0,
          backgroundColor: '#171717',
          elevation: 0,
          shadowColor: '#000000',
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
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} icon="house.fill" label="Home" />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: 'Escalas',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon color={color} focused={focused} icon="calendar" label="Escalas" />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Conta',
          tabBarIcon: ({ color, focused }) => (
            <TabIcon
              color={color}
              focused={focused}
              icon="person.crop.circle.fill"
              label="Conta"
            />
          ),
        }}
      />
    </Tabs>
  );
}
