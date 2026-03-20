import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { POEM_QUOTES, STORY_QUOTES } from '../../src/constants/quotes';
import { supabase } from '../../src/lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendLocalNotification } from '../../src/lib/notifications';

export default function EditorScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const [quote, setQuote] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const quotes = type === 'poema' ? POEM_QUOTES : STORY_QUOTES;
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, [type]);

  const handleSave = async () => {
    if (!content.trim()) {
      return Alert.alert("Campo vacío", "Por favor, escribe algo antes de guardar.");
    }

    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) throw new Error("No se encontró una sesión activa.");

      const { error } = await supabase
        .from('escritos')
        .insert([
          { 
            user_id: user.id, 
            tipo: type, 
            cita_inspiracion: quote, 
            texto: content 
          },
        ]);

      if (error) throw error;

      // DISPARAR NOTIFICACIÓN LOCAL
      await sendLocalNotification(type as string);

      Alert.alert("¡Éxito!", "Tu obra ha sido guardada correctamente.");
      router.back();
    } catch (e: any) {
      Alert.alert("Error al guardar", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.header}>
          <Text style={styles.label}>Tu inspiración para hoy:</Text>
          <Text style={styles.quote}>"{quote}"</Text>
        </View>

        <TextInput
          style={styles.input}
          multiline
          placeholder="Empieza a escribir aquí..."
          placeholderTextColor="#999"
          value={content}
          onChangeText={setContent}
          textAlignVertical="top"
        />

        <TouchableOpacity 
          style={[styles.button, loading && styles.buttonDisabled]} 
          onPress={handleSave}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Guardar mi obra</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { padding: 25 },
  header: { marginBottom: 25 },
  label: { fontSize: 14, color: '#888', fontWeight: '600', marginBottom: 8 },
  quote: { fontSize: 18, fontStyle: 'italic', color: '#333', lineHeight: 26 },
  input: { 
    backgroundColor: '#f9f9f9', 
    minHeight: 300, 
    padding: 20, 
    borderRadius: 15, 
    fontSize: 16, 
    color: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#eee'
  },
  button: { 
    backgroundColor: '#000', 
    paddingVertical: 18, 
    borderRadius: 12, 
    marginTop: 25, 
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  buttonDisabled: { backgroundColor: '#555' },
  buttonText: { color: '#fff', fontWeight: 'bold', fontSize: 16 }
});