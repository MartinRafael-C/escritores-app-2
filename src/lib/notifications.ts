import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export async function sendLocalNotification(tipo: string) {
  // 1. Pedir permisos (necesario en iOS y Android 13+)
  const { status } = await Notifications.getPermissionsAsync();
  if (status !== 'granted') {
    const { status: newStatus } = await Notifications.requestPermissionsAsync();
    if (newStatus !== 'granted') return;
  }

  // 2. Programar la notificación inmediata
  await Notifications.scheduleNotificationAsync({
    content: {
      title: "¡Felicidades! 🎉",
      body: `Nuevo ${tipo} guardado, sigue así 📖`,
      data: { screen: 'saved' }, // Opcional: para navegar al tocarla
    },
    trigger: null, // null significa "ahora mismo"
  });
}