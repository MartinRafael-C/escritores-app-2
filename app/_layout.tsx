import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, ActivityIndicator, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { supabase } from '../src/lib/supabase';
import { Session } from '@supabase/supabase-js';

// CONFIGURACIÓN DE NOTIFICACIONES
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
    // 1. Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    // 2. Escuchar cambios de autenticación
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setInitialized(true);
    });

    // 3. Configuración de canal para Android
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
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!session ? (
        // RUTAS PARA USUARIOS NO AUTENTICADOS
        <>
          <Stack.Screen 
            name="(auth)/login" 
            options={{ title: 'Login', animation: 'fade' }} 
          />
          <Stack.Screen 
            name="(auth)/register" 
            options={{ title: 'Registro', animation: 'slide_from_right' }} 
          />
        </>
      ) : (
        // RUTAS PARA USUARIOS AUTENTICADOS
        <>
          <Stack.Screen 
            name="(tabs)" 
            options={{ headerShown: false }} 
          />
          <Stack.Screen 
            name="editor/[type]" 
            options={{ 
              presentation: 'modal', 
              headerShown: true, 
              title: 'Nueva Obra' 
            }} 
          />
        </>
      )}
    </Stack>
  );
}