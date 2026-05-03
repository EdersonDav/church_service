import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ApiError } from '@/lib/api';
import { Church, Sector, SectorScale, listChurches, listChurchSectors, listSectorScales } from '@/lib/churches';

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

function formatTime(value: string) {
  return new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit' }).format(new Date(value));
}

type ChurchScale = SectorScale & { sector: Sector };

export default function ChurchScalesScreen() {
  const router = useRouter();
  const [churches, setChurches] = useState<Church[]>([]);
  const [selectedChurchId, setSelectedChurchId] = useState<string | null>(null);
  const [scales, setScales] = useState<ChurchScale[]>([]);
  const [calendarMonth, setCalendarMonth] = useState(new Date());
  const [selectedDateKey, setSelectedDateKey] = useState(toDateKey(new Date()));
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const selectedChurch = churches.find((church) => church.id === selectedChurchId) ?? null;
  const scaleDates = useMemo(() => new Set(scales.map((scale) => toDateKey(scale.date))), [scales]);
  const selectedDateScales = scales
    .filter((scale) => toDateKey(scale.date) === selectedDateKey)
    .sort((left, right) => new Date(left.date).getTime() - new Date(right.date).getTime());

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

        const sectors = await listChurchSectors(nextChurchId);
        const entries = await Promise.all(
          sectors.map(async (sector) =>
            (await listSectorScales(nextChurchId, sector.id)).map((scale) => ({ ...scale, sector })),
          ),
        );
        setScales(entries.flat());
      } catch (error) {
        if (error instanceof ApiError) setErrorMessage(error.message);
        else setErrorMessage('Nao foi possivel carregar as escalas da igreja agora.');
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
        <Text className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">Igreja</Text>
        <Text className="mt-3 text-3xl font-extrabold text-textBase">Grande escala</Text>
        <Text className="mt-3 text-base leading-6 text-textMuted">{selectedChurch?.name || 'Selecione uma igreja'}</Text>
        {isLoading ? <ActivityIndicator className="mt-4" color="#6366F1" /> : null}
      </View>

      {!!errorMessage && <View className="mb-5 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3"><Text className="text-sm text-danger">{errorMessage}</Text></View>}

      {churches.length > 1 ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-5" contentContainerStyle={{ gap: 10 }}>
          {churches.map((church) => {
            const isSelected = church.id === selectedChurchId;
            return (
              <TouchableOpacity key={church.id} className={`rounded-full px-5 py-3 ${isSelected ? 'bg-primary' : 'bg-surface'}`} onPress={() => setSelectedChurchId(church.id)}>
                <Text className={`text-sm font-bold ${isSelected ? 'text-white' : 'text-textMuted'}`}>{church.name}</Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      ) : null}

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
            const hasScale = scaleDates.has(dateKey);
            const isSelected = selectedDateKey === dateKey;
            return (
              <TouchableOpacity key={date.toISOString()} className="w-[14.28%] p-1" onPress={() => setSelectedDateKey(dateKey)}>
                <View className={`aspect-square items-center justify-center rounded-full ${isSelected ? 'bg-primary' : hasScale ? 'bg-accent/20' : 'bg-background'}`}>
                  <Text className={`text-sm font-bold ${isSelected ? 'text-white' : hasScale ? 'text-accent' : date.getMonth() === calendarMonth.getMonth() ? 'text-textBase' : 'text-textMuted'}`}>{date.getDate()}</Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <View className="mt-6">
        <Text className="mb-3 text-xl font-bold text-textBase">Escala da igreja no dia</Text>
        {selectedDateScales.length === 0 ? (
          <View className="rounded-[26px] border border-dashed border-surfaceAlt bg-surface px-5 py-6"><Text className="text-base font-semibold text-textBase">Nenhuma escala nesta data</Text></View>
        ) : selectedDateScales.map((scale) => (
          <TouchableOpacity key={scale.id} className="mb-3 rounded-[24px] border border-surfaceAlt bg-surface px-5 py-5" onPress={() => router.push({ pathname: '/scale/[scaleId]', params: { churchId: String(selectedChurchId), sectorId: scale.sector.id, sectorName: scale.sector.name, scaleId: scale.id } })}>
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold text-textBase">{scale.sector.name}</Text>
              <Text className="text-sm font-bold text-accent">{formatTime(scale.date)}</Text>
            </View>
            <Text className="mt-2 text-base font-bold text-textBase">{scale.title}</Text>
            {scale.description?.trim() ? <Text className="mt-2 text-sm leading-6 text-textMuted" numberOfLines={2}>{scale.description.trim()}</Text> : null}
            <Text className="mt-3 text-xs font-bold text-textMuted">{scale.participants.length} participante(s)</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
