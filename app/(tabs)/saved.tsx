import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  TouchableOpacity, 
  Modal, 
  Alert, 
  ActivityIndicator 
} from 'react-native';
import { supabase } from '../../src/lib/supabase';
import { Ionicons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SavedWorksScreen() {
  const [works, setWorks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedWork, setSelectedWork] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchWorks();
  }, []);

  const fetchWorks = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('escritos')
        .select('*')
        .order('fecha', { ascending: false }); // Usamos 'fecha' según tu SQL

      if (error) throw error;
      setWorks(data || []);
    } catch (error: any) {
      Alert.alert("Error", error.message);
    } finally {
      setLoading(false);
    }
  };

  const openQR = (work: any) => {
    setSelectedWork(work);
    setModalVisible(true);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.cardContent}>
        <View style={styles.headerCard}>
          <Text style={styles.typeTag}>{item.tipo.toUpperCase()}</Text>
          <Text style={styles.date}>
            {new Date(item.fecha).toLocaleDateString()}
          </Text>
        </View>
        <Text style={styles.workText} numberOfLines={3}>{item.texto}</Text>
        {item.cita_inspiracion && (
          <Text style={styles.quoteText}>— {item.cita_inspiracion}</Text>
        )}
      </View>
      
      <TouchableOpacity style={styles.qrButton} onPress={() => openQR(item)}>
        <Ionicons name="qr-code-outline" size={28} color="#007AFF" />
        <Text style={styles.qrText}>GENERAR</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mis Obras</Text>
        <TouchableOpacity onPress={fetchWorks}>
          <Ionicons name="refresh" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#000" style={{ marginTop: 50 }} />
      ) : (
        <FlatList
          data={works}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={
            <Text style={styles.emptyText}>Aún no has guardado ninguna obra.</Text>
          }
        />
      )}

      {/* MODAL PARA MOSTRAR EL QR */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <TouchableOpacity 
              style={styles.closeIcon} 
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={28} color="#000" />
            </TouchableOpacity>

            <Text style={styles.modalTitle}>Código de Obra</Text>
            
            {selectedWork && (
              <View style={styles.qrContainer}>
                <QRCode
                  value={`ESCAPP:${selectedWork.id}:${selectedWork.tipo}`}
                  size={220}
                  color="black"
                  backgroundColor="white"
                />
              </View>
            )}
            
            <Text style={styles.modalType}>{selectedWork?.tipo.toUpperCase()}</Text>
            <Text style={styles.modalInstruction}>
              Escanea este código desde otra app de Escritores para compartir.
            </Text>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F2F2F7' },
  header: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    paddingHorizontal: 20, 
    paddingVertical: 15 
  },
  title: { fontSize: 28, fontWeight: 'bold', color: '#1C1C1E' },
  listContainer: { padding: 15 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardContent: { flex: 1, paddingRight: 10 },
  headerCard: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  typeTag: { fontSize: 11, fontWeight: '800', color: '#007AFF', letterSpacing: 1 },
  workText: { fontSize: 16, color: '#3A3A3C', lineHeight: 22, fontStyle: 'italic' },
  quoteText: { fontSize: 12, color: '#8E8E93', marginTop: 8 },
  date: { fontSize: 12, color: '#AEAEB2' },
  qrButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingLeft: 15,
    borderLeftWidth: 1,
    borderLeftColor: '#E5E5EA',
  },
  qrText: { fontSize: 9, fontWeight: 'bold', color: '#007AFF', marginTop: 4 },
  emptyText: { textAlign: 'center', marginTop: 50, color: '#8E8E93', fontSize: 16 },
  
  // Estilos del Modal
  modalOverlay: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: 'rgba(0,0,0,0.6)' 
  },
  modalView: {
    width: '85%',
    backgroundColor: 'white',
    borderRadius: 25,
    padding: 25,
    alignItems: 'center',
    position: 'relative',
  },
  closeIcon: { position: 'absolute', top: 15, right: 15 },
  modalTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  qrContainer: {
    padding: 15,
    backgroundColor: '#fff',
    borderRadius: 15,
    borderWidth: 1,
    borderColor: '#F2F2F7',
  },
  modalType: { marginTop: 15, fontSize: 14, fontWeight: 'bold', color: '#007AFF' },
  modalInstruction: { 
    marginTop: 10, 
    fontSize: 13, 
    color: '#636366', 
    textAlign: 'center',
    paddingHorizontal: 10 
  },
});