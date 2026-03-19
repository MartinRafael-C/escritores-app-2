import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const router = useRouter();
  
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "¡Buenos días!";
    if (hour < 20) return "¡Buenas tardes!";
    return "¡Buenas noches!";
  };

  return (
    <View style={styles.container}>
      <Text style={styles.greeting}>{getGreeting()}</Text>
      <Text style={styles.subtitle}>¿Qué deseas escribir hoy?</Text>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/editor/poema')}
        >
          <Text style={styles.buttonText}>Poema</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.button} 
          onPress={() => router.push('/editor/microcuento')}
        >
          <Text style={styles.buttonText}>Microcuento</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#fff' },
  greeting: { fontSize: 28, fontWeight: 'bold' },
  subtitle: { fontSize: 18, marginVertical: 10, color: '#666' },
  buttonContainer: { marginTop: 30, gap: 15 },
  button: { backgroundColor: '#333', padding: 20, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' }
});