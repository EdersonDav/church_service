import { Redirect } from 'expo-router';
import { useSessionStore } from '../stores/session-store';

export default function Index() {
  const token = useSessionStore((state) => state.token);
  const hasHydrated = useSessionStore((state) => state.hasHydrated);

  if (!hasHydrated) {
    return null;
  }

  return <Redirect href={token ? '/(tabs)' : '/login'} />;
}
