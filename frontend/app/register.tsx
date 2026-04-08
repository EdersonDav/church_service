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
import { useScrollToFocusedInput } from '@/hooks/use-scroll-to-focused-input';
import { register } from '@/lib/auth';
import { useSessionStore } from '@/stores/session-store';

export default function RegisterScreen() {
  const router = useRouter();
  const token = useSessionStore((state) => state.token);
  const { scrollViewRef, scrollToFocusedInput } = useScrollToFocusedInput();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleRegister() {
    if (!name.trim() || !email.trim() || !password || !confirmPassword) {
      setErrorMessage('Preencha todos os campos para criar a conta.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMessage('A confirmacao da senha precisa ser igual a senha informada.');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage('');
      setSuccessMessage('');

      const response = await register({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
      });

      if (response.message === 'Verify your email') {
        setSuccessMessage('Conta criada. Agora confirme o codigo enviado para seu e-mail.');

        setTimeout(() => {
          router.replace({
            pathname: '/verify-code',
            params: { email: email.trim().toLowerCase() },
          });
        }, 900);

        return;
      }

      setSuccessMessage('Conta criada com sucesso.');

      setTimeout(() => {
        router.replace('/login');
      }, 1200);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
        return;
      }

      setErrorMessage('Nao foi possivel criar sua conta agora. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  }

  if (token) {
    return <Redirect href="/(tabs)" />;
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
              Criar Conta
            </Text>
            <Text className="text-textMuted text-base leading-6">
              Junte-se a plataforma e acompanhe sua agenda ministerial.
            </Text>
          </View>

          <View className="flex-col gap-6">
            <View>
              <Text className="text-textMuted font-semibold ml-1 text-sm uppercase tracking-wider mb-2.5">
                Nome Completo
              </Text>
              <TextInput
                className="w-full text-textBase bg-surface border border-surfaceAlt rounded-2xl px-5 py-4 text-base focus:border-primary"
                placeholder="Ex: Joao da Silva"
                placeholderTextColor="#475569"
                autoCapitalize="words"
                cursorColor="#6366F1"
                onFocus={scrollToFocusedInput}
                value={name}
                onChangeText={setName}
              />
            </View>

            <View>
              <Text className="text-textMuted font-semibold ml-1 text-sm uppercase tracking-wider mb-2.5">
                E-mail
              </Text>
              <TextInput
                className="w-full text-textBase bg-surface border border-surfaceAlt rounded-2xl px-5 py-4 text-base focus:border-primary"
                placeholder="seuemail@exemplo.com"
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
                  placeholder="Minimo de 8 caracteres"
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

            <View>
              <Text className="text-textMuted font-semibold ml-1 text-sm uppercase tracking-wider mb-2.5">
                Confirmar Senha
              </Text>
              <View className="relative">
                <TextInput
                  className="w-full text-textBase bg-surface border border-surfaceAlt rounded-2xl px-5 py-4 pr-14 text-base focus:border-primary"
                  placeholder="Repita sua senha"
                  placeholderTextColor="#475569"
                  secureTextEntry={!isConfirmPasswordVisible}
                  cursorColor="#6366F1"
                  onFocus={scrollToFocusedInput}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                  className="absolute right-4 top-0 bottom-0 justify-center"
                  onPress={() => setIsConfirmPasswordVisible((current) => !current)}
                  hitSlop={10}>
                  <Ionicons
                    name={isConfirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'}
                    size={22}
                    color="#94A3B8"
                  />
                </TouchableOpacity>
              </View>
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
            onPress={handleRegister}
            disabled={isSubmitting}>
            <Text className="text-white font-bold text-lg">
              {isSubmitting ? 'Criando conta...' : 'Criar minha conta'}
            </Text>
          </TouchableOpacity>

          <Text className="text-textMuted text-xs text-center mt-6 leading-5 px-4">
            Ao se registrar, voce concorda com nossos <Text className="text-primary">Termos de Servico</Text> e{' '}
            <Text className="text-primary">Politica de Privacidade</Text>.
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
