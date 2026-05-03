import { ReactNode } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getAvatarColor } from '@/constants/avatar-colors';

type ResourceCardAvatar = {
  id: string;
  initials: string;
  color?: string;
};

type ResourceCardProps = {
  title: string;
  subtitle?: string;
  description?: string;
  badge?: {
    label: string;
    variant?: 'default' | 'success';
  };
  count: number;
  avatars: ResourceCardAvatar[];
  hiddenCount?: number;
  countIcon?: keyof typeof Ionicons.glyphMap;
  actions?: ReactNode;
  onPress?: () => void;
};

export function ResourceCard({
  title,
  subtitle,
  description,
  badge,
  count,
  avatars,
  hiddenCount = 0,
  countIcon = 'people-outline',
  actions,
  onPress,
}: ResourceCardProps) {
  return (
    <Pressable
      className="mb-3 rounded-[24px] border border-surfaceAlt bg-surface px-5 py-5"
      disabled={!onPress}
      onPress={onPress}>
      <View className="flex-row items-start justify-between">
        <View className="mr-4 flex-1">
          <Text className="text-lg font-bold text-textBase" numberOfLines={1}>
            {title}
          </Text>

          {subtitle ? (
            <Text className="mt-2 text-sm font-semibold text-accent" numberOfLines={1}>
              {subtitle}
            </Text>
          ) : null}

          {badge ? (
            <View
              className={`mt-3 self-start rounded-full px-3 py-2 ${
                badge.variant === 'success' ? 'bg-success/10' : 'bg-primary/10'
              }`}>
              <Text
                className={`text-xs font-extrabold ${
                  badge.variant === 'success' ? 'text-success' : 'text-accent'
                }`}>
                {badge.label}
              </Text>
            </View>
          ) : null}

          {description ? (
            <Text className="mt-2 text-sm leading-6 text-textMuted" numberOfLines={2}>
              {description}
            </Text>
          ) : null}

          <View className="mt-4 flex-row items-center">
            <View className="mr-3 flex-row items-center rounded-full bg-background px-3 py-2">
              <Ionicons name={countIcon} size={15} color="#38BDF8" />
              <Text className="ml-2 text-xs font-bold text-textBase">{count}</Text>
            </View>

            <View className="h-10 flex-row items-center">
              {avatars.map((avatar, index) => (
                <View
                  key={avatar.id}
                  className="h-10 w-10 items-center justify-center rounded-full border-2 border-surface"
                  style={{
                    backgroundColor: avatar.color ?? getAvatarColor(avatar.id, index),
                    marginLeft: index === 0 ? 0 : -12,
                  }}>
                  <Text className="text-sm font-extrabold text-white">{avatar.initials}</Text>
                </View>
              ))}

              {hiddenCount > 0 ? (
                <View
                  className="h-10 w-10 items-center justify-center rounded-full border-2 border-surface bg-background"
                  style={{ marginLeft: avatars.length > 0 ? -12 : 0 }}>
                  <Text className="text-sm font-extrabold text-textBase">+{hiddenCount}</Text>
                </View>
              ) : null}
            </View>
          </View>
        </View>

        {actions ? <View className="flex-row gap-2">{actions}</View> : null}
      </View>
    </Pressable>
  );
}
