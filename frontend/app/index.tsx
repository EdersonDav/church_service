import { Redirect } from 'expo-router';

export default function Index() {
  // Redireciona automaticamente da tela inicial para a nossa nova tela de Login
  return <Redirect href="/login" />;
}
