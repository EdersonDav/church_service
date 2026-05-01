import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ApiError } from '@/lib/api';
import { Church, listChurches } from '@/lib/churches';

export default function CalendarScreen() {
  const [churches, setChurches] = useState<Church[]>([]);
  const [selectedChurchId, setSelectedChurchId] = useState<string | null>(null);
  const [isLoadingChurches, setIsLoadingChurches] = useState(true);
  const [churchesError, setChurchesError] = useState('');

  const selectedChurch = useMemo(
    () => churches.find((church) => church.id === selectedChurchId) ?? null,
    [churches, selectedChurchId],
  );

  useEffect(() => {
    void loadChurches();
  }, []);

  async function loadChurches() {
    try {
      setIsLoadingChurches(true);
      setChurchesError('');

      const data = await listChurches();
      setChurches(data);
      setSelectedChurchId((current) => current ?? data[0]?.id ?? null);
    } catch (error) {
      if (error instanceof ApiError) {
        setChurchesError(error.message);
      } else {
        setChurchesError('Nao foi possivel carregar as igrejas agora.');
      }
    } finally {
      setIsLoadingChurches(false);
    }
  }

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 80, paddingBottom: 128 }}
      showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="mb-8 rounded-[28px] border border-surfaceAlt bg-surface px-5 py-5">
        <View className="flex-row items-center justify-between">
          <View className="mr-4 flex-1">
            <Text className="text-xs font-semibold uppercase tracking-[0.22em] text-textMuted">
              Igreja selecionada
            </Text>
            <Text className="mt-2 text-xl font-extrabold text-textBase">
              {selectedChurch?.name || 'Selecione uma igreja'}
            </Text>
          </View>

          {isLoadingChurches ? <ActivityIndicator color="#6366F1" /> : null}
        </View>

        {!!churchesError && (
          <View className="mt-4 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
            <Text className="text-sm text-danger">{churchesError}</Text>
          </View>
        )}

        {!isLoadingChurches && churches.length > 0 ? (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            className="mt-5"
            contentContainerStyle={{ gap: 10 }}>
            {churches.map((church) => {
              const isSelected = church.id === selectedChurchId;

              return (
                <TouchableOpacity
                  key={church.id}
                  className={`rounded-full px-5 py-3 ${
                    isSelected ? 'bg-primary' : 'bg-background'
                  }`}
                  onPress={() => setSelectedChurchId(church.id)}>
                  <Text
                    className={`text-sm font-bold ${
                      isSelected ? 'text-white' : 'text-textMuted'
                    }`}>
                    {church.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        ) : null}

        {!isLoadingChurches && churches.length === 0 && !churchesError ? (
          <Text className="mt-4 text-sm leading-6 text-textMuted">
            Nenhuma igreja cadastrada para selecionar.
          </Text>
        ) : null}
      </View>

      <View className="rounded-[28px] border border-dashed border-surfaceAlt bg-surface px-6 py-10">
        <View className="h-14 w-14 items-center justify-center rounded-full bg-background">
          <Ionicons name="calendar-outline" size={26} color="#F8FAFC" />
        </View>
        <Text className="mt-5 text-xl font-bold text-textBase">Nenhuma escala para exibir</Text>
        <Text className="mt-3 text-base leading-6 text-textMuted">
          {selectedChurch
            ? `As escalas de ${selectedChurch.name} vao aparecer aqui quando estiverem cadastradas.`
            : 'Selecione uma igreja para visualizar as escalas.'}
        </Text>
      </View>
    </ScrollView>
  );
}
