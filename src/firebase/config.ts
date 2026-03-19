import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// Importamos todo de 'firebase/auth' normalmente
import * as authModule from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyDeLJ6KXjV8eDqz7feI_1lV1D3FaU4VO2I",
  authDomain: "escritores-app-2.firebaseapp.com",
  projectId: "escritores-app-2",
  storageBucket: "escritores-app-2.firebasestorage.app",
  messagingSenderId: "113302791360",
  appId: "1:113302791360:web:cef56d99479634f56c3925",
  measurementId: "G-S6M45K5STK"
};

const app = initializeApp(firebaseConfig);

// Usamos esta forma para evitar el error de tipos de TypeScript
// pero manteniendo la funcionalidad de persistencia en React Native
const auth = (authModule as any).getReactNativePersistence 
  ? (authModule as any).initializeAuth(app, {
      persistence: (authModule as any).getReactNativePersistence(AsyncStorage)
    })
  : authModule.getAuth(app);

export { auth };
export const db = getFirestore(app);