import { ApiError, apiRequest } from '@/lib/api';

export type SessionUser = {
  email: string;
  name: string;
};

type LoginResponse = {
  data: SessionUser;
};

type RegisterResponse = {
  message: string;
};

type ForgotPasswordResponse = {
  message: string;
};

type VerifyCodeResponse = {
  data: {
    message: string;
  };
};

type ResendVerifyCodeResponse = {
  data: {
    message: string;
  };
};

export type LoginPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  birthday?: string;
};

export type VerifyCodePayload = {
  email: string;
  code: string;
};

export async function forgotPassword(email: string) {
  const response = await apiRequest<ForgotPasswordResponse>('/auth/forgot-password', {
    method: 'POST',
    body: { email },
  });

  return response.data;
}

export async function login(payload: LoginPayload) {
  const response = await apiRequest<LoginResponse>('/auth/login', {
    method: 'POST',
    body: payload,
  });

  const authorizationHeader =
    response.headers.get('Authorization') ?? response.headers.get('authorization');
  const token = authorizationHeader?.replace(/^Bearer\s+/i, '').trim();

  if (!token) {
    throw new ApiError('Token de acesso nao retornado pelo backend.', response.status);
  }

  return {
    token,
    user: response.data.data,
  };
}

export async function logout() {
  await apiRequest<{ message: string }>('/auth/logout', {
    method: 'POST',
  });
}

export async function register(payload: RegisterPayload) {
  const response = await apiRequest<RegisterResponse>('/users', {
    method: 'POST',
    body: payload,
  });

  return response.data;
}

export async function verifyCode(payload: VerifyCodePayload) {
  const response = await apiRequest<VerifyCodeResponse>('/verify-code/user', {
    method: 'POST',
    body: payload,
  });

  return response.data;
}

export async function resendVerifyCode(email: string) {
  const response = await apiRequest<ResendVerifyCodeResponse>('/verify-code/user/resend', {
    method: 'POST',
    body: { email },
  });

  return response.data;
}
