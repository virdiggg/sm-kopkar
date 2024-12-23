import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
// import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
// import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  // const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        // tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
        tabBarActiveTintColor: Colors['light'].tint,
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarBackground: TabBarBackground,
        tabBarStyle: Platform.select({
          ios: {
            // Use a transparent background on iOS to show the blur effect
            position: 'absolute',
          },
          default: {},
        }),
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: 'History',
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <Tabs.Screen
        name="simpanan"
        options={{
          title: 'Simpanan',
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <Tabs.Screen
        name="pinjaman"
        options={{
          title: 'Pinjaman',
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <Tabs.Screen
        name="history_pinjaman"
        options={{
          title: 'History Pinjaman',
          tabBarStyle: {
            display: "none",
          },
        }}
      />
      <Tabs.Screen
        name="history_simpanan"
        options={{
          title: 'History Simpanan',
          tabBarStyle: {
            display: "none",
          },
        }}
      />
    </Tabs>
  );
}
