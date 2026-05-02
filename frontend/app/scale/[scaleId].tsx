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
import { SectorScale, getSectorScale } from '@/lib/churches';

function formatScaleDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Data invalida';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getInitials(name?: string) {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (!words.length) {
    return '?';
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
}

export default function ScaleDetailsScreen() {
  const router = useRouter();
  const { churchId, sectorId, sectorName, scaleId } = useLocalSearchParams<{
    churchId?: string;
    sectorId?: string;
    sectorName?: string;
    scaleId?: string;
  }>();
  const [scale, setScale] = useState<SectorScale | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadScale = useCallback(
    async (isPullToRefresh = false) => {
      if (!churchId || !sectorId || !scaleId) {
        return;
      }

      try {
        if (isPullToRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setErrorMessage('');
        const result = await getSectorScale(churchId, sectorId, scaleId);
        setScale(result);
      } catch (error) {
        if (error instanceof ApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Nao foi possivel carregar esta escala agora.');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [churchId, scaleId, sectorId],
  );

  useEffect(() => {
    void loadScale();
  }, [loadScale]);

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 72, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => loadScale(true)} />
        }
        showsVerticalScrollIndicator={false}>
        <View className="mb-8 flex-row items-center">
          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full bg-surface"
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
          </TouchableOpacity>
        </View>

        {isLoading ? (
          <View className="items-center rounded-[28px] bg-surface px-5 py-10">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="mt-4 text-sm text-textMuted">Carregando escala...</Text>
          </View>
        ) : null}

        {!isLoading && scale ? (
          <>
            <View className="mb-6 rounded-[30px] bg-surface px-6 py-6">
              <Text className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
                {sectorName || 'Setor'}
              </Text>
              <Text className="mt-3 text-3xl font-extrabold text-textBase">{scale.title}</Text>
              <Text className="mt-3 text-sm font-semibold capitalize text-accent">
                {formatScaleDate(scale.date)}
              </Text>
              <View className="mt-5 flex-row items-center rounded-full bg-background px-4 py-2 self-start">
                <Ionicons name="people-outline" size={15} color="#38BDF8" />
                <Text className="ml-2 text-xs font-bold text-textBase">
                  {scale.participants.length} participante(s)
                </Text>
              </View>
            </View>

            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-textBase">Participantes</Text>
            </View>

            {scale.participants.length === 0 ? (
              <View className="rounded-[26px] border border-dashed border-surfaceAlt bg-surface px-5 py-6">
                <Text className="text-base font-semibold text-textBase">
                  Nenhum participante definido
                </Text>
                <Text className="mt-2 text-sm leading-6 text-textMuted">
                  Quando os membros forem adicionados, eles aparecem aqui.
                </Text>
              </View>
            ) : (
              <View className="gap-3">
                {scale.participants.map((participant) => (
                  <View
                    key={participant.user_id}
                    className="flex-row items-center rounded-[22px] border border-surfaceAlt bg-surface px-4 py-4">
                    <View className="h-12 w-12 items-center justify-center rounded-full bg-primary">
                      <Text className="font-extrabold text-white">
                        {getInitials(participant.user_name)}
                      </Text>
                    </View>
                    <View className="ml-4 flex-1">
                      <Text className="text-base font-bold text-textBase">
                        {participant.user_name || 'Membro'}
                      </Text>
                      <Text className="mt-1 text-sm text-textMuted">
                        {participant.task_name || 'Sem tarefa definida'}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </>
        ) : null}

        {!!errorMessage && (
          <View className="rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
            <Text className="text-sm text-danger">{errorMessage}</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}
