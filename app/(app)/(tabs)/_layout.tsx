import { Tabs } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { Sidebar } from '@/components/Sidebar';
import { TabIcon } from '@/components/TabIcon';
import { colors, fonts } from '@/constants/theme';
import { useWideLayout } from '@/hooks/useWideLayout';

export default function TabLayout() {
  const wide = useWideLayout();

  return (
    <View style={styles.root}>
      {wide ? <Sidebar /> : null}
      <View style={styles.main}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.ink,
            tabBarInactiveTintColor: colors.inkSoft,
            tabBarStyle: wide
              ? { display: 'none' }
              : {
                  backgroundColor: colors.mistDeep,
                  borderTopColor: colors.line,
                  borderTopWidth: StyleSheet.hairlineWidth,
                  height: 58,
                  paddingTop: 4,
                  paddingBottom: 4,
                },
            tabBarLabelStyle: {
              fontFamily: fonts.bodyMedium,
              fontSize: 11,
              marginTop: 2,
            },
            tabBarItemStyle: {
              gap: 2,
            },
          }}>
          <Tabs.Screen
            name="home"
            options={{
              title: 'Next',
              tabBarIcon: ({ color }) => <TabIcon name="next" color={color} />,
            }}
          />
          <Tabs.Screen
            name="tasks"
            options={{
              title: 'Tasks',
              tabBarIcon: ({ color }) => <TabIcon name="tasks" color={color} />,
            }}
          />
          <Tabs.Screen
            name="connections"
            options={{
              title: 'Connect',
              tabBarIcon: ({ color }) => <TabIcon name="connect" color={color} />,
            }}
          />
        </Tabs>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: colors.mistDeep,
  },
  main: {
    flex: 1,
  },
});
