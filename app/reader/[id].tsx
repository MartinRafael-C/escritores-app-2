import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, ScrollView } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ReaderScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const [work, setWork] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) fetchWork();
  }, [id]);

  const fetchWork = async () => {
    try {
      const { data, error } = await supabase
        .from('escritos')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      setWork(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#007AFF" /></View>;
  }

  if (!work) {
    return (
      <View style={styles.center}>
        <Text>No se encontró la obra.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Text style={{color: '#fff'}}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="close-circle" size={32} color="#8E8E93" />
        </TouchableOpacity>
        <Text style={styles.badge}>{work.tipo.toUpperCase()}</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {work.cita_inspiracion && (
          <Text style={styles.quote}>"{work.cita_inspiracion}"</Text>
        )}
        
        <View style={styles.divider} />
        
        <Text style={styles.poemText}>{work.texto}</Text>
        
        <Text style={styles.footer}>
          Escrito el {new Date(work.fecha).toLocaleDateString()}
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1, 
      backgroundColor: '#FFF' 
    },
    center: { 
      flex: 1, 
      justifyContent: 'center', 
      alignItems: 'center' 
    },
    header: { 
      flexDirection: 'row', 
      justifyContent: 'space-between', 
      padding: 20, 
      alignItems: 'center' 
    },
    badge: { 
      backgroundColor: '#E5E5EA', 
      paddingHorizontal: 10, 
      paddingVertical: 4, 
      borderRadius: 8, 
      fontSize: 12, 
      fontWeight: 'bold', 
      color: '#3A3A3C' 
    },
    content: { 
      paddingHorizontal: 30, 
      paddingBottom: 50 
    },
    quote: { 
      fontSize: 18, 
      fontStyle: 'italic', 
      color: '#636366', 
      textAlign: 'center', 
      marginBottom: 20 
    },
    divider: { 
      height: 1, // Corregido: de 'hgeight' a 'height'
      backgroundColor: '#E5E5EA', 
      marginVertical: 20, 
      width: '40%', 
      alignSelf: 'center' 
    },
    poemText: { 
      fontSize: 20, 
      lineHeight: 32, 
      color: '#1C1C1E', 
      textAlign: 'center', 
      fontFamily: 'serif' 
    },
    footer: { 
      marginTop: 40, 
      textAlign: 'center', 
      color: '#AEAEB2', 
      fontSize: 12 
    },
    backButton: { 
      marginTop: 20, 
      backgroundColor: '#007AFF', 
      padding: 10, 
      borderRadius: 10 
    }
  });