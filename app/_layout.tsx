import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';
import { Session } from '@supabase/supabase-js';
import { View, ActivityIndicator } from 'react-native';

export default function RootLayout() {
  const [session, setSession] = useState<Session | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    // 1. Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setInitialized(true);
    });

    // 2. Escuchar cambios de auth
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setInitialized(true);
    });

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
      {/* Si NO hay sesión, mostramos Login. Si HAY, mostramos el Tabs */}
      {!session ? (
        <Stack.Screen name="(auth)/login" options={{ title: 'Iniciar Sesión' }} />
      ) : (
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      )}
      
      {/* Rutas adicionales */}
      <Stack.Screen name="(auth)/register" options={{ title: 'Registro' }} />
      <Stack.Screen 
        name="editor/[type]" 
        options={{ 
          presentation: 'modal', 
          headerShown: true, 
          title: 'Nuevo Escrito' 
        }} 
      />
    </Stack>
  );
}