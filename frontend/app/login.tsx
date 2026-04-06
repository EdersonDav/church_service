import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';

export default function LoginScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
        
        {/* Container Limitador e Posicionador (Esquerda no Desktop, Centralizado no Mobile) */}
        <View className="w-full max-w-[480px] px-6 md:px-12 lg:ml-20">
          
          {/* Cabeçalho */}
          <View className="mb-10 mt-8">
            <View className="flex-row items-center mb-2">
              <Text className="text-5xl font-extrabold text-white tracking-tight">
                The
              </Text>
              <Text className="text-5xl font-extrabold text-primary tracking-tight ml-3">
                Church
              </Text>
            </View>
            <Text className="text-textMuted text-lg leading-6">
              Acesse sua conta para organizar e gerenciar suas escalas com facilidade.
            </Text>
          </View>

          {/* Formulário */}
          <View className="flex-col gap-6">
            <View>
              <Text className="text-textMuted font-semibold ml-1 text-sm uppercase tracking-wider mb-2.5">E-mail</Text>
              <TextInput
                className="w-full text-textBase bg-surface border border-surfaceAlt rounded-2xl px-5 py-4 text-base focus:border-primary"
                placeholder="Digite seu e-mail"
                placeholderTextColor="#475569" // slate-600
                keyboardType="email-address"
                autoCapitalize="none"
                cursorColor="#6366F1"
              />
            </View>

            <View>
              <Text className="text-textMuted font-semibold ml-1 text-sm uppercase tracking-wider mb-2.5">Senha</Text>
              <TextInput
                className="w-full text-textBase bg-surface border border-surfaceAlt rounded-2xl px-5 py-4 text-base focus:border-primary"
                placeholder="Sua senha secreta"
                placeholderTextColor="#475569"
                secureTextEntry
                cursorColor="#6366F1"
              />
            </View>

            <TouchableOpacity className="self-end mt-1">
              <Text className="text-primary font-bold text-sm">Esqueceu a senha?</Text>
            </TouchableOpacity>
          </View>

          {/* Botão de Ação */}
          <TouchableOpacity
            className="w-full bg-primary rounded-2xl py-4 mt-8 items-center justify-center flex-row space-x-2 shadow-lg shadow-primary/30 active:bg-primaryHover"
            onPress={() => router.push('/(tabs)')}
          >
            <Text className="text-white font-bold text-lg">Entrar</Text>
          </TouchableOpacity>

          {/* Rodapé Dinâmico */}
          <View className="flex-row justify-center mt-8 mb-4">
            <Text className="text-textMuted text-base">Ainda não tem conta? </Text>
            <TouchableOpacity onPress={() => router.push('/register')}>
              <Text className="text-primary font-bold text-base">Registrar agora</Text>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    </View>
  );
}
