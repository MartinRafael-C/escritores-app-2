import { Redirect } from 'expo-router';
import { useRootNavigationState } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../src/lib/supabase';

export default function Index() {
  const rootNavigationState = useRootNavigationState();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });
  }, []);

  // Esperar a que la navegación esté lista para evitar errores de "Navigation not found"
  if (!rootNavigationState?.key || loading) return null;

  // EL FILTRO CRÍTICO:
  if (!session) {
    return <Redirect href="/(auth)/login" />;
  } else {
    return <Redirect href="/(tabs)" />;
  }
}