import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Redirect, Stack, useRouter } from 'expo-router';
import { ApiError } from '@/lib/api';
import { login } from '@/lib/auth';
import { useSessionStore } from '@/stores/session-store';

export default function LoginScreen() {
  const router = useRouter();
  const token = useSessionStore((state) => state.token);
  const setSession = useSessionStore((state) => state.setSession);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password) {
      setErrorMessage('Preencha e-mail e senha para entrar.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      const session = await login({
        email: email.trim().toLowerCase(),
        password,
      });

      setSession(session);
      router.replace('/(tabs)');
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 401 && error.message === 'Verify your email') {
          setErrorMessage('Seu e-mail ainda nao foi verificado. Confira sua caixa de entrada.');
        } else {
          setErrorMessage(error.message);
        }
        return;
      }

      setErrorMessage('Nao foi possivel entrar agora. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        <View className="w-full max-w-[480px] px-6 md:px-12 lg:ml-20">
          <View className="mb-10 mt-8">
            <View className="flex-row items-center mb-2">
              <Text className="text-5xl font-extrabold text-white tracking-tight">The</Text>
              <Text className="text-5xl font-extrabold text-primary tracking-tight ml-3">
                Church
              </Text>
            </View>
            <Text className="text-textMuted text-lg leading-6">
              Acesse sua conta para organizar e gerenciar suas escalas com facilidade.
            </Text>
          </View>

          <View className="flex-col gap-6">
            <View>
              <Text className="text-textMuted font-semibold ml-1 text-sm uppercase tracking-wider mb-2.5">
                E-mail
              </Text>
              <TextInput
                className="w-full text-textBase bg-surface border border-surfaceAlt rounded-2xl px-5 py-4 text-base focus:border-primary"
                placeholder="Digite seu e-mail"
                placeholderTextColor="#475569"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                cursorColor="#6366F1"
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text className="text-textMuted font-semibold ml-1 text-sm uppercase tracking-wider mb-2.5">
                Senha
              </Text>
              <TextInput
                className="w-full text-textBase bg-surface border border-surfaceAlt rounded-2xl px-5 py-4 text-base focus:border-primary"
                placeholder="Sua senha secreta"
                placeholderTextColor="#475569"
                secureTextEntry
                cursorColor="#6366F1"
                value={password}
                onChangeText={setPassword}
              />
            </View>

            <TouchableOpacity className="self-end mt-1">
              <Text className="text-primary font-bold text-sm">Esqueceu a senha?</Text>
            </TouchableOpacity>

            {!!errorMessage && (
              <View className="bg-danger/15 border border-danger/40 rounded-2xl px-4 py-3">
                <Text className="text-danger text-sm">{errorMessage}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            className={`w-full rounded-2xl py-4 mt-8 items-center justify-center flex-row space-x-2 shadow-lg shadow-primary/30 ${
              isSubmitting ? 'bg-surfaceAlt' : 'bg-primary active:bg-primaryHover'
            }`}
            onPress={handleLogin}
            disabled={isSubmitting}>
            <Text className="text-white font-bold text-lg">
              {isSubmitting ? 'Entrando...' : 'Entrar'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-8 mb-4">
            <Text className="text-textMuted text-base">Ainda nao tem conta? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text className="text-primary font-bold text-base">Registrar agora</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
