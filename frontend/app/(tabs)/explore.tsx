import { Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { getApiBaseUrl } from '@/lib/api';
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
  const clearSession = useSessionStore((state) => state.clearSession);
  const apiBaseUrl = getApiBaseUrl();

  function handleLogout() {
    clearSession();
    router.replace('/login');
  }

  return (
    <View className="flex-1 bg-background px-6 pt-20">
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
        <Text className="text-lg font-bold text-textBase">Ambiente atual</Text>

        <View className="mt-4 rounded-2xl bg-background px-4 py-4">
          <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-textMuted">
            API
          </Text>
          <Text className="mt-2 text-sm leading-6 text-textBase">{apiBaseUrl}</Text>
        </View>

        <View className="mt-4 rounded-2xl bg-background px-4 py-4">
          <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-textMuted">
            Proximo passo
          </Text>
          <Text className="mt-2 text-sm leading-6 text-textBase">
            A partir daqui, da para evoluir para setores, membros, eventos e escalas vinculados a
            uma igreja especifica.
          </Text>
        </View>
      </View>

      <TouchableOpacity
        className="mt-8 flex-row items-center justify-center rounded-2xl bg-danger py-4"
        onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={18} color="#FFFFFF" />
        <Text className="ml-2 text-base font-bold text-white">Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}
