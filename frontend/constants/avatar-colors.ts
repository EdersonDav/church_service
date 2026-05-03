export const AVATAR_COLORS = [
  '#6366F1',
  '#22C55E',
  '#F97316',
  '#EC4899',
  '#38BDF8',
  '#F59E0B',
  '#14B8A6',
  '#A855F7',
];

export function getAvatarColor(seed: string, fallbackIndex?: number) {
  if (fallbackIndex !== undefined) {
    return AVATAR_COLORS[fallbackIndex % AVATAR_COLORS.length];
  }

  if (!seed) {
    return AVATAR_COLORS[0];
  }

  const hash = seed.split('').reduce((acc, char) => {
    return ((acc << 5) - acc + char.charCodeAt(0)) | 0;
  }, 0);

  return AVATAR_COLORS[Math.abs(hash) % AVATAR_COLORS.length];
}
