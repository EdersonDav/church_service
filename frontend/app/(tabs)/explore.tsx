import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { logout } from '@/lib/auth';
import { useSessionStore } from '@/stores/session-store';

function getInitials(name?: string | null) {
  if (!name) {
    return 'TC';
  }

  const parts = name.trim().split(/\s+/).slice(0, 2);
  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('');
}

export default function AccountScreen() {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const token = useSessionStore((state) => state.token);
  const clearSession = useSessionStore((state) => state.clearSession);

  async function handleLogout() {
    try {
      await logout();
    } finally {
      clearSession();
      router.replace('/login');
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 80, paddingBottom: 128 }}
      showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ headerShown: false }} />

      <Text className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Conta</Text>
      <Text className="mt-3 text-3xl font-extrabold text-textBase">Sessao e identidade</Text>
      <Text className="mt-3 text-base leading-6 text-textMuted">
        Esta area consolida os dados atuais do utilizador e deixa o fluxo pronto para futuras
        configuracoes de perfil.
      </Text>

      <View className="mt-8 rounded-[32px] bg-surface px-6 py-6">
        <View className="flex-row items-center">
          <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
            <Text className="text-xl font-extrabold text-white">{getInitials(user?.name)}</Text>
          </View>

          <View className="ml-4 flex-1">
            <Text className="text-2xl font-bold text-textBase">
              {user?.name || 'Usuario autenticado'}
            </Text>
            <Text className="mt-1 text-sm text-textMuted">{user?.email || 'Sem e-mail'}</Text>
          </View>
        </View>

        <View className="mt-6 rounded-[24px] bg-background px-4 py-4">
          <View className="flex-row items-center">
            <Ionicons name="shield-checkmark-outline" size={18} color="#10B981" />
            <Text className="ml-2 text-sm font-semibold uppercase tracking-[0.18em] text-success">
              Sessao persistida
            </Text>
          </View>
          <Text className="mt-3 text-sm leading-6 text-textMuted">
            O token de autenticacao fica salvo localmente e o app restaura a sessao ao abrir
            novamente.
          </Text>
        </View>
      </View>

      <View className="mt-6 rounded-[28px] border border-surfaceAlt bg-surface px-5 py-5">
        <Text className="text-lg font-bold text-textBase">Informacoes da conta</Text>

        <View className="mt-4 rounded-2xl bg-background px-4 py-4">
          <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-textMuted">
            Nome
          </Text>
          <Text className="mt-2 text-sm leading-6 text-textBase">
            {user?.name || 'Nome nao informado'}
          </Text>
        </View>

        <View className="mt-4 rounded-2xl bg-background px-4 py-4">
          <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-textMuted">
            E-mail
          </Text>
          <Text className="mt-2 text-sm leading-6 text-textBase">
            {user?.email || 'E-mail nao informado'}
          </Text>
        </View>

        <View className="mt-4 rounded-2xl bg-background px-4 py-4">
          <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-textMuted">
            Status
          </Text>
          <Text className="mt-2 text-sm leading-6 text-textBase">
            {token ? 'Conta autenticada' : 'Sessao inativa'}
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className="mt-8 flex-row items-center justify-center rounded-2xl bg-danger py-4"
        onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
        <Text className="ml-2 text-base font-bold text-white">Sair da conta</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
