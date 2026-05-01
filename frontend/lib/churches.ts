import { apiRequest } from '@/lib/api';

export type Church = {
  id: string;
  name: string;
  description?: string;
  role?: 'ADMIN' | 'VOLUNTARY' | 'ROOT' | null;
  created_at?: string;
  updated_at?: string;
};

export type ChurchMembership = {
  id: string;
  role: string;
  user_id: string;
  church_id: string;
  church: Church;
  user: {
    id: string;
    email: string;
    name: string;
    birthday?: string | null;
    is_verified: boolean;
    created_at?: string;
    updated_at?: string;
  };
  created_at?: string;
  updated_at?: string;
};

export type ChurchJoinRequest = {
  id: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  user_id: string;
  church_id: string;
  church?: Pick<Church, 'id' | 'name' | 'description'>;
  user?: {
    id: string;
    email: string;
    name: string;
  };
  created_at?: string;
  updated_at?: string;
};

export type Sector = {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
};

export type ExtraEvent = {
  id: string;
  name: string;
  description?: string;
  type?: string;
  date: string;
  church_id: string;
  created_at?: string;
  updated_at?: string;
};

type ListChurchesResponse = {
  churches: Church[];
};

type ListSectorsResponse = {
  sectors: Sector[];
};

type ListExtraEventsResponse = {
  events: ExtraEvent[];
};

type ListJoinRequestsResponse = {
  requests: ChurchJoinRequest[];
};

export type CreateChurchPayload = {
  name: string;
  description?: string;
};

export async function listChurches() {
  const response = await apiRequest<ListChurchesResponse>('/churches', {
    method: 'GET',
  });

  return response.data.churches;
}

export async function searchChurches(name?: string) {
  const query = name?.trim() ? `?name=${encodeURIComponent(name.trim())}` : '';
  const response = await apiRequest<ListChurchesResponse>(`/churches/search${query}`, {
    method: 'GET',
  });

  return response.data.churches;
}

export async function createChurch(payload: CreateChurchPayload) {
  const response = await apiRequest<Church>('/churches', {
    method: 'POST',
    body: payload,
  });

  return response.data;
}

export async function deleteChurch(churchId: string) {
  const response = await apiRequest<{ message: string }>(`/churches/${churchId}`, {
    method: 'DELETE',
  });

  return response.data;
}

export async function joinChurch(churchId: string) {
  const response = await apiRequest<{ message: string }>(`/churches/${churchId}/join`, {
    method: 'POST',
  });

  return response.data;
}

export async function leaveChurch(churchId: string) {
  const response = await apiRequest<{ message: string }>(`/churches/${churchId}/leave`, {
    method: 'DELETE',
  });

  return response.data;
}

export async function listChurchJoinRequests() {
  const response = await apiRequest<ListJoinRequestsResponse>('/churches/join-requests', {
    method: 'GET',
  });

  return response.data.requests;
}

export async function approveChurchJoinRequest(requestId: string) {
  const response = await apiRequest<{ message: string }>(
    `/churches/join-requests/${requestId}/approve`,
    {
      method: 'POST',
    },
  );

  return response.data;
}

export async function getChurchMembership(churchId: string) {
  const response = await apiRequest<ChurchMembership>(`/churches/${churchId}`, {
    method: 'GET',
  });

  return response.data;
}

export async function listChurchSectors(churchId: string) {
  const response = await apiRequest<ListSectorsResponse>(`/${churchId}/sectors`, {
    method: 'GET',
  });

  return response.data.sectors;
}

export async function listChurchEvents(churchId: string) {
  const response = await apiRequest<ListExtraEventsResponse>(`/churches/${churchId}/events`, {
    method: 'GET',
  });

  return response.data.events;
}
