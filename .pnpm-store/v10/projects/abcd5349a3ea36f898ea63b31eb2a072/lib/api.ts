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
  return process.env.EXPO_PUBLIC_API_URL?.trim() || '';
}

type RequestOptions = Omit<RequestInit, 'body'> & {
  body?: BodyInit | Record<string, unknown> | null;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}) {
  const baseUrl = getApiBaseUrl();
  
  if (!baseUrl) {
    throw new ApiError(
      'EXPO_PUBLIC_API_URL nao foi definida. Configure o arquivo .env do frontend.',
      0,
    );
  }

  const headers = new Headers(options.headers);
  headers.set('Accept', 'application/json');

  let body = options.body;
  if (body && typeof body === 'object' && !(body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
    body = JSON.stringify(body);
  }

  let response: Response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers,
      body,
    });
  } catch {
    throw new ApiError(
      'Nao foi possivel conectar com a API. Verifique o EXPO_PUBLIC_API_URL e se o backend esta rodando.',
      0,
    );
  }

  const contentType = response.headers.get('content-type') || '';
  const isJson = contentType.includes('application/json');
  const payload = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    const message =
      typeof payload === 'object' && payload && 'message' in payload
        ? String(payload.message)
        : 'Erro inesperado na requisicao.';

    throw new ApiError(message, response.status, payload);
  }

  return {
    data: payload as T,
    headers: response.headers,
    status: response.status,
  };
}
