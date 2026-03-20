import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { POEM_QUOTES, STORY_QUOTES } from '../../src/constants/quotes';
import { supabase } from '../../src/lib/supabase';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function EditorScreen() {
  const { type } = useLocalSearchParams();
  const router = useRouter();
  const [quote, setQuote] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const quotes = type === 'poema' ? POEM_QUOTES : STORY_QUOTES;
    setQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, [type]);

  const handleSave = async () => {
    if (!content.trim()) return Alert.alert("Ups", "Escribe algo");
    setLoading(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const { error } = await supabase
        .from('escritos')
        .insert([{ 
          user_id: user?.id, 
          tipo: type, 
          cita_inspiracion: quote, 
          texto: content 
        }]);

      if (error) throw error;
      Alert.alert("¡Guardado!", "Tu obra está en Supabase.");
      router.back();
    } catch (e: any) {
      Alert.alert("Error", e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Inspiración:</Text>
        <Text style={styles.quote}>"{quote}"</Text>
        <TextInput
          style={styles.input}
          multiline
          placeholder="Escribe aquí..."
          value={content}
          onChangeText={setContent}
        />
        <TouchableOpacity style={styles.button} onPress={handleSave} disabled={loading}>
          <Text style={styles.buttonText}>{loading ? "Guardando..." : "Guardar"}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  label: { color: '#888', fontWeight: 'bold' },
  quote: { fontSize: 18, fontStyle: 'italic', marginVertical: 15 },
  input: { backgroundColor: '#f9f9f9', minHeight: 200, padding: 15, borderRadius: 10, textAlignVertical: 'top' },
  button: { backgroundColor: '#000', padding: 18, borderRadius: 10, marginTop: 20, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' }
});