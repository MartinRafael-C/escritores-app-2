import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, StatusBar } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  const router = useRouter();

  // Lógica del saludo dinámico
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 20) return "Buenas tardes";
    return "Buenas noches";
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <Text style={styles.greeting}>{getGreeting()}, escritor.</Text>
        <Text style={styles.question}>¿Qué deseas escribir hoy?</Text>
      </View>

      <View style={styles.buttonGrid}>
        {/* Botón de Poema */}
        <TouchableOpacity 
          style={styles.mainButton} 
          onPress={() => router.push('/editor/poema')}
          activeOpacity={0.7}
        >
          <View style={styles.iconCircle}>
            <Ionicons name="leaf-outline" size={32} color="#fff" />
          </View>
          <Text style={styles.buttonTitle}>Poema</Text>
          <Text style={styles.buttonSubtitle}>Deja fluir la lírica</Text>
        </TouchableOpacity>

        {/* Botón de Microcuento */}
        <TouchableOpacity 
          style={[styles.mainButton, styles.buttonSecondary]} 
          onPress={() => router.push('/editor/microcuento')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconCircle, { backgroundColor: '#444' }]}>
            <Ionicons name="book-outline" size={32} color="#fff" />
          </View>
          <Text style={styles.buttonTitle}>Microcuento</Text>
          <Text style={styles.buttonSubtitle}>Brevedad y precisión</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.footerInfo}>
        <Ionicons name="sparkles-outline" size={20} color="#888" />
        <Text style={styles.footerText}>La inspiración te espera en cada palabra.</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FBFBFB', // Blanco hueso para no cansar la vista
    paddingHorizontal: 25,
  },
  header: {
    marginTop: 60,
    marginBottom: 40,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '700',
    color: '#1A1A1A',
    letterSpacing: -0.5,
  },
  question: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
    fontWeight: '400',
  },
  buttonGrid: {
    gap: 20,
  },
  mainButton: {
    backgroundColor: '#1A1A1A',
    padding: 25,
    borderRadius: 20,
    flexDirection: 'column',
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  buttonSecondary: {
    backgroundColor: '#2D2D2D',
  },
  iconCircle: {
    width: 55,
    height: 55,
    borderRadius: 15,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonTitle: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '600',
  },
  buttonSubtitle: {
    color: '#AAA',
    fontSize: 14,
    marginTop: 4,
  },
  footerInfo: {
    position: 'absolute',
    bottom: 40,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
  },
  footerText: {
    color: '#888',
    fontSize: 14,
    fontStyle: 'italic',
  },
});