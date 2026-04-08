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
  getChurchMembership,
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

  useEffect(() => {
    if (!churchId) {
      return;
    }

    void loadChurchData();
  }, [churchId, loadChurchData]);

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
        const [churchSectors, churchEvents] = await Promise.all([
          listChurchSectors(churchId),
          listChurchEvents(churchId),
        ]);

        setMembership(churchMembership);
        setSectors(churchSectors);
        setEvents(
          [...churchEvents].sort(
            (left, right) => new Date(left.date).getTime() - new Date(right.date).getTime(),
          ),
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

  const churchName = membership?.church.name ?? name ?? 'Igreja';
  const churchDescription =
    membership?.church.description?.trim() || description?.trim() || 'Sem descricao cadastrada.';

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 72, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => loadChurchData(true)} />
        }
        showsVerticalScrollIndicator={false}>
        <View className="mb-8 flex-row items-center justify-between">
          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full bg-surface"
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
          </TouchableOpacity>

          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full bg-surface"
            onPress={() => loadChurchData(true)}
            disabled={isRefreshing || isLoading}>
            <Ionicons name="refresh-outline" size={22} color="#F8FAFC" />
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
            <View className="rounded-full bg-background px-4 py-2">
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-textMuted">
                {membership ? 'Membro vinculado' : 'Catalogo publico'}
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
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
