import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ApiError } from '@/lib/api';
import { Church, createChurch, listChurches } from '@/lib/churches';
import { useSessionStore } from '@/stores/session-store';

function formatCreatedAt(value?: string) {
  if (!value) {
    return 'Sem data registrada';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Sem data registrada';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

export default function ChurchesScreen() {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const [churches, setChurches] = useState<Church[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [createErrorMessage, setCreateErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);

  useEffect(() => {
    void loadChurches();
  }, []);

  async function loadChurches(isPullToRefresh = false) {
    try {
      if (isPullToRefresh) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      setErrorMessage('');
      const data = await listChurches();
      setChurches(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Nao foi possivel carregar as igrejas agora.');
      }
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }

  async function handleCreateChurch() {
    if (!name.trim()) {
      setCreateErrorMessage('Informe o nome da igreja.');
      return;
    }

    try {
      setIsSubmitting(true);
      setCreateErrorMessage('');

      const church = await createChurch({
        name: name.trim(),
        description: description.trim() || undefined,
      });

      setName('');
      setDescription('');
      setIsComposerOpen(false);
      await loadChurches(true);

      router.push({
        pathname: '/church/[churchId]',
        params: {
          churchId: church.id,
          name: church.name,
          description: church.description ?? '',
        },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setCreateErrorMessage(error.message);
      } else {
        setCreateErrorMessage('Nao foi possivel criar a igreja agora.');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <KeyboardAvoidingView
      className="flex-1 bg-background"
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 24 : 0}>
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 72, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => loadChurches(true)} />
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="mb-8 flex-row items-start justify-between">
          <View className="mr-4 flex-1">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Proximas Telas
            </Text>
            <Text className="text-3xl font-extrabold text-textBase">
              Igrejas, setores e eventos em um fluxo real.
            </Text>
            <Text className="mt-3 text-base leading-6 text-textMuted">
              {user?.name
                ? `${user.name}, escolha uma igreja existente ou crie a sua para começar a estruturar os ministérios.`
                : 'Escolha uma igreja existente ou crie a sua para começar a estruturar os ministérios.'}
            </Text>
          </View>

          <TouchableOpacity
            className="rounded-full bg-surfaceAlt p-3"
            onPress={() => loadChurches(true)}
            disabled={isRefreshing || isLoading}>
            <Ionicons name="refresh-outline" size={22} color="#F8FAFC" />
          </TouchableOpacity>
        </View>

        <View className="mb-8 overflow-hidden rounded-[28px] bg-surface px-5 py-6">
          <View className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/20" />
          <Text className="text-sm font-semibold uppercase tracking-[0.24em] text-primary">
            Panorama
          </Text>
          <Text className="mt-3 text-4xl font-extrabold text-textBase">{churches.length}</Text>
          <Text className="mt-1 text-base text-textMuted">
            igrejas cadastradas atualmente na plataforma.
          </Text>

          <TouchableOpacity
            className="mt-5 self-start rounded-2xl bg-primary px-5 py-3"
            onPress={() => setIsComposerOpen((current) => !current)}>
            <Text className="font-bold text-white">
              {isComposerOpen ? 'Fechar formulario' : 'Criar nova igreja'}
            </Text>
          </TouchableOpacity>
        </View>

        {isComposerOpen && (
          <View className="mb-8 rounded-[28px] border border-surfaceAlt bg-surface px-5 py-5">
            <Text className="text-xl font-bold text-textBase">Nova igreja</Text>
            <Text className="mt-2 text-sm leading-6 text-textMuted">
              O criador entra como administrador automaticamente no backend atual.
            </Text>

            <View className="mt-5 gap-4">
              <View>
                <Text className="mb-2 ml-1 text-sm font-semibold uppercase tracking-wider text-textMuted">
                  Nome
                </Text>
                <TextInput
                  className="rounded-2xl border border-surfaceAlt bg-background px-4 py-4 text-base text-textBase"
                  placeholder="Ex: Igreja Vida em Cristo"
                  placeholderTextColor="#64748B"
                  cursorColor="#6366F1"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View>
                <Text className="mb-2 ml-1 text-sm font-semibold uppercase tracking-wider text-textMuted">
                  Descricao
                </Text>
                <TextInput
                  className="min-h-[104px] rounded-2xl border border-surfaceAlt bg-background px-4 py-4 text-base text-textBase"
                  placeholder="Comunidade localizada no centro da cidade"
                  placeholderTextColor="#64748B"
                  cursorColor="#6366F1"
                  multiline
                  textAlignVertical="top"
                  value={description}
                  onChangeText={setDescription}
                />
              </View>
            </View>

            {!!createErrorMessage && (
              <View className="mt-4 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
                <Text className="text-sm text-danger">{createErrorMessage}</Text>
              </View>
            )}

            <TouchableOpacity
              className={`mt-5 items-center rounded-2xl py-4 ${
                isSubmitting ? 'bg-surfaceAlt' : 'bg-primary'
              }`}
              onPress={handleCreateChurch}
              disabled={isSubmitting}>
              <Text className="text-base font-bold text-white">
                {isSubmitting ? 'Criando igreja...' : 'Salvar igreja'}
              </Text>
            </TouchableOpacity>
          </View>
        )}

        <View className="mb-4 flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-textBase">Igrejas cadastradas</Text>
          <Text className="text-sm text-textMuted">Toque para abrir</Text>
        </View>

        {!!errorMessage && (
          <View className="mb-4 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
            <Text className="text-sm text-danger">{errorMessage}</Text>
          </View>
        )}

        {isLoading ? (
          <View className="items-center rounded-[28px] bg-surface px-5 py-10">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="mt-4 text-sm text-textMuted">Carregando igrejas...</Text>
          </View>
        ) : null}

        {!isLoading && churches.length === 0 ? (
          <View className="rounded-[28px] border border-dashed border-surfaceAlt bg-surface px-6 py-10">
            <Text className="text-xl font-bold text-textBase">Nenhuma igreja por aqui ainda</Text>
            <Text className="mt-3 text-base leading-6 text-textMuted">
              Crie a primeira igreja para iniciar o cadastro de setores, eventos e escalas.
            </Text>
          </View>
        ) : null}

        {!isLoading &&
          churches.map((church) => (
            <TouchableOpacity
              key={church.id}
              className="mb-4 rounded-[28px] border border-surfaceAlt bg-surface px-5 py-5"
              onPress={() =>
                router.push({
                  pathname: '/church/[churchId]',
                  params: {
                    churchId: church.id,
                    name: church.name,
                    description: church.description ?? '',
                  },
                })
              }>
              <View className="flex-row items-start justify-between">
                <View className="mr-4 flex-1">
                  <Text className="text-xl font-bold text-textBase">{church.name}</Text>
                  <Text className="mt-2 text-sm leading-6 text-textMuted">
                    {church.description?.trim() || 'Sem descricao cadastrada no momento.'}
                  </Text>
                </View>

                <View className="rounded-full bg-background p-3">
                  <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
                </View>
              </View>

              <View className="mt-5 flex-row items-center justify-between">
                <View className="rounded-full bg-background px-3 py-2">
                  <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-accent">
                    Igreja
                  </Text>
                </View>
                <Text className="text-sm text-textMuted">
                  Criada em {formatCreatedAt(church.created_at)}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
