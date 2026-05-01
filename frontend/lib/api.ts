import Constants from 'expo-constants';
import { Platform } from 'react-native';
import { useSessionStore } from '@/stores/session-store';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export function getApiBaseUrl() {
  const configuredBaseUrl = process.env.EXPO_PUBLIC_API_URL?.trim();
  const baseUrl = configuredBaseUrl || 'http://localhost:5555';

  if (!__DEV__ || Platform.OS === 'web') {
    return baseUrl;
  }

  const devHost = Constants.expoConfig?.hostUri?.split(':')[0]?.trim();

  if (!devHost) {
    return baseUrl;
  }

  return baseUrl.replace(/\/\/(localhost|127\.0\.0\.1)(?=[:/]|$)/i, `//${devHost}`);
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | Record<string, unknown> | null;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const baseUrl = getApiBaseUrl();

  if (!baseUrl) {
    console.error('EXPO_PUBLIC_API_URL is not defined in environment variables.');
    throw new ApiError(
      'EXPO_PUBLIC_API_URL nao foi definida. Configure o arquivo .env do frontend.',
      0,
    );
  }

  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  const token = useSessionStore.getState().token;

  if (token && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(body);
  }

  let response: Response;
  try {
    const requestUrl = new URL(path.replace(/^\//, ''), `${baseUrl.replace(/\/+$/, '')}/`);

    response = await fetch(requestUrl.toString(), {
      ...options,
      headers,
      body,
    });
  } catch (error) {
    console.error('Error fetching API:', error);
    throw new ApiError(
      'Nao foi possivel conectar com a API. Verifique o EXPO_PUBLIC_API_URL e se o backend esta rodando.',
      0,
    );
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    if (response.status === 401) {
      useSessionStore.getState().clearSession();
    }

    const responseMessage =
      typeof payload === 'object' && payload && 'message' in payload ? payload.message : null;

    const message = Array.isArray(responseMessage)
      ? responseMessage.join('\n')
      : responseMessage
        ? String(responseMessage)
        : response.status === 401
          ? 'Sessao expirada. Entre novamente.'
          : 'Erro inesperado na requisicao.';

    throw new ApiError(message, response.status, payload);
  }

  return {
    data: payload as T,
    headers: response.headers,
    status: response.status,
  };
}
