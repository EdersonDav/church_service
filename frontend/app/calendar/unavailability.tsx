import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
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
  Unavailability,
  createUserUnavailability,
  deleteUserUnavailability,
  getChurchMembership,
  listChurchSectors,
  listChurches,
  listSectorScales,
  listUserUnavailability,
} from '@/lib/churches';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function getCalendarDays(monthDate: Date) {
  const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
  const startDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1 - firstDay.getDay());
  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
}

function toDateKey(value: string | Date) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function parseLocalDateTime(dateKey: string, time: string) {
  const [hours = '00', minutes = '00'] = time.split(':');
  const date = new Date(`${dateKey}T00:00:00`);
  date.setHours(Number(hours), Number(minutes), 0, 0);
  return date;
}

function formatRange(item: Unavailability) {
  const start = new Date(item.date);
  const end = new Date(item.end_date ?? item.date);
  const day = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
  }).format(start);
  const time = new Intl.DateTimeFormat('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  return `${day}, ${time.format(start)} ate ${time.format(end)}`;
}

export default function UnavailabilityScreen() {
  const router = useRouter();
  const [churches, setChurches] = useState<Church[]>([]);
  const [selectedChurchId, setSelectedChurchId] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState('');
  const [items, setItems] = useState<Unavailability[]>([]);
  const [scheduledDateKeys, setScheduledDateKeys] = useState<Set<string>>(new Set());
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [startDateKey, setStartDateKey] = useState(toDateKey(new Date()));
  const [endDateKey, setEndDateKey] = useState(toDateKey(new Date()));
  const [startTime, setStartTime] = useState('00:00');
  const [endTime, setEndTime] = useState('23:59');
  const [isSelectingEnd, setIsSelectingEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [actionId, setActionId] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const selectedChurch = churches.find((church) => church.id === selectedChurchId) ?? null;
  const unavailableDays = useMemo(() => new Set(items.map((item) => toDateKey(item.date))), [items]);

  const loadData = useCallback(
    async (isPullToRefresh = false) => {
      try {
        if (isPullToRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }
        setErrorMessage('');
        const churchesResult = await listChurches();
        const nextChurchId = selectedChurchId ?? churchesResult[0]?.id ?? null;
        setChurches(churchesResult);
        setSelectedChurchId(nextChurchId);

        if (!nextChurchId) return;

        const membership = await getChurchMembership(nextChurchId);
        const userId = membership.user_id || membership.user?.id || '';
        setCurrentUserId(userId);

        if (!userId) {
          setItems([]);
          setScheduledDateKeys(new Set());
          return;
        }

        const [unavailability, sectors] = await Promise.all([
          listUserUnavailability(userId),
          listChurchSectors(nextChurchId),
        ]);
        const sectorScales = await Promise.all(
          sectors.map((sector) => listSectorScales(nextChurchId, sector.id)),
        );

        setItems(unavailability);
        setScheduledDateKeys(
          new Set(
            sectorScales
              .flat()
              .filter((scale) =>
                scale.participants.some((participant) => participant.user_id === userId),
              )
              .map((scale) => toDateKey(scale.date)),
          ),
        );
      } catch (error) {
        if (error instanceof ApiError) setErrorMessage(error.message);
        else setErrorMessage('Nao foi possivel carregar indisponibilidades agora.');
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [selectedChurchId],
  );

  useEffect(() => {
    void loadData();
  }, [loadData]);

  function selectDate(date: Date) {
    const key = toDateKey(date);

    if (scheduledDateKeys.has(key)) {
      return;
    }

    if (isSelectingEnd) {
      setEndDateKey(key);
    } else {
      setStartDateKey(key);
      setEndDateKey(key);
    }
  }

  async function saveRange() {
    if (!currentUserId) {
      setErrorMessage('Selecione uma igreja antes de marcar indisponibilidade.');
      return;
    }

    const start = parseLocalDateTime(startDateKey, startTime);
    const end = parseLocalDateTime(endDateKey, endTime);

    if (end.getTime() < start.getTime()) {
      setErrorMessage('O fim da indisponibilidade deve ser depois do inicio.');
      return;
    }

    try {
      setIsSaving(true);
      setErrorMessage('');
      const created = await createUserUnavailability(currentUserId, start.toISOString(), end.toISOString());
      setItems((current) =>
        [...current, created].sort(
          (left, right) => new Date(left.date).getTime() - new Date(right.date).getTime(),
        ),
      );
    } catch (error) {
      if (error instanceof ApiError) setErrorMessage(error.message);
      else setErrorMessage('Nao foi possivel salvar sua indisponibilidade agora.');
    } finally {
      setIsSaving(false);
    }
  }

  async function removeItem(item: Unavailability) {
    if (!currentUserId) return;

    try {
      setActionId(item.id);
      setErrorMessage('');
      await deleteUserUnavailability(currentUserId, item.id);
      setItems((current) => current.filter((currentItem) => currentItem.id !== item.id));
    } catch (error) {
      if (error instanceof ApiError) setErrorMessage(error.message);
      else setErrorMessage('Nao foi possivel remover indisponibilidade agora.');
    } finally {
      setActionId('');
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 72, paddingBottom: 128 }}
      refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={() => loadData(true)} />}
      showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ headerShown: false }} />
      <TouchableOpacity className="mb-8 h-11 w-11 items-center justify-center rounded-full bg-surface" onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
      </TouchableOpacity>

      <View className="mb-6 rounded-[30px] bg-surface px-6 py-6">
        <Text className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Indisponibilidade</Text>
        <Text className="mt-3 text-3xl font-extrabold text-textBase">{selectedChurch?.name || 'Selecione uma igreja'}</Text>
        <Text className="mt-3 text-base leading-6 text-textMuted">
          A indisponibilidade vale para todos os setores da igreja.
        </Text>
        {isLoading ? <ActivityIndicator className="mt-4" color="#6366F1" /> : null}
      </View>

      {!!errorMessage && <View className="mb-5 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3"><Text className="text-sm text-danger">{errorMessage}</Text></View>}

      <View className="mb-5 flex-row rounded-2xl bg-surface p-1">
        <TouchableOpacity className={`flex-1 items-center rounded-xl py-3 ${!isSelectingEnd ? 'bg-primary' : ''}`} onPress={() => setIsSelectingEnd(false)}>
          <Text className="font-bold text-white">Inicio</Text>
        </TouchableOpacity>
        <TouchableOpacity className={`flex-1 items-center rounded-xl py-3 ${isSelectingEnd ? 'bg-primary' : ''}`} onPress={() => setIsSelectingEnd(true)}>
          <Text className="font-bold text-white">Fim</Text>
        </TouchableOpacity>
      </View>

      <View className="rounded-[28px] border border-surfaceAlt bg-surface px-5 py-5">
        <View className="mb-4 flex-row items-center justify-between">
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-background" onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1))}>
            <Ionicons name="chevron-back" size={18} color="#F8FAFC" />
          </TouchableOpacity>
          <Text className="text-base font-bold capitalize text-textBase">{new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(calendarMonth)}</Text>
          <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-background" onPress={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1))}>
            <Ionicons name="chevron-forward" size={18} color="#F8FAFC" />
          </TouchableOpacity>
        </View>
        <View className="mb-2 flex-row">{weekDays.map((day, index) => <Text key={`${day}-${index}`} className="flex-1 text-center text-xs font-bold text-textMuted">{day}</Text>)}</View>
        <View className="flex-row flex-wrap">
          {getCalendarDays(calendarMonth).map((date) => {
            const dateKey = toDateKey(date);
            const isSelected = dateKey === startDateKey || dateKey === endDateKey;
            const isUnavailable = unavailableDays.has(dateKey);
            const isScheduled = scheduledDateKeys.has(dateKey);
            return (
              <TouchableOpacity
                key={date.toISOString()}
                className="w-[14.28%] p-1"
                onPress={() => selectDate(date)}
                disabled={isScheduled}>
                <View className={`aspect-square items-center justify-center rounded-full ${isScheduled ? 'bg-surfaceAlt opacity-60' : isSelected ? 'bg-primary' : isUnavailable ? 'bg-danger/20' : 'bg-background'}`}>
                  {isScheduled ? (
                    <Ionicons name="lock-closed-outline" size={13} color="#94A3B8" />
                  ) : (
                    <Text className={`text-sm font-bold ${isSelected ? 'text-white' : isUnavailable ? 'text-danger' : date.getMonth() === calendarMonth.getMonth() ? 'text-textBase' : 'text-textMuted'}`}>{date.getDate()}</Text>
                  )}
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View className="mt-5 rounded-[24px] border border-surfaceAlt bg-surface px-5 py-5">
        <Text className="text-base font-bold text-textBase">Horario</Text>
        <View className="mt-4 flex-row gap-3">
          <View className="flex-1">
            <Text className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-textMuted">Inicio</Text>
            <TextInput className="rounded-2xl border border-surfaceAlt bg-background px-4 py-3 text-base text-textBase" value={startTime} onChangeText={setStartTime} placeholder="00:00" placeholderTextColor="#64748B" keyboardType="numbers-and-punctuation" />
          </View>
          <View className="flex-1">
            <Text className="mb-2 text-xs font-bold uppercase tracking-[0.16em] text-textMuted">Fim</Text>
            <TextInput className="rounded-2xl border border-surfaceAlt bg-background px-4 py-3 text-base text-textBase" value={endTime} onChangeText={setEndTime} placeholder="23:59" placeholderTextColor="#64748B" keyboardType="numbers-and-punctuation" />
          </View>
        </View>
        <Text className="mt-4 text-sm leading-6 text-textMuted">
          {startDateKey} {startTime} ate {endDateKey} {endTime}
        </Text>
        <View className="mt-3 flex-row items-center">
          <View className="h-5 w-5 items-center justify-center rounded-full bg-surfaceAlt">
            <Ionicons name="lock-closed-outline" size={11} color="#94A3B8" />
          </View>
          <Text className="ml-2 text-xs font-semibold text-textMuted">
            Dias bloqueados ja possuem escala para voce.
          </Text>
        </View>
        <TouchableOpacity className={`mt-5 items-center rounded-2xl py-4 ${isSaving ? 'bg-surfaceAlt' : 'bg-primary'}`} onPress={saveRange} disabled={isSaving}>
          <Text className="font-bold text-white">{isSaving ? 'Salvando...' : 'Marcar indisponibilidade'}</Text>
        </TouchableOpacity>
      </View>

      <View className="mt-6">
        <Text className="mb-3 text-xl font-bold text-textBase">Periodos marcados</Text>
        {items.length === 0 ? (
          <View className="rounded-[26px] border border-dashed border-surfaceAlt bg-surface px-5 py-6"><Text className="text-base font-semibold text-textBase">Nenhum periodo marcado</Text></View>
        ) : items.map((item) => (
          <View key={item.id} className="mb-3 flex-row items-center rounded-[22px] border border-surfaceAlt bg-surface px-4 py-4">
            <View className="h-11 w-11 items-center justify-center rounded-full bg-danger/10"><Ionicons name="calendar-outline" size={18} color="#F87171" /></View>
            <Text className="ml-3 flex-1 text-sm font-bold capitalize text-textBase">{formatRange(item)}</Text>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-danger/10" onPress={() => removeItem(item)} disabled={Boolean(actionId)}>
              <Ionicons name={actionId === item.id ? 'ellipsis-horizontal' : 'trash-outline'} size={18} color="#F87171" />
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
