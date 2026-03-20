import React, { useState } from 'react';
import { Text, View, StyleSheet, Button, Alert, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const qrSize = width * 0.7; // El cuadro de escaneo ocupará el 70% del ancho

export default function QRScanner() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const router = useRouter();

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center', marginBottom: 20 }}>
          Necesitamos permiso para usar la cámara y escanear tus obras.
        </Text>
        <Button onPress={requestPermission} title="Conceder Permiso" />
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    setScanned(true);

    // VALIDACIÓN DEL PREFIJO
    if (!data.startsWith("ESCAPP:")) {
      Alert.alert(
        "Código no válido", 
        "Este QR no es un microcuento o poema de esta aplicación.",
        [{ text: "Reintentar", onPress: () => setScanned(false) }]
      );
      return;
    }

    // Extraer datos: ESCAPP:ID:TIPO
    const [_, id, tipo] = data.split(':');
    
    Alert.alert(
      "¡Obra detectada!", 
      `Se ha encontrado un ${tipo}. ¿Deseas leerlo?`,
      [
        { text: "Cancelar", onPress: () => setScanned(false), style: "cancel" },
        { text: "Leer ahora", onPress: () => {
            setScanned(false);
            // Aquí podrías navegar al detalle: router.push(`/saved?id=${id}`);
        }}
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
      
      {/* CAPA DE DISEÑO (OVERLAY) */}
      <View style={styles.overlay}>
        <View style={styles.unfocusedContainer} />
        
        <View style={styles.middleContainer}>
          <View style={styles.unfocusedContainer} />
          <View style={styles.focusedContainer}>
            <View style={styles.marker} />
          </View>
          <View style={styles.unfocusedContainer} />
        </View>

        <View style={styles.unfocusedContainer}>
          <Text style={styles.instructions}>Apunta al código QR del poema</Text>
          {scanned && (
            <Button title="Escanear de nuevo" onPress={() => setScanned(false)} color="#fff" />
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
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  unfocusedContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
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
    borderWidth: 2,
    borderColor: '#fff',
    backgroundColor: 'transparent',
    position: 'relative',
  },
  marker: {
    position: 'absolute',
    top: '50%',
    left: '10%',
    right: '10%',
    height: 2,
    backgroundColor: '#FF3B30', // Línea roja de escaneo
  },
  instructions: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
    fontWeight: '600',
  },
});