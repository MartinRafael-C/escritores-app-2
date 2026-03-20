import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Escrito {
  id: string;
  texto: string;
  tipo: string;
  fecha: string;
  cita_inspiracion: string;
}

export default function SavedScreen() {
  const [escritos, setEscritos] = useState<Escrito[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchEscritos = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('escritos')
        .select('*')
        .order('fecha', { ascending: false });

      if (error) throw error;
      setEscritos(data || []);
    } catch (error: any) {
      Alert.alert("Error", "No se pudieron cargar tus escritos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEscritos();
  }, []);

  const renderItem = ({ item }: { item: Escrito }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.typeTag}>{item.tipo.toUpperCase()}</Text>
        <Text style={styles.dateText}>{new Date(item.fecha).toLocaleDateString()}</Text>
      </View>
      {item.cita_inspiracion && (
        <Text style={styles.quotePreview}>Inspirado en: "{item.cita_inspiracion.substring(0, 40)}..."</Text>
      )}
      <Text style={styles.contentText} numberOfLines={3}>{item.texto}</Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>Mis Obras</Text>
          <TouchableOpacity onPress={fetchEscritos} activeOpacity={0.6}>
            <Ionicons name="refresh" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" color="#000" />
          </View>
        ) : escritos.length === 0 ? (
          <View style={styles.center}>
            <Ionicons name="journal-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>Aún no has escrito nada.</Text>
          </View>
        ) : (
          <FlatList
            data={escritos}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

// ESTA ES LA PARTE QUE FALTABA PARA SOLUCIONAR EL ERROR "Cannot find name 'styles'"
const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#FBFBFB' 
  },
  container: { 
    flex: 1, 
    paddingHorizontal: 20 
  },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20 
  },
  title: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1A1A1A' 
  },
  list: { 
    paddingBottom: 20 
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 20, 
    borderRadius: 15, 
    marginBottom: 15, 
    elevation: 2, 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowRadius: 10 
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    marginBottom: 10 
  },
  typeTag: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    color: '#888', 
    letterSpacing: 1 
  },
  dateText: { 
    fontSize: 12, 
    color: '#bbb' 
  },
  quotePreview: { 
    fontSize: 13, 
    color: '#666', 
    fontStyle: 'italic', 
    marginBottom: 8 
  },
  contentText: { 
    fontSize: 15, 
    color: '#333', 
    lineHeight: 22 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyText: { 
    marginTop: 10, 
    color: '#999', 
    fontSize: 16 
  }
});