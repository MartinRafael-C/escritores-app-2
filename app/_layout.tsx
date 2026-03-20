import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // Verificamos si hay una sesión activa al abrir la app
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    // Escuchamos cambios en la autenticación (Login/Logout)
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  // Mientras verificamos la sesión, mostramos un cargador
  if (!initialized) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    );
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      {!session ? (
        // RUTA PROTEGIDA: Si no hay sesión, solo mostramos Login/Register
        <>
          <Stack.Screen name="(auth)/login" options={{ title: 'Iniciar Sesión' }} />
          <Stack.Screen name="(auth)/register" options={{ title: 'Registro' }} />
        </>
      ) : (
        // RUTA PRIVADA: Si hay sesión, habilitamos las Tabs y modales
        <>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          
          {/* PANTALLA DEL EDITOR (MODAL) */}
          <Stack.Screen 
            name="editor/[type]" 
            options={{ 
              presentation: 'modal',
              headerShown: true,
              title: 'Nueva Obra'
            }} 
          />

          {/* NUEVA PANTALLA DE LECTURA QR (MODAL) */}
          <Stack.Screen 
            name="reader/[id]" 
            options={{ 
              presentation: 'modal', 
              animation: 'slide_from_bottom',
              headerShown: false 
            }} 
          />
        </>
      )}
    </Stack>
  );
}