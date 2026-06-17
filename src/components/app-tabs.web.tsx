import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

import { Colors } from '@/constants/theme';

export default function AppTabs() {
  const scheme = useColorScheme();
  const colors = Colors[scheme === 'unspecified' ? 'light' : scheme];

  return (
      <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: {
              backgroundColor: colors.background,
              borderTopColor: 'transparent',
            },
            tabBarActiveTintColor: colors.text,
            tabBarInactiveTintColor: colors.text + '99',
          }}
      >
        <Tabs.Screen
            name="index"
            options={{
              title: 'Hisabu kwa kuuza',
            }}
        />

        <Tabs.Screen
            name="items"
            options={{
              title: 'Dhibiti bidhaa',
            }}
        />
      </Tabs>
  );
}
