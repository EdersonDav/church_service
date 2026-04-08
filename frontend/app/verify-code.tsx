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
import { Redirect, Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ApiError } from '@/lib/api';
import { resendVerifyCode, verifyCode } from '@/lib/auth';
import { useScrollToFocusedInput } from '@/hooks/use-scroll-to-focused-input';
import { useSessionStore } from '@/stores/session-store';

export default function VerifyCodeScreen() {
  const router = useRouter();
  const { email } = useLocalSearchParams<{ email?: string }>();
  const token = useSessionStore((state) => state.token);
  const { scrollViewRef, scrollToFocusedInput } = useScrollToFocusedInput();
  const [code, setCode] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);

  if (token) {
    return <Redirect href="/(tabs)" />;
  }

  if (!email) {
    return <Redirect href="/register" />;
  }

  const verifiedEmail = email;

  async function handleVerifyCode() {
    if (code.trim().length !== 6) {
      setErrorMessage('Informe o codigo de 6 digitos enviado por e-mail.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await verifyCode({
        email: verifiedEmail,
        code: code.trim(),
      });

      if (response.data.message !== 'User verified successfully') {
        setErrorMessage('Codigo invalido ou expirado. Tente novamente.');
        return;
      }

      setSuccessMessage('Conta verificada com sucesso. Agora voce ja pode entrar.');

      setTimeout(() => {
        router.replace('/login');
      }, 1200);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage('Nao foi possivel validar o codigo agora. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendCode() {
    try {
      setIsResending(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await resendVerifyCode(verifiedEmail);

      if (response.data.message !== 'Verification code resent successfully') {
        setErrorMessage('Nao foi possivel reenviar o codigo agora.');
        return;
      }

      setSuccessMessage('Enviamos um novo codigo para o seu e-mail.');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage('Nao foi possivel reenviar o codigo agora.');
    } finally {
      setIsResending(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background pt-16"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 24 }}
        automaticallyAdjustKeyboardInsets
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode={Platform.OS === 'ios' ? 'interactive' : 'on-drag'}
        showsVerticalScrollIndicator={false}>
        <View className="w-full max-w-[480px] px-6 md:px-12 lg:ml-20 pb-10">
          <TouchableOpacity
            className="mb-6 w-10 h-10 items-center justify-center rounded-full bg-surface"
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
          </TouchableOpacity>

          <View className="mb-10">
            <Text className="text-3xl font-extrabold text-white tracking-tight mb-2">
              Verificar Conta
            </Text>
            <Text className="text-textMuted text-base leading-6">
              Digite o codigo enviado para <Text className="text-textBase">{verifiedEmail}</Text>.
            </Text>
          </View>

          <View className="flex-col gap-6">
            <View>
              <Text className="text-textMuted font-semibold ml-1 text-sm uppercase tracking-wider mb-2.5">
                Codigo
              </Text>
              <TextInput
                className="w-full text-textBase bg-surface border border-surfaceAlt rounded-2xl px-5 py-4 text-base tracking-[0.4em]"
                placeholder="123456"
                placeholderTextColor="#475569"
                keyboardType="number-pad"
                autoCapitalize="none"
                autoCorrect={false}
                maxLength={6}
                cursorColor="#6366F1"
                onFocus={scrollToFocusedInput}
                value={code}
                onChangeText={(value) => setCode(value.replace(/\D/g, ''))}
              />
            </View>

            {!!errorMessage && (
              <View className="bg-danger/15 border border-danger/40 rounded-2xl px-4 py-3">
                <Text className="text-danger text-sm">{errorMessage}</Text>
              </View>
            )}

            {!!successMessage && (
              <View className="bg-success/15 border border-success/40 rounded-2xl px-4 py-3">
                <Text className="text-success text-sm">{successMessage}</Text>
              </View>
            )}
          </View>

          <TouchableOpacity
            className={`w-full rounded-2xl py-4 mt-10 items-center justify-center flex-row space-x-2 shadow-lg shadow-primary/30 ${
              isSubmitting ? 'bg-surfaceAlt' : 'bg-primary active:bg-primaryHover'
            }`}
            onPress={handleVerifyCode}
            disabled={isSubmitting}>
            <Text className="text-white font-bold text-lg">
              {isSubmitting ? 'Validando...' : 'Confirmar codigo'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-5 items-center"
            onPress={handleResendCode}
            disabled={isResending}>
            <Text className="text-primary font-bold text-base">
              {isResending ? 'Reenviando codigo...' : 'Reenviar codigo'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity className="mt-6 items-center" onPress={() => router.replace('/login')}>
            <Text className="text-primary font-bold text-base">Voltar para login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
