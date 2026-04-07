import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function ScalesScreen() {
  return (
    <View className="flex-1 bg-background pt-16">
      
      {/* Header do App Principal */}
      <View className="px-6 flex-row justify-between items-center mb-8">
        <View>
          <Text className="text-textMuted font-medium uppercase tracking-widest text-xs mb-1">Ministério de</Text>
          <Text className="text-3xl font-extrabold text-white">Louvor & Artes</Text>
        </View>
        <TouchableOpacity className="bg-surfaceAlt p-3 rounded-full">
          <Ionicons name="notifications-outline" size={24} color="#F8FAFC" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 100 }} showsVerticalScrollIndicator={false}>
        
        {/* Controle Pessoal - Próxima Participação */}
        <View className="bg-primary rounded-[24px] p-6 mb-8 shadow-lg shadow-primary/40 relative overflow-hidden">
          <View className="absolute -top-10 -right-10 bg-white/10 w-40 h-40 rounded-full" />
          <Text className="text-white/80 font-medium mb-1">Sua próxima escala</Text>
          <Text className="text-white text-2xl font-bold mb-4">Domingo, 10 de Maio</Text>
          <View className="flex-row items-center space-x-3">
            <View className="bg-white/20 px-3 py-1 rounded-lg">
              <Text className="text-white font-bold">🎸 Guitarra</Text>
            </View>
            <View className="bg-white/20 px-3 py-1 rounded-lg">
              <Text className="text-white font-bold">Culto das 19h</Text>
            </View>
          </View>
        </View>

        {/* Cabeçalho da Lista de Escalas */}
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-xl font-bold text-white">Escalas do Mês</Text>
          <TouchableOpacity>
            <Text className="text-primary font-bold">+ Nova Escala</Text>
          </TouchableOpacity>
        </View>

        {/* Card de Escala (Exemplo 1) */}
        <View className="bg-surface rounded-[24px] p-5 border border-surfaceAlt mb-4">
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-textBase font-bold text-lg">Culto de Celebração</Text>
              <Text className="text-textMuted text-sm">Domingo, 10 de Maio • 19:00</Text>
            </View>
            <TouchableOpacity className="bg-surfaceAlt p-2 rounded-full">
              <Ionicons name="ellipsis-horizontal" size={20} color="#94A3B8" />
            </TouchableOpacity>
          </View>

          {/* Time Escala / Funções */}
          <View className="space-y-3">
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-2">
                <Ionicons name="mic" size={16} color="#6366F1" />
                <Text className="text-textMuted font-medium w-20">Ministro</Text>
              </View>
              <Text className="text-textBase font-bold">Lucas Oliveira</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-2">
                <Ionicons name="musical-notes" size={16} color="#10B981" />
                <Text className="text-textMuted font-medium w-20">Bateria</Text>
              </View>
              <Text className="text-textBase font-bold">Marcos Silva</Text>
            </View>

            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center space-x-2">
                <Ionicons name="pulse" size={16} color="#A855F7" />
                <Text className="text-textMuted font-medium w-20">Baixo</Text>
              </View>
              {/* Exemplo de Alerta de Conflito/Falta */}
              <View className="bg-danger/20 px-2 py-1 rounded-lg">
                <Text className="text-danger font-bold text-xs uppercase">Necessita</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Card de Escala (Exemplo 2) */}
        <View className="bg-surface rounded-[24px] p-5 border border-surfaceAlt mb-4">
          <View className="flex-row justify-between items-start mb-4">
            <View>
              <Text className="text-textBase font-bold text-lg">Ensaio Geral</Text>
              <Text className="text-textMuted text-sm">Sábado, 09 de Maio • 16:00</Text>
            </View>
          </View>
          <View className="flex-row -space-x-3 mt-2">
            <View className="w-10 h-10 rounded-full bg-primary items-center justify-center border-2 border-surface"><Text className="text-white text-xs">LO</Text></View>
            <View className="w-10 h-10 rounded-full bg-secondary items-center justify-center border-2 border-surface"><Text className="text-white text-xs">MS</Text></View>
            <View className="w-10 h-10 rounded-full bg-emerald-500 items-center justify-center border-2 border-surface"><Text className="text-white text-xs">AB</Text></View>
            <View className="w-10 h-10 rounded-full bg-surfaceAlt items-center justify-center border-2 border-surface"><Text className="text-white text-xs">+3</Text></View>
          </View>
        </View>

      </ScrollView>
    </View>
  );
}
