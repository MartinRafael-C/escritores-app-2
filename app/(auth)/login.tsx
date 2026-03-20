import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { supabase } from '../../src/lib/supabase';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function LoginScreen() {
  const router = useRouter();
  const { control, handleSubmit } = useForm();

  const onLogin = async (data: any) => {
    const { error } = await supabase.auth.signInWithPassword({
      email: data.email,
      password: data.password,
    });

    if (error) Alert.alert("Error", error.message);
    else router.replace('/(tabs)');
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <Text style={styles.title}>Bienvenido</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} placeholder="Email" value={value} onChangeText={onChange} autoCapitalize="none" />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput style={styles.input} placeholder="Contraseña" secureTextEntry value={value} onChangeText={onChange} />
          )}
        />
        <TouchableOpacity style={styles.button} onPress={handleSubmit(onLogin)}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>
        <Link href="/register" asChild>
          <TouchableOpacity style={styles.link}><Text>Crear cuenta</Text></TouchableOpacity>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#fff' },
  container: { flex: 1, padding: 30, justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  input: { backgroundColor: '#f5f5f5', padding: 15, borderRadius: 10, marginBottom: 10 },
  button: { backgroundColor: '#000', padding: 18, borderRadius: 10, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
  link: { marginTop: 20, alignItems: 'center' }
});