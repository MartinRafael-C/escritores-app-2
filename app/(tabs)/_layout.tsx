import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ 
      tabBarActiveTintColor: '#1A1A1A',
      tabBarInactiveTintColor: '#AAA',
      tabBarStyle: { height: 60, paddingBottom: 10 },
      headerShown: false 
    }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Inicio',
          tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
      />
      <Tabs.Screen
        name="saved" // Este nombre debe coincidir con saved.tsx
        options={{
          title: 'Mis Escritos',
          tabBarIcon: ({ color }) => <Ionicons name="bookmark-outline" size={24} color={color} />,
        }}
      />
    </Tabs>
  );
}