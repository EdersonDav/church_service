import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const options = [
  {
    title: 'Escalas dos meus setores',
    description: 'Veja as escalas dos setores que voce participa.',
    icon: 'people-outline' as const,
    route: '/calendar/my-scales' as const,
  },
  {
    title: 'Escalas da igreja',
    description: 'Veja a agenda consolidada de todos os setores da igreja.',
    icon: 'business-outline' as const,
    route: '/calendar/church-scales' as const,
  },
  {
    title: 'Indisponibilidade',
    description: 'Informe dias ou horarios em que voce nao pode ser escalado.',
    icon: 'calendar-outline' as const,
    route: '/calendar/unavailability' as const,
  },
];

export default function CalendarHubScreen() {
  const router = useRouter();

  return (
    <ScrollView
      className="flex-1 bg-background"
      contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 80, paddingBottom: 128 }}
      showsVerticalScrollIndicator={false}>
      <Stack.Screen options={{ headerShown: false }} />

      <View className="mb-8 rounded-[30px] bg-surface px-6 py-6">
        <Text className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
          Calendario
        </Text>
        <Text className="mt-3 text-3xl font-extrabold text-textBase">Escalas e disponibilidade</Text>
        <Text className="mt-3 text-base leading-6 text-textMuted">
          Escolha uma visualizacao para consultar escalas ou registrar sua indisponibilidade.
        </Text>
      </View>

      <View className="gap-3">
        {options.map((option) => (
          <TouchableOpacity
            key={option.route}
            className="rounded-[24px] border border-surfaceAlt bg-surface px-5 py-5"
            onPress={() => router.push(option.route)}>
            <View className="flex-row items-center">
              <View className="h-12 w-12 items-center justify-center rounded-full bg-background">
                <Ionicons name={option.icon} size={22} color="#38BDF8" />
              </View>
              <View className="ml-4 flex-1">
                <Text className="text-lg font-bold text-textBase">{option.title}</Text>
                <Text className="mt-1 text-sm leading-5 text-textMuted">{option.description}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#94A3B8" />
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
}
