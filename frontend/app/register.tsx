import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function RegisterScreen() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-background pt-16">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} showsVerticalScrollIndicator={false}>

        {/* Container Limitador e Posicionador (Esquerda no Desktop, Centralizado no Mobile) */}
        <View className="w-full max-w-[480px] px-6 md:px-12 lg:ml-20 pb-10">

          {/* Botão de Voltar */}
          <TouchableOpacity className="mb-6 w-10 h-10 items-center justify-center rounded-full bg-surface" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={20} color="#F8FAFC" />
          </TouchableOpacity>

          {/* Cabeçalho */}
          <View className="mb-10">
            <Text className="text-3xl font-extrabold text-white tracking-tight mb-2">
              Criar Conta
            </Text>
            <Text className="text-textMuted text-base leading-6">
              Junte-se à plataforma e acompanhe sua agenda ministerial.
            </Text>
          </View>

          {/* Formulário */}
          <View className="flex-col gap-6">
            <View>
              <Text className="text-textMuted font-semibold ml-1 text-sm uppercase tracking-wider mb-2.5">Nome Completo</Text>
              <TextInput
                className="w-full text-textBase bg-surface border border-surfaceAlt rounded-2xl px-5 py-4 text-base focus:border-primary"
                placeholder="Ex: João da Silva"
                placeholderTextColor="#475569"
                autoCapitalize="words"
                cursorColor="#6366F1"
              />
            </View>

            <View>
              <Text className="text-textMuted font-semibold ml-1 text-sm uppercase tracking-wider mb-2.5">E-mail</Text>
              <TextInput
                className="w-full text-textBase bg-surface border border-surfaceAlt rounded-2xl px-5 py-4 text-base focus:border-primary"
                placeholder="seuemail@exemplo.com"
                placeholderTextColor="#475569"
                keyboardType="email-address"
                autoCapitalize="none"
                cursorColor="#6366F1"
              />
            </View>

            <View>
              <Text className="text-textMuted font-semibold ml-1 text-sm uppercase tracking-wider mb-2.5">Senha</Text>
              <TextInput
                className="w-full text-textBase bg-surface border border-surfaceAlt rounded-2xl px-5 py-4 text-base focus:border-primary"
                placeholder="Mínimo de 8 caracteres"
                placeholderTextColor="#475569"
                secureTextEntry
                cursorColor="#6366F1"
              />
            </View>

            <View>
              <Text className="text-textMuted font-semibold ml-1 text-sm uppercase tracking-wider mb-2.5">Confirmar Senha</Text>
              <TextInput
                className="w-full text-textBase bg-surface border border-surfaceAlt rounded-2xl px-5 py-4 text-base focus:border-primary"
                placeholder="Repita sua senha"
                placeholderTextColor="#475569"
                secureTextEntry
                cursorColor="#6366F1"
              />
            </View>
          </View>

          {/* Botão de Ação */}
          <TouchableOpacity
            className="w-full bg-primary rounded-2xl py-4 mt-10 items-center justify-center flex-row space-x-2 shadow-lg shadow-primary/30 active:bg-primaryHover"
            onPress={() => router.push('/(tabs)')}
          >
            <Text className="text-white font-bold text-lg">Criar minha conta</Text>
          </TouchableOpacity>

          {/* Termos e Condições */}
          <Text className="text-textMuted text-xs text-center mt-6 leading-5 px-4">
            Ao se registrar, você concorda com nossos <Text className="text-primary">Termos de Serviço</Text> e <Text className="text-primary">Política de Privacidade</Text>.
          </Text>

        </View>
      </ScrollView>
    </View>
  );
}
