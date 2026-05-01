import { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ApiError } from '@/lib/api';
import {
  ChurchMembership,
  ExtraEvent,
  Sector,
  deleteChurch,
  getChurchMembership,
  leaveChurch,
  listChurchEvents,
  listChurchSectors,
} from '@/lib/churches';

function formatEventDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Data invalida';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

export default function ChurchDetailsScreen() {
  const router = useRouter();
  const { churchId, name, description } = useLocalSearchParams<{
    churchId?: string;
    name?: string;
    description?: string;
  }>();
  const [membership, setMembership] = useState<ChurchMembership | null>(null);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [events, setEvents] = useState<ExtraEvent[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAccessDenied, setIsAccessDenied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  const loadChurchData = useCallback(
    async (isPullToRefresh = false) => {
      if (!churchId) {
        return;
      }

      try {
        if (isPullToRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setErrorMessage('');
        setIsAccessDenied(false);

        const churchMembership = await getChurchMembership(churchId);
        setMembership(churchMembership);

        const [sectorsResult, eventsResult] = await Promise.allSettled([
          listChurchSectors(churchId),
          listChurchEvents(churchId),
        ]);

        setSectors(sectorsResult.status === 'fulfilled' ? sectorsResult.value : []);
        setEvents(
          eventsResult.status === 'fulfilled'
            ? [...eventsResult.value].sort(
              (left, right) => new Date(left.date).getTime() - new Date(right.date).getTime(),
            )
            : [],
        );
      } catch (error) {
        setMembership(null);
        setSectors([]);
        setEvents([]);

        if (error instanceof ApiError && (error.status === 403 || error.status === 404)) {
          setIsAccessDenied(true);
          setErrorMessage(
            'Voce ainda nao esta vinculado a esta igreja. Um administrador precisa adicionar o seu usuario como membro.',
          );
        } else if (error instanceof ApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Nao foi possivel carregar os detalhes da igreja agora.');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [churchId],
  );

  useEffect(() => {
    if (!churchId) {
      return;
    }

    void loadChurchData();
  }, [churchId, loadChurchData]);

  const churchName = membership?.church.name ?? name ?? 'Igreja';
  const churchDescription =
    membership?.church.description?.trim() || description?.trim() || 'Sem descricao cadastrada.';
  const isAdmin = membership?.role === 'ADMIN';
  const canLeaveChurch = Boolean(membership) && !isAdmin;

  async function handleDeleteChurch() {
    if (!churchId) {
      return;
    }

    try {
      setIsDeleting(true);
      setErrorMessage('');

      await deleteChurch(churchId);
      router.replace('/(tabs)');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Nao foi possivel deletar a igreja agora.');
      }
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleLeaveChurch() {
    if (!churchId) {
      return;
    }

    try {
      setIsLeaving(true);
      setErrorMessage('');

      await leaveChurch(churchId);
      router.replace('/(tabs)');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Nao foi possivel sair da igreja agora.');
      }
    } finally {
      setIsLeaving(false);
    }
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 72, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => loadChurchData(true)} />
        }
        showsVerticalScrollIndicator={false}>
        <View className="mb-8 flex-row items-center">
          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full bg-surface"
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
          </TouchableOpacity>
        </View>

        <View className="mb-8 overflow-hidden rounded-[30px] bg-surface px-6 py-6">
          <View className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-accent/10" />
          <Text className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Igreja
          </Text>
          <Text className="mt-3 text-3xl font-extrabold text-textBase">{churchName}</Text>
          <Text className="mt-3 text-base leading-6 text-textMuted">{churchDescription}</Text>

          <View className="mt-5 flex-row flex-wrap gap-3">
            <View className="rounded-full bg-background px-4 py-2">
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {membership ? membership.role : 'Acesso pendente'}
              </Text>
            </View>
          </View>
        </View>

        {!!errorMessage && (
          <View
            className={`mb-6 rounded-2xl px-4 py-4 ${
              isAccessDenied
                ? 'border border-accent/30 bg-accent/10'
                : 'border border-danger/40 bg-danger/10'
            }`}>
            <Text className={`text-sm ${isAccessDenied ? 'text-accent' : 'text-danger'}`}>
              {errorMessage}
            </Text>
          </View>
        )}

        {isLoading ? (
          <View className="rounded-[28px] bg-surface px-5 py-10">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="mt-4 text-center text-sm text-textMuted">
              Carregando dados da igreja...
            </Text>
          </View>
        ) : null}

        {!isLoading && membership ? (
          <>
            <View className="mb-8 flex-row gap-3">
              <View className="flex-1 rounded-[24px] bg-surface px-4 py-5">
                <Text className="text-sm text-textMuted">Setores</Text>
                <Text className="mt-2 text-3xl font-extrabold text-textBase">{sectors.length}</Text>
              </View>
              <View className="flex-1 rounded-[24px] bg-surface px-4 py-5">
                <Text className="text-sm text-textMuted">Eventos</Text>
                <Text className="mt-2 text-3xl font-extrabold text-textBase">{events.length}</Text>
              </View>
            </View>

            <View className="mb-8">
              <Text className="mb-4 text-2xl font-bold text-textBase">Setores</Text>

              {sectors.length === 0 ? (
                <View className="rounded-[26px] border border-dashed border-surfaceAlt bg-surface px-5 py-6">
                  <Text className="text-base font-semibold text-textBase">
                    Nenhum setor criado ainda
                  </Text>
                  <Text className="mt-2 text-sm leading-6 text-textMuted">
                    Quando a igreja começar a estruturar os ministérios, os setores vão aparecer
                    aqui.
                  </Text>
                </View>
              ) : (
                sectors.map((sector) => (
                  <View
                    key={sector.id}
                    className="mb-3 rounded-[24px] border border-surfaceAlt bg-surface px-5 py-5">
                    <Text className="text-lg font-bold text-textBase">{sector.name}</Text>
                    <Text className="mt-2 text-sm text-textMuted">
                      Identificador: {sector.id.slice(0, 8)}...
                    </Text>
                  </View>
                ))
              )}
            </View>

            <View>
              <Text className="mb-4 text-2xl font-bold text-textBase">Proximos eventos</Text>

              {events.length === 0 ? (
                <View className="rounded-[26px] border border-dashed border-surfaceAlt bg-surface px-5 py-6">
                  <Text className="text-base font-semibold text-textBase">
                    Nenhum evento extra cadastrado
                  </Text>
                  <Text className="mt-2 text-sm leading-6 text-textMuted">
                    Eventos da igreja, conferencias e encontros especiais vao aparecer nesta area.
                  </Text>
                </View>
              ) : (
                events.map((event) => (
                  <View
                    key={event.id}
                    className="mb-3 rounded-[24px] border border-surfaceAlt bg-surface px-5 py-5">
                    <View className="flex-row items-start justify-between">
                      <View className="mr-4 flex-1">
                        <Text className="text-lg font-bold text-textBase">{event.name}</Text>
                        <Text className="mt-2 text-sm leading-6 text-textMuted">
                          {event.description?.trim() || 'Sem descricao adicional para este evento.'}
                        </Text>
                      </View>

                      <View className="rounded-full bg-background px-3 py-2">
                        <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                          {event.type || 'Evento'}
                        </Text>
                      </View>
                    </View>

                    <View className="mt-4 flex-row items-center">
                      <Ionicons name="calendar-outline" size={16} color="#38BDF8" />
                      <Text className="ml-2 text-sm text-textMuted">
                        {formatEventDate(event.date)}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            {isAdmin || canLeaveChurch ? (
              <View className="mt-8 border-t border-surfaceAlt pt-6">
                {isAdmin ? (
                  isDeleteConfirmOpen ? (
                    <View className="rounded-[24px] border border-danger/30 bg-danger/10 px-5 py-5">
                      <Text className="text-base font-bold text-textBase">Deletar igreja?</Text>
                      <Text className="mt-2 text-sm leading-6 text-textMuted">
                        Esta acao remove a igreja e os dados associados permanentemente.
                      </Text>
                      <View className="mt-5 flex-row gap-3">
                        <TouchableOpacity
                          className="flex-1 items-center rounded-2xl bg-surface py-4"
                          onPress={() => setIsDeleteConfirmOpen(false)}
                          disabled={isDeleting}>
                          <Text className="font-bold text-textBase">Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className={`flex-1 items-center rounded-2xl py-4 ${
                            isDeleting ? 'bg-surfaceAlt' : 'bg-danger'
                          }`}
                          onPress={handleDeleteChurch}
                          disabled={isDeleting}>
                          <Text className="font-bold text-white">
                            {isDeleting ? 'Deletando...' : 'Confirmar'}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  ) : (
                    <TouchableOpacity
                      className="self-start flex-row items-center py-2"
                      onPress={() => setIsDeleteConfirmOpen(true)}>
                      <Ionicons name="trash-outline" size={17} color="#F87171" />
                      <Text className="ml-2 text-sm font-semibold text-danger">Deletar igreja</Text>
                    </TouchableOpacity>
                  )
                ) : null}

                {canLeaveChurch && isLeaveConfirmOpen ? (
                  <View className="rounded-[24px] border border-danger/30 bg-danger/10 px-5 py-5">
                    <Text className="text-base font-bold text-textBase">Sair da igreja?</Text>
                    <Text className="mt-2 text-sm leading-6 text-textMuted">
                      Voce perde o acesso a esta igreja ate um administrador aprovar uma nova entrada.
                    </Text>
                    <View className="mt-5 flex-row gap-3">
                      <TouchableOpacity
                        className="flex-1 items-center rounded-2xl bg-surface py-4"
                        onPress={() => setIsLeaveConfirmOpen(false)}
                        disabled={isLeaving}>
                        <Text className="font-bold text-textBase">Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className={`flex-1 items-center rounded-2xl py-4 ${
                          isLeaving ? 'bg-surfaceAlt' : 'bg-danger'
                        }`}
                        onPress={handleLeaveChurch}
                        disabled={isLeaving}>
                        <Text className="font-bold text-white">
                          {isLeaving ? 'Saindo...' : 'Confirmar'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}

                {canLeaveChurch && !isLeaveConfirmOpen ? (
                  <TouchableOpacity
                    className="self-start flex-row items-center py-2"
                    onPress={() => setIsLeaveConfirmOpen(true)}>
                    <Ionicons name="exit-outline" size={17} color="#F87171" />
                    <Text className="ml-2 text-sm font-semibold text-danger">Sair da igreja</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
