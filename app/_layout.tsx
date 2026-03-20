import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { supabase } from '../src/lib/supabase';
import { Session } from '@supabase/supabase-js';

// Configuración de notificaciones
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setInitialized(true);
    });

    if (Platform.OS === 'android') {
      Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    return () => authListener.subscription.unsubscribe();
  }, []);

  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* IMPORTANTE: Eliminamos los fragmentos <> y listamos las pantallas directamente.
         Expo Router decidirá cuál mostrar basándose en la lógica del condicional.
      */}
      {!session ? (
        <Stack.Screen name="(auth)/login" options={{ title: 'Login' }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
      
      {/* Pantallas comunes o que no dependen del estado de login inmediato */}
      <Stack.Screen name="(auth)/register" options={{ title: 'Registro' }} />
      <Stack.Screen 
        name="editor/[type]" 
        options={{ 
          presentation: 'modal', 
          headerShown: true, 
          title: 'Nueva Obra' 
        }} 
      />
    </Stack>
  );
}