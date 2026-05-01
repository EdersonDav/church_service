import { useEffect, useMemo, useState } from 'react';
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
import {
  Church,
  ChurchJoinRequest,
  approveChurchJoinRequest,
  createChurch,
  joinChurch,
  leaveChurch,
  listChurchJoinRequests,
  listChurches,
  searchChurches,
} from '@/lib/churches';
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

function normalizeSearch(value: string) {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

export default function ChurchesScreen() {
  const router = useRouter();
  const user = useSessionStore((state) => state.user);
  const [churches, setChurches] = useState<Church[]>([]);
  const [discoverChurches, setDiscoverChurches] = useState<Church[]>([]);
  const [joinRequests, setJoinRequests] = useState<ChurchJoinRequest[]>([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [createErrorMessage, setCreateErrorMessage] = useState('');
  const [joinSearchTerm, setJoinSearchTerm] = useState('');
  const [joinErrorMessage, setJoinErrorMessage] = useState('');
  const [joinSuccessMessage, setJoinSuccessMessage] = useState('');
  const [notificationErrorMessage, setNotificationErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isLoadingDiscoverChurches, setIsLoadingDiscoverChurches] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(false);
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [isJoinOpen, setIsJoinOpen] = useState(false);
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [approvingRequestId, setApprovingRequestId] = useState('');
  const [joiningChurchId, setJoiningChurchId] = useState('');
  const [leavingChurchId, setLeavingChurchId] = useState('');

  const filteredDiscoverChurches = useMemo(() => {
    const term = normalizeSearch(joinSearchTerm.trim());

    if (!term) {
      return discoverChurches;
    }

    return discoverChurches.filter((church) => normalizeSearch(church.name).includes(term));
  }, [discoverChurches, joinSearchTerm]);

  const currentChurchIds = useMemo(() => new Set(churches.map((church) => church.id)), [churches]);

  useEffect(() => {
    void loadChurches();
    void loadJoinRequests();
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

  async function loadJoinRequests() {
    try {
      setIsLoadingNotifications(true);
      setNotificationErrorMessage('');

      const data = await listChurchJoinRequests();
      setJoinRequests(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setNotificationErrorMessage(error.message);
      } else {
        setNotificationErrorMessage('Nao foi possivel carregar as notificacoes agora.');
      }
    } finally {
      setIsLoadingNotifications(false);
    }
  }

  async function loadDiscoverChurches() {
    try {
      setIsLoadingDiscoverChurches(true);
      setJoinErrorMessage('');

      const data = await searchChurches();
      setDiscoverChurches(data);
    } catch (error) {
      if (error instanceof ApiError) {
        setJoinErrorMessage(error.message);
      } else {
        setJoinErrorMessage('Nao foi possivel carregar as igrejas agora.');
      }
    } finally {
      setIsLoadingDiscoverChurches(false);
    }
  }

  async function refreshHome() {
    setIsRefreshing(true);
    await Promise.all([loadChurches(true), loadDiscoverChurches(), loadJoinRequests()]);
    setIsRefreshing(false);
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

  async function handleJoinChurch(churchId: string) {
    try {
      setIsJoining(true);
      setJoiningChurchId(churchId);
      setJoinErrorMessage('');
      setJoinSuccessMessage('');

      await joinChurch(churchId);
      setJoinSuccessMessage('Solicitacao enviada. Um administrador precisa aprovar sua entrada.');
      await loadDiscoverChurches();
    } catch (error) {
      if (error instanceof ApiError) {
        setJoinErrorMessage(error.message);
      } else {
        setJoinErrorMessage('Nao foi possivel participar desta igreja agora.');
      }
    } finally {
      setIsJoining(false);
      setJoiningChurchId('');
    }
  }

  async function handleLeaveChurch(churchId: string) {
    try {
      setIsLeaving(true);
      setLeavingChurchId(churchId);
      setJoinErrorMessage('');
      setJoinSuccessMessage('');

      await leaveChurch(churchId);
      setJoinSuccessMessage('Voce saiu desta igreja.');
      await Promise.all([loadChurches(true), loadDiscoverChurches()]);
    } catch (error) {
      if (error instanceof ApiError) {
        setJoinErrorMessage(error.message);
      } else {
        setJoinErrorMessage('Nao foi possivel sair desta igreja agora.');
      }
    } finally {
      setIsLeaving(false);
      setLeavingChurchId('');
    }
  }

  function openCreateChurch() {
    setIsActionMenuOpen(false);
    setIsNotificationsOpen(false);
    setIsJoinOpen(false);
    setIsComposerOpen((current) => !current);
  }

  function openJoinChurch() {
    setIsActionMenuOpen(false);
    setIsNotificationsOpen(false);
    setIsComposerOpen(false);
    setJoinErrorMessage('');
    setJoinSuccessMessage('');
    setIsJoinOpen((current) => {
      const nextValue = !current;

      if (nextValue && discoverChurches.length === 0) {
        void loadDiscoverChurches();
      }

      return nextValue;
    });
  }

  async function handleApproveJoinRequest(requestId: string) {
    try {
      setApprovingRequestId(requestId);
      setNotificationErrorMessage('');

      await approveChurchJoinRequest(requestId);
      setJoinRequests((current) => current.filter((request) => request.id !== requestId));
    } catch (error) {
      if (error instanceof ApiError) {
        setNotificationErrorMessage(error.message);
      } else {
        setNotificationErrorMessage('Nao foi possivel aprovar a solicitacao agora.');
      }
    } finally {
      setApprovingRequestId('');
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
          <RefreshControl refreshing={isRefreshing} onRefresh={refreshHome} />
        }
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View className="mb-8 flex-row items-start justify-between">
          <View className="mr-4 flex-1">
            <Text className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Home
            </Text>
            <Text className="text-3xl font-extrabold text-textBase">Minhas igrejas</Text>
            <Text className="mt-3 text-base leading-6 text-textMuted">
              {user?.name
                ? `${user.name}, acesse as igrejas que voce administra ou faz parte.`
                : 'Acesse as igrejas que voce administra ou faz parte.'}
            </Text>
          </View>

          <View className="relative z-20 items-end">
            <View className="flex-row items-center gap-3">
              <TouchableOpacity
                className="relative h-12 w-12 items-center justify-center rounded-full bg-surface"
                onPress={() => {
                  setIsActionMenuOpen(false);
                  setIsNotificationsOpen((current) => !current);
                  if (!isNotificationsOpen) {
                    void loadJoinRequests();
                  }
                }}>
                <Ionicons
                  name={isNotificationsOpen ? 'notifications' : 'notifications-outline'}
                  size={22}
                  color="#F8FAFC"
                />
                {joinRequests.length > 0 ? (
                  <View className="absolute right-2 top-2 min-w-[18px] items-center rounded-full bg-danger px-1">
                    <Text className="text-[10px] font-bold text-white">{joinRequests.length}</Text>
                  </View>
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity
                className="h-12 w-12 items-center justify-center rounded-full bg-primary"
                onPress={() => {
                  setIsNotificationsOpen(false);
                  setIsActionMenuOpen((current) => !current);
                }}>
                <Ionicons name={isActionMenuOpen ? 'close-outline' : 'add-outline'} size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>

            {isNotificationsOpen ? (
              <View className="absolute right-0 top-14 z-20 w-[300px] rounded-[24px] border border-surfaceAlt bg-surface p-3">
                <Text className="px-2 pb-2 text-sm font-bold uppercase tracking-[0.18em] text-textMuted">
                  Notificacoes
                </Text>

                {isLoadingNotifications ? (
                  <View className="items-center px-4 py-5">
                    <ActivityIndicator color="#6366F1" />
                    <Text className="mt-3 text-sm text-textMuted">Carregando...</Text>
                  </View>
                ) : null}

                {!isLoadingNotifications && joinRequests.length === 0 ? (
                  <View className="rounded-2xl bg-background px-4 py-4">
                    <Text className="text-sm font-semibold text-textBase">
                      Nenhuma solicitacao pendente
                    </Text>
                    <Text className="mt-1 text-xs leading-5 text-textMuted">
                      Os pedidos de entrada das igrejas que voce administra aparecem aqui.
                    </Text>
                  </View>
                ) : null}

                {!isLoadingNotifications &&
                  joinRequests.map((request) => (
                    <View key={request.id} className="mb-2 rounded-2xl bg-background px-4 py-4">
                      <Text className="text-base font-bold text-textBase">
                        {request.user?.name || request.user?.email || 'Novo membro'}
                      </Text>
                      <Text className="mt-1 text-xs leading-5 text-textMuted">
                        Quer participar de {request.church?.name || 'uma igreja administrada por voce'}.
                      </Text>

                      <TouchableOpacity
                        className={`mt-3 items-center rounded-2xl py-3 ${
                          approvingRequestId === request.id ? 'bg-surfaceAlt' : 'bg-primary'
                        }`}
                        onPress={() => handleApproveJoinRequest(request.id)}
                        disabled={approvingRequestId === request.id}>
                        <Text className="text-sm font-bold text-white">
                          {approvingRequestId === request.id ? 'Aprovando...' : 'Aceitar'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  ))}

                {!!notificationErrorMessage && (
                  <View className="mt-2 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
                    <Text className="text-xs text-danger">{notificationErrorMessage}</Text>
                  </View>
                )}
              </View>
            ) : null}

            {isActionMenuOpen ? (
              <View className="absolute right-0 top-14 z-10 w-56 rounded-[24px] border border-surfaceAlt bg-surface p-2">
                <TouchableOpacity
                  className="flex-row items-center rounded-2xl px-4 py-3"
                  onPress={openCreateChurch}>
                  <Ionicons name="add-circle-outline" size={20} color="#F8FAFC" />
                  <Text className="ml-3 font-bold text-textBase">Criar igreja</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  className="flex-row items-center rounded-2xl px-4 py-3"
                  onPress={openJoinChurch}>
                  <Ionicons name="enter-outline" size={20} color="#F8FAFC" />
                  <Text className="ml-3 font-bold text-textBase">Participar</Text>
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </View>

        <View className="mb-5">
          <Text className="text-2xl font-bold text-textBase">Igrejas que faco parte</Text>
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

        {isJoinOpen && (
          <View className="mb-8 rounded-[28px] border border-surfaceAlt bg-surface px-5 py-5">
            <Text className="text-xl font-bold text-textBase">Participar de igreja</Text>
            <Text className="mt-2 text-sm leading-6 text-textMuted">
              Busque pelo nome e use a seta verde para solicitar entrada.
            </Text>

            <View className="mt-5 flex-row items-center rounded-2xl border border-surfaceAlt bg-background px-4">
              <Ionicons name="search-outline" size={20} color="#94A3B8" />
              <TextInput
                className="ml-3 flex-1 py-4 text-base text-textBase"
                placeholder="Buscar igreja pelo nome"
                placeholderTextColor="#64748B"
                cursorColor="#6366F1"
                autoCorrect={false}
                value={joinSearchTerm}
                onChangeText={setJoinSearchTerm}
              />
            </View>

            {!!joinErrorMessage && (
              <View className="mt-4 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
                <Text className="text-sm text-danger">{joinErrorMessage}</Text>
              </View>
            )}

            {!!joinSuccessMessage && (
              <View className="mt-4 rounded-2xl border border-success/40 bg-success/10 px-4 py-3">
                <Text className="text-sm text-success">{joinSuccessMessage}</Text>
              </View>
            )}

            <View className="mt-5 overflow-hidden rounded-2xl border border-surfaceAlt">
              {isLoadingDiscoverChurches ? (
                <View className="items-center bg-background px-4 py-8">
                  <ActivityIndicator color="#6366F1" />
                  <Text className="mt-3 text-sm text-textMuted">Carregando igrejas...</Text>
                </View>
              ) : null}

              {!isLoadingDiscoverChurches && filteredDiscoverChurches.length === 0 ? (
                <View className="bg-background px-4 py-8">
                  <Text className="text-sm font-semibold text-textBase">Nenhuma igreja encontrada</Text>
                  <Text className="mt-1 text-xs leading-5 text-textMuted">
                    Ajuste o nome buscado ou tente novamente mais tarde.
                  </Text>
                </View>
              ) : null}

              {!isLoadingDiscoverChurches &&
                filteredDiscoverChurches.map((church, index) => {
                  const isCurrentMember = Boolean(church.role) || currentChurchIds.has(church.id);
                  const isRequesting = joiningChurchId === church.id;
                  const isLeavingCurrent = leavingChurchId === church.id;
                  const isLastItem = index === filteredDiscoverChurches.length - 1;

                  return (
                    <View
                      key={church.id}
                      className={`flex-row items-center bg-background px-4 py-4 ${
                        isLastItem ? '' : 'border-b border-surfaceAlt'
                      }`}>
                      <Text className="mr-3 flex-1 text-base font-bold text-textBase">{church.name}</Text>

                      {isCurrentMember ? (
                        <View className="mr-2 h-9 w-9 items-center justify-center rounded-full bg-success/10">
                          <Ionicons name="checkmark" size={20} color="#22C55E" />
                        </View>
                      ) : null}

                      <TouchableOpacity
                        className={`h-10 w-10 items-center justify-center rounded-full ${
                          isCurrentMember ? 'bg-danger/10' : 'bg-success/10'
                        }`}
                        onPress={() =>
                          isCurrentMember ? handleLeaveChurch(church.id) : handleJoinChurch(church.id)
                        }
                        disabled={isJoining || isLeaving}>
                        <Ionicons
                          name={
                            isRequesting || isLeavingCurrent
                              ? 'ellipsis-horizontal'
                              : isCurrentMember
                                ? 'arrow-back'
                                : 'arrow-forward'
                          }
                          size={21}
                          color={isCurrentMember ? '#F87171' : '#22C55E'}
                        />
                      </TouchableOpacity>
                    </View>
                  );
                })}
            </View>
          </View>
        )}

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
