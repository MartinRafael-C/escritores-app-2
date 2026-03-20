import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, Alert, Dimensions, TouchableOpacity } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');
const qrSize = width * 0.7;

export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  if (!permission) return <View style={styles.container} />;
  
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Ionicons name="camera-outline" size={80} color="#ccc" />
        <Text style={styles.permissionText}>
          Necesitamos permiso para usar la cámara y escanear las obras.
        </Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Conceder Permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);

    // VALIDACIÓN DEL FORMATO PROPIO: ESCAPP:ID:TIPO
    if (!data.startsWith("ESCAPP:")) {
      Alert.alert(
        "Código no válido", 
        "Este QR no pertenece a un poema o microcuento de nuestra comunidad.",
        [{ text: "Reintentar", onPress: () => setScanned(false) }]
      );
      return;
    }

    const [_, id, tipo] = data.split(':');
    
    Alert.alert(
      "¡Obra detectada!", 
      `Has encontrado un ${tipo}. ¿Quieres leer su contenido?`,
      [
        { 
          text: "Cancelar", 
          onPress: () => setScanned(false), 
          style: "cancel" 
        },
        { 
          text: "Leer ahora", 
          onPress: () => {
            setScanned(false);
            // Navegamos a la pantalla de lectura que creamos
            router.push(`/reader/${id}`); 
          } 
        }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ["qr"],
        }}
      />
      
      {/* CAPA VISUAL DEL ESCÁNER */}
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer} />
        
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.focusedContainer}>
            <View style={styles.marker} />
            {/* Esquinas del recuadro */}
            <View style={[styles.corner, { top: 0, left: 0, borderTopWidth: 4, borderLeftWidth: 4 }]} />
            <View style={[styles.corner, { top: 0, right: 0, borderTopWidth: 4, borderRightWidth: 4 }]} />
            <View style={[styles.corner, { bottom: 0, left: 0, borderBottomWidth: 4, borderLeftWidth: 4 }]} />
            <View style={[styles.corner, { bottom: 0, right: 0, borderBottomWidth: 4, borderRightWidth: 4 }]} />
          </View>
          <View style={styles.unfocusedContainer} />
        </View>

        <View style={styles.unfocusedContainer}>
          <Text style={styles.instructions}>Apunta al código QR de la obra</Text>
          {scanned && (
            <TouchableOpacity style={styles.retryButton} onPress={() => setScanned(false)}>
              <Text style={styles.retryText}>Toca para reintentar</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center'
  },
  permissionText: {
    color: '#fff',
    textAlign: 'center',
    marginHorizontal: 40,
    marginVertical: 20,
    fontSize: 16
  },
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10
  },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  middleContainer: {
    flexDirection: 'row',
    height: qrSize,
  },
  focusedContainer: {
    width: qrSize,
    height: qrSize,
    backgroundColor: 'transparent',
    position: 'relative',
  },
  marker: {
    position: 'absolute',
    top: '50%',
    left: '5%',
    right: '5%',
    height: 2,
    backgroundColor: '#FF3B30',
    shadowColor: "#FF3B30",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 5,
    elevation: 5
  },
  corner: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: '#FFF',
  },
  instructions: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: 15,
    paddingVertical: 5,
    borderRadius: 20
  },
  retryButton: {
    marginTop: 30,
    padding: 15,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 10
  },
  retryText: { color: '#fff', fontWeight: 'bold' }
});