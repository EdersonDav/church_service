import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Redirect, Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ApiError } from '@/lib/api';
import { forgotPassword, login } from '@/lib/auth';
import { useScrollToFocusedInput } from '@/hooks/use-scroll-to-focused-input';
import { useSessionStore } from '@/stores/session-store';

export default function LoginScreen() {
  const router = useRouter();
  const token = useSessionStore((state) => state.token);
  const setSession = useSessionStore((state) => state.setSession);
  const { scrollViewRef, scrollToFocusedInput } = useScrollToFocusedInput();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isForgotPasswordOpen, setIsForgotPasswordOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetErrorMessage, setResetErrorMessage] = useState('');
  const [resetSuccessMessage, setResetSuccessMessage] = useState('');
  const [isResetSubmitting, setIsResetSubmitting] = useState(false);

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

  async function handleForgotPassword() {
    if (!resetEmail.trim()) {
      setResetErrorMessage('Informe seu e-mail para recuperar a senha.');
      return;
    }

    try {
      setIsResetSubmitting(true);
      setResetErrorMessage('');
      setResetSuccessMessage('');

      await forgotPassword(resetEmail.trim().toLowerCase());

      setResetSuccessMessage('Enviamos as instrucoes de recuperacao para o seu e-mail.');
    } catch (error) {
      if (error instanceof ApiError) {
        setResetErrorMessage(error.message);
      } else {
        setResetErrorMessage('Nao foi possivel enviar a recuperacao agora. Tente novamente.');
      }
    } finally {
      setIsResetSubmitting(false);
    }
  }

  function openForgotPassword() {
    setResetEmail(email.trim().toLowerCase());
    setResetErrorMessage('');
    setResetSuccessMessage('');
    setIsForgotPasswordOpen(true);
  }

  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingVertical: 24 }}
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        showsVerticalScrollIndicator={false}>
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
                onFocus={scrollToFocusedInput}
                value={email}
                onChangeText={setEmail}
              />
            </View>

            <View>
              <Text className="text-textMuted font-semibold ml-1 text-sm uppercase tracking-wider mb-2.5">
                Senha
              </Text>
              <View className="relative">
                <TextInput
                  className="w-full text-textBase bg-surface border border-surfaceAlt rounded-2xl px-5 py-4 pr-14 text-base focus:border-primary"
                  placeholder="Sua senha secreta"
                  placeholderTextColor="#475569"
                  secureTextEntry={!isPasswordVisible}
                  cursorColor="#6366F1"
                  onFocus={scrollToFocusedInput}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  className="absolute right-4 top-0 bottom-0 justify-center"
                  onPress={() => setIsPasswordVisible((current) => !current)}
                  hitSlop={10}>
                  <Ionicons
                    name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity className="self-end mt-1" onPress={openForgotPassword}>
              <Text className="text-primary font-bold text-sm">Esqueceu a senha?</Text>
            </TouchableOpacity>

            {isForgotPasswordOpen && (
              <View className="rounded-[28px] border border-surfaceAlt bg-surface px-5 py-5">
                <View className="flex-row items-start justify-between">
                  <View className="mr-4 flex-1">
                    <Text className="text-lg font-bold text-textBase">Recuperar senha</Text>
                    <Text className="mt-2 text-sm leading-6 text-textMuted">
                      Informe seu e-mail e enviaremos um link para redefinir sua senha.
                    </Text>
                  </View>

                  <TouchableOpacity
                    className="h-9 w-9 items-center justify-center rounded-full bg-background"
                    onPress={() => setIsForgotPasswordOpen(false)}>
                    <Ionicons name="close-outline" size={22} color="#F8FAFC" />
                  </TouchableOpacity>
                </View>

                <View className="mt-5">
                  <Text className="text-textMuted font-semibold ml-1 text-sm uppercase tracking-wider mb-2.5">
                    E-mail
                  </Text>
                  <TextInput
                    className="w-full text-textBase bg-background border border-surfaceAlt rounded-2xl px-5 py-4 text-base focus:border-primary"
                    placeholder="Digite seu e-mail"
                    placeholderTextColor="#475569"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    cursorColor="#6366F1"
                    onFocus={scrollToFocusedInput}
                    value={resetEmail}
                    onChangeText={setResetEmail}
                  />
                </View>

                {!!resetErrorMessage && (
                  <View className="mt-4 bg-danger/15 border border-danger/40 rounded-2xl px-4 py-3">
                    <Text className="text-danger text-sm">{resetErrorMessage}</Text>
                  </View>
                )}

                {!!resetSuccessMessage && (
                  <View className="mt-4 rounded-2xl border border-success/40 bg-success/10 px-4 py-3">
                    <Text className="text-success text-sm">{resetSuccessMessage}</Text>
                  </View>
                )}

                <TouchableOpacity
                  className={`mt-5 items-center rounded-2xl py-4 ${
                    isResetSubmitting ? 'bg-surfaceAlt' : 'bg-primary'
                  }`}
                  onPress={handleForgotPassword}
                  disabled={isResetSubmitting}>
                  <Text className="text-base font-bold text-white">
                    {isResetSubmitting ? 'Enviando...' : 'Enviar link de recuperacao'}
                  </Text>
                </TouchableOpacity>
              </View>
            )}

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
    </KeyboardAvoidingView>
  );
}
