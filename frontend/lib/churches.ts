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

export type ChurchMember = {
  id: string;
  email: string;
  name: string;
  birthday?: string | null;
  is_verified: boolean;
  role?: string;
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
  church_id?: string;
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

export type SectorTask = {
  id: string;
  name: string;
  icon?: string;
  description?: string;
  sector_id: string;
};

export type ScaleParticipant = {
  user_id: string;
  task_id?: string | null;
  user_name?: string;
  task_name?: string;
};

export type SectorScale = {
  id: string;
  title: string;
  date: string;
  sector_id: string;
  participants: ScaleParticipant[];
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

type ListChurchMembersResponse = {
  church: Pick<Church, 'id' | 'name' | 'description'>;
  members: ChurchMember[];
};

type ListSectorMembersResponse = {
  sector: Sector;
  members: ChurchMember[];
};

type ListTasksResponse = {
  tasks: SectorTask[];
};

type ListScalesResponse = {
  scales: SectorScale[];
};

type GetScaleResponse = {
  scale: SectorScale;
};

type ListJoinRequestsResponse = {
  requests: ChurchJoinRequest[];
};

export type CreateChurchPayload = {
  name: string;
  description?: string;
};

export type SectorPayload = {
  name: string;
};

export type TaskPayload = {
  name: string;
  icon?: string;
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

export async function createSector(churchId: string, payload: SectorPayload) {
  const response = await apiRequest<Sector>(`/${churchId}/sectors`, {
    method: 'POST',
    body: payload,
  });

  return response.data;
}

export async function updateSector(churchId: string, sectorId: string, payload: SectorPayload) {
  const response = await apiRequest<Sector>(`/${churchId}/sectors/${sectorId}`, {
    method: 'PATCH',
    body: payload,
  });

  return response.data;
}

export async function deleteSector(churchId: string, sectorId: string) {
  const response = await apiRequest<{ message: string }>(`/${churchId}/sectors/${sectorId}`, {
    method: 'DELETE',
  });

  return response.data;
}

export async function listChurchMembers(churchId: string) {
  const response = await apiRequest<ListChurchMembersResponse>(`/churches/${churchId}/members`, {
    method: 'GET',
  });

  return response.data.members;
}

export async function listSectorMembers(churchId: string, sectorId: string) {
  const response = await apiRequest<ListSectorMembersResponse>(
    `/churches/${churchId}/sectors/${sectorId}/members`,
    {
      method: 'GET',
    },
  );

  return response.data.members;
}

export async function addSectorMember(churchId: string, sectorId: string, memberId: string) {
  const response = await apiRequest<{ message: string }>(
    `/churches/${churchId}/sectors/${sectorId}/members`,
    {
      method: 'POST',
      body: { member_id: memberId },
    },
  );

  return response.data;
}

export async function updateSectorMemberRole(
  churchId: string,
  sectorId: string,
  memberId: string,
  role: 'ADMIN' | 'MEMBER',
) {
  const response = await apiRequest<{ message: string }>(
    `/churches/${churchId}/sectors/${sectorId}/members/${memberId}/role`,
    {
      method: 'PATCH',
      body: { role },
    },
  );

  return response.data;
}

export async function removeSectorMember(churchId: string, sectorId: string, memberId: string) {
  const response = await apiRequest<{ message: string }>(
    `/churches/${churchId}/sectors/${sectorId}/members/${memberId}`,
    {
      method: 'DELETE',
    },
  );

  return response.data;
}

export async function listSectorMemberTasks(churchId: string, sectorId: string, memberId: string) {
  const response = await apiRequest<ListTasksResponse>(
    `/churches/${churchId}/sectors/${sectorId}/members/${memberId}/tasks`,
    {
      method: 'GET',
    },
  );

  return response.data.tasks;
}

export async function updateSectorMemberTasks(
  churchId: string,
  sectorId: string,
  memberId: string,
  taskIds: string[],
) {
  const response = await apiRequest<ListTasksResponse>(
    `/churches/${churchId}/sectors/${sectorId}/members/${memberId}/tasks`,
    {
      method: 'PUT',
      body: { task_ids: taskIds },
    },
  );

  return response.data.tasks;
}

export async function listSectorTasks(churchId: string, sectorId: string) {
  const response = await apiRequest<ListTasksResponse>(
    `/churches/${churchId}/sectors/${sectorId}/tasks`,
    {
      method: 'GET',
    },
  );

  return response.data.tasks;
}

export async function createSectorTask(churchId: string, sectorId: string, payload: TaskPayload) {
  const response = await apiRequest<SectorTask>(`/churches/${churchId}/sectors/${sectorId}/tasks`, {
    method: 'POST',
    body: payload,
  });

  return response.data;
}

export async function updateSectorTask(
  churchId: string,
  sectorId: string,
  taskId: string,
  payload: TaskPayload,
) {
  const response = await apiRequest<SectorTask>(
    `/churches/${churchId}/sectors/${sectorId}/tasks/${taskId}`,
    {
      method: 'PATCH',
      body: payload,
    },
  );

  return response.data;
}

export async function deleteSectorTask(churchId: string, sectorId: string, taskId: string) {
  const response = await apiRequest<{ message: string }>(
    `/churches/${churchId}/sectors/${sectorId}/tasks/${taskId}`,
    {
      method: 'DELETE',
    },
  );

  return response.data;
}

export async function listSectorScales(churchId: string, sectorId: string) {
  const response = await apiRequest<ListScalesResponse>(
    `/churches/${churchId}/sectors/${sectorId}/scales`,
    {
      method: 'GET',
    },
  );

  return response.data.scales;
}

export async function getSectorScale(churchId: string, sectorId: string, scaleId: string) {
  const response = await apiRequest<GetScaleResponse>(
    `/churches/${churchId}/sectors/${sectorId}/scales/${scaleId}`,
    {
      method: 'GET',
    },
  );

  return response.data.scale;
}

export async function createSectorScale(
  churchId: string,
  sectorId: string,
  payload: { title: string; date: string },
) {
  const response = await apiRequest<SectorScale>(
    `/churches/${churchId}/sectors/${sectorId}/scales`,
    {
      method: 'POST',
      body: payload,
    },
  );

  return response.data;
}

export async function updateSectorScale(
  churchId: string,
  sectorId: string,
  scaleId: string,
  payload: { title: string; date: string },
) {
  const response = await apiRequest<SectorScale>(
    `/churches/${churchId}/sectors/${sectorId}/scales/${scaleId}`,
    {
      method: 'PATCH',
      body: payload,
    },
  );

  return response.data;
}

export async function updateSectorScaleParticipants(
  churchId: string,
  sectorId: string,
  scaleId: string,
  participants: ScaleParticipant[],
) {
  const payloadParticipants = participants.map((participant) => ({
    user_id: participant.user_id,
    task_id: participant.task_id ?? null,
  }));

  const response = await apiRequest<SectorScale>(
    `/churches/${churchId}/sectors/${sectorId}/scales/${scaleId}/participants`,
    {
      method: 'PATCH',
      body: { participants: payloadParticipants },
    },
  );

  return response.data;
}

export async function deleteSectorScale(churchId: string, sectorId: string, scaleId: string) {
  const response = await apiRequest<{ message: string }>(
    `/churches/${churchId}/sectors/${sectorId}/scales/${scaleId}`,
    {
      method: 'DELETE',
    },
  );

  return response.data;
}

export async function listChurchEvents(churchId: string) {
  const response = await apiRequest<ListExtraEventsResponse>(`/churches/${churchId}/events`, {
    method: 'GET',
  });

  return response.data.events;
}
