import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '../../src/lib/supabase';
import { useRouter, Link } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';

const registerSchema = z.object({
  email: z.string().email("Introduce un correo válido"),
  password: z.string().min(6, "Mínimo 6 caracteres"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterScreen() {
  const router = useRouter();
  const { control, handleSubmit, formState: { errors } } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema)
  });

  const onRegister = async (data: RegisterFormData) => {
    const { error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
    });

    if (error) {
      Alert.alert("Error", error.message);
    } else {
      Alert.alert("¡Éxito!", "Cuenta creada. Por favor, revisa tu correo para confirmar tu registro antes de iniciar sesión.");
      router.replace('/login');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Únete a la logia</Text>
        <Text style={styles.subtitle}>Crea tu cuenta para guardar tus obras.</Text>

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput 
              style={styles.input} 
              placeholder="Correo electrónico" 
              value={value} 
              onChangeText={onChange} 
              autoCapitalize="none"
              keyboardType="email-address"
            />
          )}
        />
        {errors.email && <Text style={styles.errorText}>{errors.email.message}</Text>}

        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, value } }) => (
            <TextInput 
              style={styles.input} 
              placeholder="Contraseña" 
              secureTextEntry 
              value={value} 
              onChangeText={onChange} 
            />
          )}
        />
        {errors.password && <Text style={styles.errorText}>{errors.password.message}</Text>}

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value } }) => (
            <TextInput 
              style={styles.input} 
              placeholder="Confirmar contraseña" 
              secureTextEntry 
              value={value} 
              onChangeText={onChange} 
            />
          )}
        />
        {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>}

        <TouchableOpacity style={styles.button} onPress={handleSubmit(onRegister)}>
          <Text style={styles.buttonText}>Registrarse</Text>
        </TouchableOpacity>

        <Link href="/login" asChild>
          <TouchableOpacity style={styles.link}>
            <Text style={styles.linkText}>¿Ya tienes cuenta? Inicia sesión</Text>
          </TouchableOpacity>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  container: { 
    padding: 30, 
    justifyContent: 'center', 
    flexGrow: 1 
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: '#1a1a1a',
    marginBottom: 5
  },
  subtitle: { 
    fontSize: 16, 
    color: '#666', 
    marginBottom: 30 
  },
  input: { 
    backgroundColor: '#f5f5f5', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 10, 
    fontSize: 16 
  },
  button: { 
    backgroundColor: '#000', 
    padding: 18, 
    borderRadius: 10, 
    alignItems: 'center', 
    marginTop: 10 
  },
  buttonText: { 
    color: '#fff', 
    fontWeight: 'bold', 
    fontSize: 16 
  },
  errorText: { 
    color: '#ff4444', 
    fontSize: 12, 
    marginBottom: 10,
    marginLeft: 5
  },
  link: { 
    marginTop: 20, 
    alignItems: 'center' 
  },
  linkText: { 
    color: '#666', 
    textDecorationLine: 'underline' 
  }
});