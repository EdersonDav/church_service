import { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ApiError } from '@/lib/api';
import {
  ChurchMember,
  ScaleParticipant,
  SectorScale,
  SectorTask,
  createSectorScale,
  createSectorTask,
  deleteSectorScale,
  deleteSectorTask,
  getChurchMembership,
  listSectorMembers,
  listSectorMemberTasks,
  listSectorScales,
  listSectorTasks,
  updateSectorMemberTasks,
  updateSectorScale,
  updateSectorScaleParticipants,
  updateSectorTask,
} from '@/lib/churches';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];

function formatScaleDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Data invalida';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function toDateInputValue(value?: string) {
  const date = value ? new Date(value) : new Date();

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  const offset = date.getTimezoneOffset() * 60000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function fromDateInputValue(value: string) {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return '';
  }

  return parsedDate.toISOString();
}

function getCalendarDays(monthDate: Date) {
  const year = monthDate.getFullYear();
  const month = monthDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const startDate = new Date(year, month, 1 - firstDay.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(startDate);
    date.setDate(startDate.getDate() + index);
    return date;
  });
}

function getInitials(name?: string) {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (!words.length) {
    return '?';
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0))
    .join('')
    .toUpperCase();
}

export default function SectorDetailsScreen() {
  const router = useRouter();
  const { churchId, sectorId, sectorName } = useLocalSearchParams<{
    churchId?: string;
    sectorId?: string;
    sectorName?: string;
  }>();
  const [tasks, setTasks] = useState<SectorTask[]>([]);
  const [scales, setScales] = useState<SectorScale[]>([]);
  const [members, setMembers] = useState<ChurchMember[]>([]);
  const [memberTasksByUser, setMemberTasksByUser] = useState<Record<string, SectorTask[]>>({});
  const [currentUserId, setCurrentUserId] = useState('');
  const [churchRole, setChurchRole] = useState('');
  const [selectedTab, setSelectedTab] = useState<'tasks' | 'scales'>('scales');
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const [taskFormOpen, setTaskFormOpen] = useState(false);
  const [taskBeingEdited, setTaskBeingEdited] = useState<SectorTask | null>(null);
  const [taskBeingDeleted, setTaskBeingDeleted] = useState<SectorTask | null>(null);
  const [taskName, setTaskName] = useState('');
  const [taskDescription, setTaskDescription] = useState('');
  const [taskIcon, setTaskIcon] = useState('');

  const [scaleFormOpen, setScaleFormOpen] = useState(false);
  const [scaleBeingEdited, setScaleBeingEdited] = useState<SectorScale | null>(null);
  const [scaleBeingDeleted, setScaleBeingDeleted] = useState<SectorScale | null>(null);
  const [scaleTitle, setScaleTitle] = useState('');
  const [scaleDate, setScaleDate] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [participantsFormOpen, setParticipantsFormOpen] = useState(false);
  const [scaleManagingParticipants, setScaleManagingParticipants] = useState<SectorScale | null>(null);
  const [draftParticipants, setDraftParticipants] = useState<ScaleParticipant[]>([]);

  const [memberTasksFormOpen, setMemberTasksFormOpen] = useState(false);
  const [memberManagingTasks, setMemberManagingTasks] = useState<ChurchMember | null>(null);
  const [draftMemberTaskIds, setDraftMemberTaskIds] = useState<string[]>([]);

  const currentMember = useMemo(
    () => members.find((member) => member.id === currentUserId) ?? null,
    [currentUserId, members],
  );
  const isChurchAdmin = churchRole === 'ADMIN' || churchRole === 'ROOT';
  const isSectorAdmin = currentMember?.role === 'ADMIN';
  const canManageSector = isChurchAdmin || isSectorAdmin;
  const isBusy = isSaving || isDeleting;

  const loadSectorData = useCallback(
    async (isPullToRefresh = false) => {
      if (!churchId || !sectorId) {
        return;
      }

      try {
        if (isPullToRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setErrorMessage('');
        const [membershipResult, membersResult, tasksResult, scalesResult] = await Promise.all([
          getChurchMembership(churchId),
          listSectorMembers(churchId, sectorId),
          listSectorTasks(churchId, sectorId),
          listSectorScales(churchId, sectorId),
        ]);

        const requesterId = membershipResult.user_id || membershipResult.user?.id || '';
        const memberTaskEntries = await Promise.all(
          membersResult.map(async (member) => [member.id, await listSectorMemberTasks(churchId, sectorId, member.id)] as const),
        );

        setCurrentUserId(requesterId);
        setChurchRole(membershipResult.role);
        setMembers(membersResult);
        setMemberTasksByUser(Object.fromEntries(memberTaskEntries));
        setTasks(tasksResult);
        setScales(scalesResult);
      } catch (error) {
        if (error instanceof ApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Nao foi possivel carregar os dados do setor agora.');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [churchId, sectorId],
  );

  useEffect(() => {
    void loadSectorData();
  }, [loadSectorData]);

  function closeForms() {
    if (isBusy) {
      return;
    }

    setTaskFormOpen(false);
    setTaskBeingEdited(null);
    setTaskBeingDeleted(null);
    setScaleFormOpen(false);
    setScaleBeingEdited(null);
    setScaleBeingDeleted(null);
    setParticipantsFormOpen(false);
    setScaleManagingParticipants(null);
    setDraftParticipants([]);
    setMemberTasksFormOpen(false);
    setMemberManagingTasks(null);
    setDraftMemberTaskIds([]);
    setFormErrorMessage('');
  }

  function openCreateTask() {
    setTaskBeingEdited(null);
    setTaskName('');
    setTaskDescription('');
    setTaskIcon('');
    setFormErrorMessage('');
    setTaskFormOpen(true);
  }

  function openEditTask(task: SectorTask) {
    setTaskBeingEdited(task);
    setTaskName(task.name);
    setTaskDescription(task.description ?? '');
    setTaskIcon(task.icon ?? '');
    setFormErrorMessage('');
    setTaskFormOpen(true);
  }

  async function handleSaveTask() {
    if (!churchId || !sectorId) {
      return;
    }

    const trimmedName = taskName.trim();

    if (trimmedName.length < 3 || trimmedName.length > 25) {
      setFormErrorMessage('O nome deve ter entre 3 e 25 caracteres.');
      return;
    }

    try {
      setIsSaving(true);
      setFormErrorMessage('');
      const payload = {
        name: trimmedName,
        description: taskDescription.trim() || undefined,
        icon: taskIcon.trim() || undefined,
      };
      const savedTask = taskBeingEdited
        ? await updateSectorTask(churchId, sectorId, taskBeingEdited.id, payload)
        : await createSectorTask(churchId, sectorId, payload);

      setTasks((current) =>
        taskBeingEdited
          ? current.map((task) => (task.id === savedTask.id ? savedTask : task))
          : [...current, savedTask],
      );
      closeForms();
    } catch (error) {
      if (error instanceof ApiError) {
        setFormErrorMessage(error.message);
      } else {
        setFormErrorMessage('Nao foi possivel salvar a tarefa agora.');
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteTask() {
    if (!churchId || !sectorId || !taskBeingDeleted) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteSectorTask(churchId, sectorId, taskBeingDeleted.id);
      setTasks((current) => current.filter((task) => task.id !== taskBeingDeleted.id));
      setScales((current) =>
        current.map((scale) => ({
          ...scale,
          participants: scale.participants.filter(
            (participant) => participant.task_id !== taskBeingDeleted.id,
          ),
        })),
      );
      closeForms();
    } catch (error) {
      if (error instanceof ApiError) {
        setFormErrorMessage(error.message);
      } else {
        setFormErrorMessage('Nao foi possivel deletar a tarefa agora.');
      }
    } finally {
      setIsDeleting(false);
    }
  }

  function openCreateScale() {
    setScaleBeingEdited(null);
    setScaleTitle('');
    setScaleDate(toDateInputValue());
    setCalendarMonth(new Date());
    setFormErrorMessage('');
    setScaleFormOpen(true);
  }

  function openEditScale(scale: SectorScale) {
    setScaleBeingEdited(scale);
    setScaleTitle(scale.title);
    setScaleDate(toDateInputValue(scale.date));
    setCalendarMonth(new Date(scale.date));
    setFormErrorMessage('');
    setScaleFormOpen(true);
  }

  function selectScaleDate(date: Date) {
    const currentDate = scaleDate ? new Date(scaleDate) : new Date();
    const nextDate = new Date(date);

    nextDate.setHours(
      Number.isNaN(currentDate.getTime()) ? 19 : currentDate.getHours(),
      Number.isNaN(currentDate.getTime()) ? 0 : currentDate.getMinutes(),
      0,
      0,
    );

    setScaleDate(toDateInputValue(nextDate.toISOString()));
    setCalendarMonth(nextDate);
  }

  function updateScaleTime(value: string) {
    const [hoursValue, minutesValue] = value.split(':');
    const hours = Number(hoursValue);
    const minutes = Number(minutesValue);
    const currentDate = scaleDate ? new Date(scaleDate) : new Date();

    if (Number.isNaN(hours) || Number.isNaN(minutes) || Number.isNaN(currentDate.getTime())) {
      return;
    }

    currentDate.setHours(hours, minutes, 0, 0);
    setScaleDate(toDateInputValue(currentDate.toISOString()));
  }

  async function handleSaveScale() {
    if (!churchId || !sectorId) {
      return;
    }

    const isoDate = fromDateInputValue(scaleDate.trim());
    const trimmedTitle = scaleTitle.trim();

    if (trimmedTitle.length < 3 || trimmedTitle.length > 80) {
      setFormErrorMessage('O titulo deve ter entre 3 e 80 caracteres.');
      return;
    }

    if (!isoDate) {
      setFormErrorMessage('Informe uma data valida.');
      return;
    }

    try {
      setIsSaving(true);
      setFormErrorMessage('');
      const savedScale = scaleBeingEdited
        ? await updateSectorScale(churchId, sectorId, scaleBeingEdited.id, {
            title: trimmedTitle,
            date: isoDate,
          })
        : await createSectorScale(churchId, sectorId, {
            title: trimmedTitle,
            date: isoDate,
          });

      setScales((current) =>
        scaleBeingEdited
          ? current.map((scale) => (scale.id === savedScale.id ? savedScale : scale))
          : [...current, savedScale].sort(
              (left, right) => new Date(left.date).getTime() - new Date(right.date).getTime(),
            ),
      );
      closeForms();
    } catch (error) {
      if (error instanceof ApiError) {
        setFormErrorMessage(error.message);
      } else {
        setFormErrorMessage('Nao foi possivel salvar a escala agora.');
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteScale() {
    if (!churchId || !sectorId || !scaleBeingDeleted) {
      return;
    }

    try {
      setIsDeleting(true);
      await deleteSectorScale(churchId, sectorId, scaleBeingDeleted.id);
      setScales((current) => current.filter((scale) => scale.id !== scaleBeingDeleted.id));
      closeForms();
    } catch (error) {
      if (error instanceof ApiError) {
        setFormErrorMessage(error.message);
      } else {
        setFormErrorMessage('Nao foi possivel deletar a escala agora.');
      }
    } finally {
      setIsDeleting(false);
    }
  }

  function openScaleDetails(scale: SectorScale) {
    if (!churchId || !sectorId) {
      return;
    }

    router.push({
      pathname: '/scale/[scaleId]',
      params: {
        churchId,
        sectorId,
        sectorName: sectorName || 'Setor',
        scaleId: scale.id,
      },
    });
  }

  function openParticipantsForm(scale: SectorScale) {
    setScaleManagingParticipants(scale);
    setDraftParticipants(scale.participants);
    setFormErrorMessage('');
    setParticipantsFormOpen(true);
  }

  function toggleDraftMember(member: ChurchMember) {
    setDraftParticipants((current) => {
      const alreadySelected = current.some((participant) => participant.user_id === member.id);

      if (alreadySelected) {
        return current.filter((participant) => participant.user_id !== member.id);
      }

      const presetTask = memberTasksByUser[member.id]?.[0] ?? null;

      return [
        ...current,
        {
          task_id: presetTask?.id ?? null,
          task_name: presetTask?.name,
          user_id: member.id,
          user_name: member.name,
        },
      ];
    });
  }

  function setDraftParticipantTask(member: ChurchMember, taskId: string) {
    setDraftParticipants((current) =>
      current.map((participant) => {
        if (participant.user_id !== member.id) {
          return participant;
        }

        const task = tasks.find((item) => item.id === taskId);

        return {
          ...participant,
          task_id: task?.id ?? null,
          task_name: task?.name,
        };
      }),
    );
  }

  function openMemberTasksForm(member: ChurchMember) {
    setMemberManagingTasks(member);
    setDraftMemberTaskIds((memberTasksByUser[member.id] ?? []).map((task) => task.id));
    setFormErrorMessage('');
    setMemberTasksFormOpen(true);
  }

  function toggleMemberProfileTask(taskId: string) {
    setDraftMemberTaskIds((current) =>
      current.includes(taskId) ? current.filter((id) => id !== taskId) : [...current, taskId],
    );
  }

  async function handleSaveMemberTasks() {
    if (!churchId || !sectorId || !memberManagingTasks) {
      return;
    }

    try {
      setIsSaving(true);
      setFormErrorMessage('');
      const savedTasks = await updateSectorMemberTasks(
        churchId,
        sectorId,
        memberManagingTasks.id,
        draftMemberTaskIds,
      );
      setMemberTasksByUser((current) => ({
        ...current,
        [memberManagingTasks.id]: savedTasks,
      }));
      closeForms();
    } catch (error) {
      if (error instanceof ApiError) {
        setFormErrorMessage(error.message);
      } else {
        setFormErrorMessage('Nao foi possivel salvar as tarefas do membro agora.');
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleSaveParticipants() {
    if (!churchId || !sectorId || !scaleManagingParticipants) {
      return;
    }

    try {
      setIsSaving(true);
      setFormErrorMessage('');
      const savedScale = await updateSectorScaleParticipants(
        churchId,
        sectorId,
        scaleManagingParticipants.id,
        draftParticipants,
      );
      setScales((current) =>
        current.map((scale) => (scale.id === savedScale.id ? savedScale : scale)),
      );
      closeForms();
    } catch (error) {
      if (error instanceof ApiError) {
        setFormErrorMessage(error.message);
      } else {
        setFormErrorMessage('Nao foi possivel salvar os participantes agora.');
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 72, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => loadSectorData(true)} />
        }
        showsVerticalScrollIndicator={false}>
        <View className="mb-8 flex-row items-center">
          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full bg-surface"
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
          </TouchableOpacity>
        </View>

        <View className="mb-6 rounded-[30px] bg-surface px-6 py-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
              Setor
            </Text>
            <View className="rounded-full bg-background px-4 py-2">
              <Text className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                {canManageSector ? 'Admin do setor' : 'Membro'}
              </Text>
            </View>
          </View>
          <Text className="mt-3 text-3xl font-extrabold text-textBase">
            {sectorName || 'Setor'}
          </Text>
          <View className="mt-5 flex-row gap-3">
            <View className="flex-row items-center rounded-full bg-background px-4 py-2">
              <Ionicons name="calendar-outline" size={15} color="#38BDF8" />
              <Text className="ml-2 text-xs font-bold text-textBase">{scales.length}</Text>
            </View>
            <View className="flex-row items-center rounded-full bg-background px-4 py-2">
              <Ionicons name="list-outline" size={15} color="#94A3B8" />
              <Text className="ml-2 text-xs font-bold text-textBase">{tasks.length}</Text>
            </View>
            <View className="flex-row items-center rounded-full bg-background px-4 py-2">
              <Ionicons name="people-outline" size={15} color="#38BDF8" />
              <Text className="ml-2 text-xs font-bold text-textBase">{members.length}</Text>
            </View>
          </View>
        </View>

        {!!errorMessage && (
          <View className="mb-5 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
            <Text className="text-sm text-danger">{errorMessage}</Text>
          </View>
        )}

        <View className="mb-5 flex-row rounded-2xl bg-surface p-1">
          <TouchableOpacity
            className={`flex-1 items-center rounded-xl py-3 ${
              selectedTab === 'scales' ? 'bg-primary' : ''
            }`}
            onPress={() => setSelectedTab('scales')}>
            <Text className="font-bold text-white">Escalas</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`flex-1 items-center rounded-xl py-3 ${
              selectedTab === 'tasks' ? 'bg-primary' : ''
            }`}
            onPress={() => setSelectedTab('tasks')}>
            <Text className="font-bold text-white">Tarefas</Text>
          </TouchableOpacity>
        </View>

        {!isLoading && members.length > 0 ? (
          <View className="mb-5">
            <View className="mb-3 flex-row items-center justify-between">
              <Text className="text-base font-bold text-textBase">Membros</Text>
              <Text className="text-xs font-semibold text-textMuted">
                {members.length} no setor
              </Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {members.map((member) => {
                const memberTasks = memberTasksByUser[member.id] ?? [];

                return (
                  <TouchableOpacity
                    key={member.id}
                    className="mr-3 min-w-[160px] rounded-2xl border border-surfaceAlt bg-surface px-4 py-3"
                    onPress={() => (canManageSector ? openMemberTasksForm(member) : undefined)}
                    disabled={!canManageSector}>
                    <View className="flex-row items-center">
                      <View className="h-9 w-9 items-center justify-center rounded-full bg-primary">
                        <Text className="font-bold uppercase text-white">
                          {member.name?.charAt(0) || '?'}
                        </Text>
                      </View>
                      <View className="ml-3 flex-1">
                        <Text className="text-sm font-bold text-textBase" numberOfLines={1}>
                          {member.name}
                        </Text>
                        <Text className="mt-1 text-xs text-textMuted" numberOfLines={1}>
                          {memberTasks.length
                            ? memberTasks.map((task) => task.name).join(', ')
                            : 'Sem tarefa fixa'}
                        </Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        ) : null}

        {isLoading ? (
          <View className="items-center rounded-[28px] bg-surface px-5 py-10">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="mt-4 text-sm text-textMuted">Carregando setor...</Text>
          </View>
        ) : null}

        {!isLoading && selectedTab === 'tasks' ? (
          <View>
            <View className="mb-4 flex-row items-center justify-between">
              <View className="mr-4 flex-1">
                <Text className="text-xl font-bold text-textBase">Tarefas</Text>
                <Text className="mt-1 text-sm text-textMuted">
                  Funcoes usadas para montar as escalas.
                </Text>
              </View>
              {canManageSector ? (
                <TouchableOpacity
                  className="h-10 w-10 items-center justify-center rounded-full bg-surfaceAlt"
                  onPress={openCreateTask}>
                  <Ionicons name="add-outline" size={20} color="#FFFFFF" />
                </TouchableOpacity>
              ) : null}
            </View>

            {tasks.length === 0 ? (
              <View className="rounded-[26px] border border-dashed border-surfaceAlt bg-surface px-5 py-6">
                <Text className="text-base font-semibold text-textBase">
                  Nenhuma tarefa cadastrada
                </Text>
                <Text className="mt-2 text-sm leading-6 text-textMuted">
                  As funcoes deste setor aparecem aqui quando forem criadas.
                </Text>
              </View>
            ) : (
              tasks.map((task) => (
                <View
                  key={task.id}
                  className="mb-2 rounded-2xl border border-surfaceAlt bg-surface px-4 py-4">
                  <View className="flex-row items-start justify-between">
                    <View className="mr-4 flex-1">
                      <Text className="text-base font-bold text-textBase">{task.name}</Text>
                      <Text className="mt-2 text-sm leading-6 text-textMuted">
                        {task.description?.trim() || 'Sem descricao cadastrada.'}
                      </Text>
                    </View>
                    {canManageSector ? (
                      <View className="flex-row gap-2">
                        <TouchableOpacity
                          className="h-9 w-9 items-center justify-center rounded-full bg-background"
                          onPress={() => openEditTask(task)}>
                          <Ionicons name="create-outline" size={17} color="#94A3B8" />
                        </TouchableOpacity>
                        <TouchableOpacity
                          className="h-9 w-9 items-center justify-center rounded-full bg-danger/10"
                          onPress={() => {
                            setTaskBeingDeleted(task);
                            setFormErrorMessage('');
                          }}>
                          <Ionicons name="trash-outline" size={17} color="#F87171" />
                        </TouchableOpacity>
                      </View>
                    ) : null}
                  </View>
                </View>
              ))
            )}
          </View>
        ) : null}

        {!isLoading && selectedTab === 'scales' ? (
          <View>
            <View className="mb-4 flex-row items-center justify-between">
              <Text className="text-2xl font-bold text-textBase">Escalas</Text>
              {canManageSector ? (
                <TouchableOpacity
                  className="h-11 w-11 items-center justify-center rounded-full bg-primary"
                  onPress={openCreateScale}>
                  <Ionicons name="add-outline" size={22} color="#FFFFFF" />
                </TouchableOpacity>
              ) : null}
            </View>

            {scales.length === 0 ? (
              <View className="rounded-[26px] border border-dashed border-surfaceAlt bg-surface px-5 py-6">
                <Text className="text-base font-semibold text-textBase">
                  Nenhuma escala cadastrada
                </Text>
                <Text className="mt-2 text-sm leading-6 text-textMuted">
                  As escalas do setor aparecem aqui para todos os membros.
                </Text>
              </View>
            ) : (
              scales.map((scale) => {
                const visibleParticipants = scale.participants.slice(0, 3);
                const remainingParticipants = Math.max(scale.participants.length - visibleParticipants.length, 0);

                return (
                  <Pressable
                    key={scale.id}
                    className="mb-3 rounded-[22px] border border-surfaceAlt bg-surface px-4 py-4"
                    onPress={() => openScaleDetails(scale)}>
                    <View className="flex-row items-center justify-between">
                      <View className="mr-3 flex-1">
                        <Text className="text-base font-bold text-textBase" numberOfLines={1}>
                          {scale.title}
                        </Text>
                        <Text className="mt-1 text-sm font-semibold text-accent" numberOfLines={1}>
                          {formatScaleDate(scale.date)}
                        </Text>
                        <Text className="mt-1 text-sm text-textMuted" numberOfLines={1}>
                          {scale.participants.length} participante(s)
                        </Text>
                      </View>

                      <View className="items-end">
                        <View className="h-10 min-w-[86px] flex-row items-center justify-end">
                          {visibleParticipants.length === 0 ? (
                            <View className="h-9 w-9 items-center justify-center rounded-full bg-background">
                              <Ionicons name="people-outline" size={17} color="#64748B" />
                            </View>
                          ) : (
                            visibleParticipants.map((participant, index) => (
                              <View
                                key={participant.user_id}
                                className="-ml-2 h-9 w-9 items-center justify-center rounded-full border-2 border-surface bg-primary"
                                style={{ zIndex: visibleParticipants.length - index }}>
                                <Text className="text-xs font-extrabold text-white">
                                  {getInitials(participant.user_name)}
                                </Text>
                              </View>
                            ))
                          )}
                          {remainingParticipants > 0 ? (
                            <View className="-ml-2 h-9 w-9 items-center justify-center rounded-full border-2 border-surface bg-background">
                              <Text className="text-xs font-extrabold text-textBase">
                                +{remainingParticipants}
                              </Text>
                            </View>
                          ) : null}
                        </View>

                        {canManageSector ? (
                          <View className="mt-3 flex-row gap-2">
                            <Pressable
                              className="h-8 w-8 items-center justify-center rounded-full bg-background"
                              onPress={(event) => {
                                event.stopPropagation();
                                openParticipantsForm(scale);
                              }}>
                              <Ionicons name="people-outline" size={16} color="#38BDF8" />
                            </Pressable>
                            <Pressable
                              className="h-8 w-8 items-center justify-center rounded-full bg-background"
                              onPress={(event) => {
                                event.stopPropagation();
                                openEditScale(scale);
                              }}>
                              <Ionicons name="create-outline" size={16} color="#94A3B8" />
                            </Pressable>
                            <Pressable
                              className="h-8 w-8 items-center justify-center rounded-full bg-danger/10"
                              onPress={(event) => {
                                event.stopPropagation();
                                setScaleBeingDeleted(scale);
                                setFormErrorMessage('');
                              }}>
                              <Ionicons name="trash-outline" size={16} color="#F87171" />
                            </Pressable>
                          </View>
                        ) : null}
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        ) : null}
      </ScrollView>

      <Modal visible={taskFormOpen} transparent animationType="fade" onRequestClose={closeForms}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable className="flex-1 justify-center bg-black/60 px-5" onPress={closeForms}>
            <Pressable
              className="rounded-[28px] border border-surfaceAlt bg-surface px-5 py-5"
              onPress={(event) => event.stopPropagation()}>
              <Text className="text-xl font-bold text-textBase">
                {taskBeingEdited ? 'Editar tarefa' : 'Nova tarefa'}
              </Text>
              <View className="mt-5 gap-4">
                <TextInput
                  className="rounded-2xl border border-surfaceAlt bg-background px-4 py-4 text-base text-textBase"
                  placeholder="Nome da tarefa"
                  placeholderTextColor="#64748B"
                  cursorColor="#6366F1"
                  value={taskName}
                  onChangeText={setTaskName}
                  maxLength={25}
                />
                <TextInput
                  className="min-h-[96px] rounded-2xl border border-surfaceAlt bg-background px-4 py-4 text-base text-textBase"
                  placeholder="Descricao"
                  placeholderTextColor="#64748B"
                  cursorColor="#6366F1"
                  multiline
                  textAlignVertical="top"
                  value={taskDescription}
                  onChangeText={setTaskDescription}
                />
                <TextInput
                  className="rounded-2xl border border-surfaceAlt bg-background px-4 py-4 text-base text-textBase"
                  placeholder="URL do icone (opcional)"
                  placeholderTextColor="#64748B"
                  cursorColor="#6366F1"
                  value={taskIcon}
                  onChangeText={setTaskIcon}
                  autoCapitalize="none"
                />
              </View>
              {!!formErrorMessage && (
                <View className="mt-4 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
                  <Text className="text-sm text-danger">{formErrorMessage}</Text>
                </View>
              )}
              <View className="mt-5 flex-row gap-3">
                <TouchableOpacity className="flex-1 items-center rounded-2xl bg-background py-4" onPress={closeForms}>
                  <Text className="font-bold text-textBase">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 items-center rounded-2xl py-4 ${isSaving ? 'bg-surfaceAlt' : 'bg-primary'}`}
                  onPress={handleSaveTask}
                  disabled={isSaving}>
                  <Text className="font-bold text-white">{isSaving ? 'Salvando...' : 'Salvar'}</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={scaleFormOpen} transparent animationType="fade" onRequestClose={closeForms}>
        <Pressable className="flex-1 justify-center bg-black/60 px-5" onPress={closeForms}>
          <Pressable
            className="max-h-[90%] rounded-[28px] border border-surfaceAlt bg-surface px-5 py-5"
            onPress={(event) => event.stopPropagation()}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text className="text-xl font-bold text-textBase">
                {scaleBeingEdited ? 'Editar escala' : 'Nova escala'}
              </Text>

              <TextInput
                className="mt-5 rounded-2xl border border-surfaceAlt bg-background px-4 py-4 text-base text-textBase"
                placeholder="Titulo da escala"
                placeholderTextColor="#64748B"
                cursorColor="#6366F1"
                value={scaleTitle}
                onChangeText={setScaleTitle}
                maxLength={80}
              />

              <View className="mt-5 rounded-2xl border border-surfaceAlt bg-background px-4 py-4">
                <View className="mb-4 flex-row items-center justify-between">
                  <TouchableOpacity
                    className="h-9 w-9 items-center justify-center rounded-full bg-surface"
                    onPress={() =>
                      setCalendarMonth(
                        new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1),
                      )
                    }>
                    <Ionicons name="chevron-back" size={18} color="#F8FAFC" />
                  </TouchableOpacity>
                  <Text className="text-base font-bold text-textBase">
                    {new Intl.DateTimeFormat('pt-BR', {
                      month: 'long',
                      year: 'numeric',
                    }).format(calendarMonth)}
                  </Text>
                  <TouchableOpacity
                    className="h-9 w-9 items-center justify-center rounded-full bg-surface"
                    onPress={() =>
                      setCalendarMonth(
                        new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1),
                      )
                    }>
                    <Ionicons name="chevron-forward" size={18} color="#F8FAFC" />
                  </TouchableOpacity>
                </View>

                <View className="mb-2 flex-row">
                  {weekDays.map((day, index) => (
                    <Text
                      key={`${day}-${index}`}
                      className="flex-1 text-center text-xs font-bold text-textMuted">
                      {day}
                    </Text>
                  ))}
                </View>

                <View className="flex-row flex-wrap">
                  {getCalendarDays(calendarMonth).map((date) => {
                    const selectedDate = scaleDate ? new Date(scaleDate) : null;
                    const isCurrentMonth = date.getMonth() === calendarMonth.getMonth();
                    const isSelected =
                      selectedDate &&
                      date.getFullYear() === selectedDate.getFullYear() &&
                      date.getMonth() === selectedDate.getMonth() &&
                      date.getDate() === selectedDate.getDate();

                    return (
                      <TouchableOpacity
                        key={date.toISOString()}
                        className="w-[14.28%] p-1"
                        onPress={() => selectScaleDate(date)}>
                        <View
                          className={`aspect-square items-center justify-center rounded-full ${
                            isSelected ? 'bg-primary' : ''
                          }`}>
                          <Text
                            className={`text-sm font-bold ${
                              isSelected
                                ? 'text-white'
                                : isCurrentMonth
                                  ? 'text-textBase'
                                  : 'text-textMuted'
                            }`}>
                            {date.getDate()}
                          </Text>
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              <TextInput
                className="mt-4 rounded-2xl border border-surfaceAlt bg-background px-4 py-4 text-base text-textBase"
                placeholder="Horario. Ex: 19:30"
                placeholderTextColor="#64748B"
                cursorColor="#6366F1"
                value={scaleDate ? toDateInputValue(scaleDate).slice(11, 16) : ''}
                onChangeText={updateScaleTime}
                keyboardType="numbers-and-punctuation"
              />

              {!!formErrorMessage && (
                <View className="mt-4 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
                  <Text className="text-sm text-danger">{formErrorMessage}</Text>
                </View>
              )}
              <View className="mt-5 flex-row gap-3">
                <TouchableOpacity className="flex-1 items-center rounded-2xl bg-background py-4" onPress={closeForms}>
                  <Text className="font-bold text-textBase">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 items-center rounded-2xl py-4 ${isSaving ? 'bg-surfaceAlt' : 'bg-primary'}`}
                  onPress={handleSaveScale}
                  disabled={isSaving}>
                  <Text className="font-bold text-white">{isSaving ? 'Salvando...' : 'Salvar'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={Boolean(taskBeingDeleted || scaleBeingDeleted)}
        transparent
        animationType="fade"
        onRequestClose={closeForms}>
        <Pressable className="flex-1 justify-center bg-black/60 px-5" onPress={closeForms}>
          <Pressable
            className="rounded-[28px] border border-danger/30 bg-surface px-5 py-5"
            onPress={(event) => event.stopPropagation()}>
            <Text className="text-xl font-bold text-textBase">
              {taskBeingDeleted ? 'Deletar tarefa?' : 'Deletar escala?'}
            </Text>
            <Text className="mt-2 text-sm leading-6 text-textMuted">
              Esta acao remove o registro permanentemente.
            </Text>
            {!!formErrorMessage && (
              <View className="mt-4 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
                <Text className="text-sm text-danger">{formErrorMessage}</Text>
              </View>
            )}
            <View className="mt-5 flex-row gap-3">
              <TouchableOpacity className="flex-1 items-center rounded-2xl bg-background py-4" onPress={closeForms}>
                <Text className="font-bold text-textBase">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 items-center rounded-2xl py-4 ${isDeleting ? 'bg-surfaceAlt' : 'bg-danger'}`}
                onPress={taskBeingDeleted ? handleDeleteTask : handleDeleteScale}
                disabled={isDeleting}>
                <Text className="font-bold text-white">
                  {isDeleting ? 'Deletando...' : 'Confirmar'}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={memberTasksFormOpen} transparent animationType="fade" onRequestClose={closeForms}>
        <Pressable className="flex-1 justify-center bg-black/60 px-5" onPress={closeForms}>
          <Pressable
            className="max-h-[82%] rounded-[28px] border border-surfaceAlt bg-surface px-5 py-5"
            onPress={(event) => event.stopPropagation()}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text className="text-xl font-bold text-textBase">
                {memberManagingTasks?.name || 'Membro'}
              </Text>
              <Text className="mt-2 text-sm leading-6 text-textMuted">
                Defina as tarefas fixas deste membro no setor.
              </Text>

              {tasks.length === 0 ? (
                <View className="mt-5 rounded-2xl border border-dashed border-surfaceAlt bg-background px-4 py-5">
                  <Text className="text-sm font-semibold text-textBase">
                    Nenhuma tarefa cadastrada neste setor.
                  </Text>
                </View>
              ) : (
                <View className="mt-5 flex-row flex-wrap gap-2">
                  {tasks.map((task) => {
                    const isSelected = draftMemberTaskIds.includes(task.id);

                    return (
                      <TouchableOpacity
                        key={task.id}
                        className={`rounded-full px-4 py-3 ${
                          isSelected ? 'bg-primary' : 'bg-background'
                        }`}
                        onPress={() => toggleMemberProfileTask(task.id)}>
                        <Text className="text-sm font-bold text-white">{task.name}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              )}

              {!!formErrorMessage && (
                <View className="mt-4 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
                  <Text className="text-sm text-danger">{formErrorMessage}</Text>
                </View>
              )}

              <View className="mt-5 flex-row gap-3">
                <TouchableOpacity className="flex-1 items-center rounded-2xl bg-background py-4" onPress={closeForms}>
                  <Text className="font-bold text-textBase">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 items-center rounded-2xl py-4 ${isSaving ? 'bg-surfaceAlt' : 'bg-primary'}`}
                  onPress={handleSaveMemberTasks}
                  disabled={isSaving}>
                  <Text className="font-bold text-white">{isSaving ? 'Salvando...' : 'Salvar'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal visible={participantsFormOpen} transparent animationType="fade" onRequestClose={closeForms}>
        <Pressable className="flex-1 justify-center bg-black/60 px-5" onPress={closeForms}>
          <Pressable
            className="max-h-[86%] rounded-[28px] border border-surfaceAlt bg-surface px-5 py-5"
            onPress={(event) => event.stopPropagation()}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text className="text-xl font-bold text-textBase">Participantes</Text>
              <Text className="mt-2 text-sm leading-6 text-textMuted">
                Selecione os membros da escala e, se fizer sentido, associe uma tarefa a cada um.
              </Text>

              {members.length === 0 ? (
                <View className="mt-5 rounded-2xl border border-dashed border-surfaceAlt bg-background px-4 py-5">
                  <Text className="text-sm font-semibold text-textBase">
                    Nenhum membro vinculado a este setor.
                  </Text>
                </View>
              ) : (
                <View className="mt-5 gap-3">
                  {members.map((member) => {
                    const selectedParticipant = draftParticipants.find(
                      (participant) => participant.user_id === member.id,
                    );

                    return (
                      <View key={member.id} className="rounded-2xl bg-background px-4 py-4">
                        <View className="flex-row items-start justify-between">
                          <View className="mr-3 flex-1">
                            <Text className="text-base font-bold text-textBase">{member.name}</Text>
                            <Text className="mt-1 text-xs text-textMuted">
                              {selectedParticipant?.task_name || 'Sem tarefa definida'}
                            </Text>
                          </View>
                          <TouchableOpacity
                            className={`rounded-full px-4 py-2 ${
                              selectedParticipant ? 'bg-primary' : 'bg-surface'
                            }`}
                            onPress={() => toggleDraftMember(member)}>
                            <Text className="text-sm font-bold text-white">
                              {selectedParticipant ? 'Na escala' : 'Adicionar'}
                            </Text>
                          </TouchableOpacity>
                        </View>

                        {selectedParticipant ? (
                        <ScrollView
                          horizontal
                          className="mt-3"
                          keyboardShouldPersistTaps="handled"
                          showsHorizontalScrollIndicator={false}>
                          <TouchableOpacity
                            className={`mr-2 rounded-full px-4 py-2 ${
                              !selectedParticipant.task_id ? 'bg-primary' : 'bg-surface'
                            }`}
                            onPress={() => setDraftParticipantTask(member, '')}>
                            <Text className="text-sm font-bold text-white">Sem tarefa</Text>
                          </TouchableOpacity>
                          {tasks.map((task) => {
                            const isSelected = selectedParticipant.task_id === task.id;

                            return (
                              <TouchableOpacity
                                key={task.id}
                                className={`mr-2 rounded-full px-4 py-2 ${
                                  isSelected ? 'bg-primary' : 'bg-surface'
                                }`}
                                onPress={() => setDraftParticipantTask(member, task.id)}>
                                <Text className="text-sm font-bold text-white">{task.name}</Text>
                              </TouchableOpacity>
                            );
                          })}
                        </ScrollView>
                        ) : null}
                      </View>
                    );
                  })}
                </View>
              )}

              {!!formErrorMessage && (
                <View className="mt-4 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
                  <Text className="text-sm text-danger">{formErrorMessage}</Text>
                </View>
              )}

              <View className="mt-5 flex-row gap-3">
                <TouchableOpacity className="flex-1 items-center rounded-2xl bg-background py-4" onPress={closeForms}>
                  <Text className="font-bold text-textBase">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 items-center rounded-2xl py-4 ${isSaving ? 'bg-surfaceAlt' : 'bg-primary'}`}
                  onPress={handleSaveParticipants}
                  disabled={isSaving}>
                  <Text className="font-bold text-white">{isSaving ? 'Salvando...' : 'Salvar'}</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
