import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { useSessionStore } from '../stores/session-store';

export default function Index() {
  const token = useSessionStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    router.replace(token ? '/(tabs)' : '/login');
  }, [router, token]);

  return null;
}
