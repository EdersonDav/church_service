import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { ResourceCard } from '@/components/resource-card';
import { getAvatarColor } from '@/constants/avatar-colors';
import { ApiError } from '@/lib/api';
import {
  ChurchMember,
  ScaleParticipant,
  ScaleStatus,
  SectorScale,
  SectorTask,
  addSectorMember,
  createSectorScale,
  createSectorTask,
  deleteSector,
  deleteSectorScale,
  deleteSectorTask,
  getChurchMembership,
  leaveSector,
  listChurchMembers,
  listSectorMembersUnavailability,
  listSectorMembers,
  listSectorMemberTasks,
  listSectorScales,
  listSectorTasks,
  removeSectorMember,
  updateSector,
  updateSectorMemberTasks,
  updateSectorMemberRole,
  updateSectorScale,
  updateSectorScaleParticipants,
  updateSectorTask,
} from '@/lib/churches';

const weekDays = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
const hourOptions = Array.from({ length: 24 }, (_, index) => String(index).padStart(2, '0'));
const minuteOptions = ['00', '15', '30', '45'];
const scaleStatusOptions: { value: ScaleStatus; label: string; description: string }[] = [
  {
    value: 'DRAFT',
    label: 'Em analise',
    description: 'Visivel apenas para admins do setor',
  },
  {
    value: 'PUBLISHED',
    label: 'Publicado',
    description: 'Visivel para todos os membros',
  },
];

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
  const [churchMembers, setChurchMembers] = useState<ChurchMember[]>([]);
  const [memberTasksByUser, setMemberTasksByUser] = useState<Record<string, SectorTask[]>>({});
  const [currentUserId, setCurrentUserId] = useState('');
  const [churchRole, setChurchRole] = useState('');
  const [sectorDisplayName, setSectorDisplayName] = useState(String(sectorName || 'Setor'));
  const [selectedTab, setSelectedTab] = useState<'tasks' | 'scales'>('scales');
  const [errorMessage, setErrorMessage] = useState('');
  const [formErrorMessage, setFormErrorMessage] = useState('');
  const [memberErrorMessage, setMemberErrorMessage] = useState('');
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeavingSector, setIsLeavingSector] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [memberActionId, setMemberActionId] = useState('');

  const [sectorFormOpen, setSectorFormOpen] = useState(false);
  const [sectorDeleteConfirmOpen, setSectorDeleteConfirmOpen] = useState(false);
  const [sectorLeaveConfirmOpen, setSectorLeaveConfirmOpen] = useState(false);
  const [sectorDraftName, setSectorDraftName] = useState(String(sectorName || 'Setor'));

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
  const [scaleDescription, setScaleDescription] = useState('');
  const [scaleStatus, setScaleStatus] = useState<ScaleStatus>('DRAFT');
  const [scaleDate, setScaleDate] = useState('');
  const [calendarMonth, setCalendarMonth] = useState(new Date());

  const [participantsFormOpen, setParticipantsFormOpen] = useState(false);
  const [scaleManagingParticipants, setScaleManagingParticipants] = useState<SectorScale | null>(null);
  const [draftParticipants, setDraftParticipants] = useState<ScaleParticipant[]>([]);
  const [unavailableMemberIds, setUnavailableMemberIds] = useState<Set<string>>(new Set());
  const [isLoadingParticipantAvailability, setIsLoadingParticipantAvailability] = useState(false);
  const [hasLoadedParticipantAvailability, setHasLoadedParticipantAvailability] = useState(false);
  const selectableMemberIdsRef = useRef<Set<string>>(new Set());

  const [memberTasksFormOpen, setMemberTasksFormOpen] = useState(false);
  const [membersFormOpen, setMembersFormOpen] = useState(false);
  const [memberManagingTasks, setMemberManagingTasks] = useState<ChurchMember | null>(null);
  const [draftMemberTaskIds, setDraftMemberTaskIds] = useState<string[]>([]);

  const currentMember = useMemo(
    () => members.find((member) => member.id === currentUserId) ?? null,
    [currentUserId, members],
  );
  const isChurchAdmin = churchRole === 'ADMIN' || churchRole === 'ROOT';
  const isSectorAdmin = currentMember?.role === 'ADMIN';
  const canManageSector = isChurchAdmin || isSectorAdmin;
  const canLeaveSector = Boolean(currentMember) && !canManageSector;
  const canUpdateSectorRoles = isChurchAdmin;
  const isBusy = isSaving || isDeleting || isLeavingSector;
  const sectorMemberIds = useMemo(() => new Set(members.map((member) => member.id)), [members]);
  const availableChurchMembers = useMemo(() => {
    const normalizedTerm = memberSearchTerm.trim().toLowerCase();

    return churchMembers.filter((member) => {
      if (sectorMemberIds.has(member.id)) {
        return false;
      }

      if (!normalizedTerm) {
        return true;
      }

      return (
        member.name.toLowerCase().includes(normalizedTerm) ||
        member.email.toLowerCase().includes(normalizedTerm)
      );
    });
  }, [churchMembers, memberSearchTerm, sectorMemberIds]);
  const sortedScaleMembers = useMemo(() => {
    return [...members].sort((left, right) => {
      const leftUnavailable = unavailableMemberIds.has(left.id);
      const rightUnavailable = unavailableMemberIds.has(right.id);

      if (leftUnavailable !== rightUnavailable) {
        return leftUnavailable ? 1 : -1;
      }

      return left.name.localeCompare(right.name);
    });
  }, [members, unavailableMemberIds]);

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
    if (isBusy || isLoadingMembers || memberActionId) {
      return;
    }

    setSectorFormOpen(false);
    setSectorDeleteConfirmOpen(false);
    setSectorLeaveConfirmOpen(false);
    setTaskFormOpen(false);
    setTaskBeingEdited(null);
    setTaskBeingDeleted(null);
    setScaleFormOpen(false);
    setScaleBeingEdited(null);
    setScaleBeingDeleted(null);
    setParticipantsFormOpen(false);
    setScaleManagingParticipants(null);
    setDraftParticipants([]);
    setUnavailableMemberIds(new Set());
    setIsLoadingParticipantAvailability(false);
    setHasLoadedParticipantAvailability(false);
    selectableMemberIdsRef.current = new Set();
    setMembersFormOpen(false);
    setChurchMembers([]);
    setMemberSearchTerm('');
    setMemberErrorMessage('');
    setMemberTasksFormOpen(false);
    setMemberManagingTasks(null);
    setDraftMemberTaskIds([]);
    setFormErrorMessage('');
  }

  function openEditSector() {
    setSectorDraftName(sectorDisplayName);
    setFormErrorMessage('');
    setSectorFormOpen(true);
  }

  async function handleSaveSector() {
    if (!churchId || !sectorId) {
      return;
    }

    const trimmedName = sectorDraftName.trim();

    if (trimmedName.length < 3 || trimmedName.length > 50) {
      setFormErrorMessage('O nome deve ter entre 3 e 50 caracteres.');
      return;
    }

    try {
      setIsSaving(true);
      setFormErrorMessage('');
      const savedSector = await updateSector(churchId, sectorId, { name: trimmedName });
      setSectorDisplayName(savedSector.name);
      setSectorFormOpen(false);
    } catch (error) {
      if (error instanceof ApiError) {
        setFormErrorMessage(error.message);
      } else {
        setFormErrorMessage('Nao foi possivel salvar o setor agora.');
      }
    } finally {
      setIsSaving(false);
    }
  }

  async function handleDeleteSector() {
    if (!churchId || !sectorId) {
      return;
    }

    try {
      setIsDeleting(true);
      setFormErrorMessage('');
      await deleteSector(churchId, sectorId);
      router.replace({
        pathname: '/church/[churchId]',
        params: { churchId },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setFormErrorMessage(error.message);
      } else {
        setFormErrorMessage('Nao foi possivel deletar o setor agora.');
      }
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleLeaveSector() {
    if (!churchId || !sectorId) {
      return;
    }

    try {
      setIsLeavingSector(true);
      setFormErrorMessage('');
      await leaveSector(churchId, sectorId);
      router.replace({
        pathname: '/church/[churchId]',
        params: { churchId },
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setFormErrorMessage(error.message);
      } else {
        setFormErrorMessage('Nao foi possivel sair do setor agora.');
      }
    } finally {
      setIsLeavingSector(false);
    }
  }

  async function openMembersForm() {
    if (!churchId) {
      return;
    }

    setMembersFormOpen(true);
    setMemberSearchTerm('');
    setMemberErrorMessage('');

    try {
      setIsLoadingMembers(true);
      const churchMembersResult = await listChurchMembers(churchId);
      setChurchMembers(churchMembersResult);
    } catch (error) {
      if (error instanceof ApiError) {
        setMemberErrorMessage(error.message);
      } else {
        setMemberErrorMessage('Nao foi possivel carregar os membros da igreja agora.');
      }
    } finally {
      setIsLoadingMembers(false);
    }
  }

  async function handleAddSectorMember(member: ChurchMember) {
    if (!churchId || !sectorId) {
      return;
    }

    try {
      setMemberActionId(member.id);
      setMemberErrorMessage('');
      await addSectorMember(churchId, sectorId, member.id);
      const nextMember = { ...member, role: 'MEMBER' };
      setMembers((current) => [...current, nextMember]);
      setMemberTasksByUser((current) => ({ ...current, [member.id]: [] }));
    } catch (error) {
      if (error instanceof ApiError) {
        setMemberErrorMessage(error.message);
      } else {
        setMemberErrorMessage('Nao foi possivel adicionar o membro agora.');
      }
    } finally {
      setMemberActionId('');
    }
  }

  async function handleToggleSectorAdmin(member: ChurchMember) {
    if (!churchId || !sectorId) {
      return;
    }

    const nextRole = member.role === 'ADMIN' ? 'MEMBER' : 'ADMIN';

    try {
      setMemberActionId(member.id);
      setMemberErrorMessage('');
      await updateSectorMemberRole(churchId, sectorId, member.id, nextRole);
      setMembers((current) =>
        current.map((currentMember) =>
          currentMember.id === member.id ? { ...currentMember, role: nextRole } : currentMember,
        ),
      );
    } catch (error) {
      if (error instanceof ApiError) {
        setMemberErrorMessage(error.message);
      } else {
        setMemberErrorMessage('Nao foi possivel atualizar o papel do membro agora.');
      }
    } finally {
      setMemberActionId('');
    }
  }

  async function handleRemoveSectorMember(member: ChurchMember) {
    if (!churchId || !sectorId) {
      return;
    }

    try {
      setMemberActionId(member.id);
      setMemberErrorMessage('');
      await removeSectorMember(churchId, sectorId, member.id);
      setMembers((current) => current.filter((currentMember) => currentMember.id !== member.id));
      setMemberTasksByUser((current) => {
        const nextValue = { ...current };
        delete nextValue[member.id];
        return nextValue;
      });
    } catch (error) {
      if (error instanceof ApiError) {
        setMemberErrorMessage(error.message);
      } else {
        setMemberErrorMessage('Nao foi possivel remover o membro agora.');
      }
    } finally {
      setMemberActionId('');
    }
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
    setScaleDescription('');
    setScaleStatus('DRAFT');
    setScaleDate(toDateInputValue());
    setCalendarMonth(new Date());
    setFormErrorMessage('');
    setScaleFormOpen(true);
  }

  function openEditScale(scale: SectorScale) {
    setScaleBeingEdited(scale);
    setScaleTitle(scale.title);
    setScaleDescription(scale.description ?? '');
    setScaleStatus(scale.status ?? 'DRAFT');
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

  function updateScaleTime(part: 'hour' | 'minute', value: string) {
    const currentValue = scaleDate ? toDateInputValue(scaleDate).slice(11, 16) : '19:00';
    const [currentHours, currentMinutes] = currentValue.split(':');
    const hours = Number(part === 'hour' ? value : currentHours);
    const minutes = Number(part === 'minute' ? value : currentMinutes);
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
    const trimmedDescription = scaleDescription.trim();

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
            description: trimmedDescription,
            status: scaleStatus,
            date: isoDate,
          })
        : await createSectorScale(churchId, sectorId, {
            title: trimmedTitle,
            description: trimmedDescription,
            status: scaleStatus,
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
        sectorName: sectorDisplayName,
        scaleId: scale.id,
      },
    });
  }

  async function loadParticipantAvailability(scale: SectorScale) {
    if (!churchId || !sectorId) {
      setIsLoadingParticipantAvailability(false);
      setHasLoadedParticipantAvailability(false);
      selectableMemberIdsRef.current = new Set();
      return;
    }

    const scaleDate = new Date(scale.date);

    if (Number.isNaN(scaleDate.getTime())) {
      setUnavailableMemberIds(new Set());
      setIsLoadingParticipantAvailability(false);
      setHasLoadedParticipantAvailability(false);
      selectableMemberIdsRef.current = new Set();
      return;
    }

    try {
      setFormErrorMessage('');
      const entries = await listSectorMembersUnavailability(churchId, sectorId);

      const nextUnavailableMemberIds = new Set(
        entries
          .filter((entry) =>
            entry.items.some((item) => {
              const start = new Date(item.date);
              const end = new Date(item.end_date ?? item.date);

              if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
                return false;
              }

              return (
                start.getTime() <= scaleDate.getTime() &&
                end.getTime() >= scaleDate.getTime()
              );
            }),
          )
          .map((entry) => entry.user_id),
      );

      setUnavailableMemberIds(nextUnavailableMemberIds);
      selectableMemberIdsRef.current = new Set(
        members
          .filter((member) => !nextUnavailableMemberIds.has(member.id))
          .map((member) => member.id),
      );
      setHasLoadedParticipantAvailability(true);
      setDraftParticipants((current) =>
        current.filter((participant) => !nextUnavailableMemberIds.has(participant.user_id)),
      );
    } catch (error) {
      setUnavailableMemberIds(new Set());
      setHasLoadedParticipantAvailability(false);
      selectableMemberIdsRef.current = new Set();
      if (error instanceof ApiError) {
        setFormErrorMessage(error.message);
      } else {
        setFormErrorMessage('Nao foi possivel verificar as indisponibilidades dos membros.');
      }
    } finally {
      setIsLoadingParticipantAvailability(false);
    }
  }

  function openParticipantsForm(scale: SectorScale) {
    setScaleManagingParticipants(scale);
    setDraftParticipants(scale.participants);
    setUnavailableMemberIds(new Set());
    setIsLoadingParticipantAvailability(true);
    setHasLoadedParticipantAvailability(false);
    selectableMemberIdsRef.current = new Set();
    setFormErrorMessage('');
    setParticipantsFormOpen(true);
    void loadParticipantAvailability(scale);
  }

  function toggleDraftMember(member: ChurchMember) {
    if (
      isLoadingParticipantAvailability ||
      !hasLoadedParticipantAvailability ||
      unavailableMemberIds.has(member.id) ||
      !selectableMemberIdsRef.current.has(member.id)
    ) {
      return;
    }

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
            <View className="flex-row items-center gap-2">
              <View className="rounded-full bg-background px-4 py-2">
                <Text className="text-xs font-bold uppercase tracking-[0.18em] text-primary">
                  {canManageSector ? 'Admin do setor' : 'Membro'}
                </Text>
              </View>
              {canManageSector ? (
                <>
                  <TouchableOpacity
                    className="h-10 w-10 items-center justify-center rounded-full bg-background"
                    onPress={openMembersForm}>
                    <Ionicons name="person-add-outline" size={18} color="#38BDF8" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="h-10 w-10 items-center justify-center rounded-full bg-background"
                    onPress={openEditSector}>
                    <Ionicons name="create-outline" size={18} color="#94A3B8" />
                  </TouchableOpacity>
                </>
              ) : null}
            </View>
          </View>
          <Text className="mt-3 text-3xl font-extrabold text-textBase">
            {sectorDisplayName}
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
              {canManageSector ? (
                <TouchableOpacity
                  className="h-9 w-9 items-center justify-center rounded-full bg-surfaceAlt"
                  onPress={openMembersForm}>
                  <Ionicons name="person-add-outline" size={17} color="#FFFFFF" />
                </TouchableOpacity>
              ) : (
                <Text className="text-xs font-semibold text-textMuted">
                  {members.length} no setor
                </Text>
              )}
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {members.map((member, index) => {
                const memberTasks = memberTasksByUser[member.id] ?? [];

                return (
                  <TouchableOpacity
                    key={member.id}
                    className="mr-3 min-w-[160px] rounded-2xl border border-surfaceAlt bg-surface px-4 py-3"
                    onPress={() => (canManageSector ? openMemberTasksForm(member) : undefined)}
                    disabled={!canManageSector}>
                    <View className="flex-row items-center">
                      <View
                        className="h-9 w-9 items-center justify-center rounded-full"
                        style={{ backgroundColor: getAvatarColor(member.id, index) }}>
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
                  <ResourceCard
                    key={scale.id}
                    title={scale.title}
                    subtitle={formatScaleDate(scale.date)}
                    description={scale.description?.trim()}
                    badge={
                      canManageSector
                        ? {
                            label: scale.status === 'PUBLISHED' ? 'Publicado' : 'Em analise',
                            variant: scale.status === 'PUBLISHED' ? 'success' : 'default',
                          }
                        : undefined
                    }
                    count={scale.participants.length}
                    avatars={visibleParticipants.map((participant) => ({
                      id: participant.user_id,
                      initials: getInitials(participant.user_name),
                    }))}
                    hiddenCount={remainingParticipants}
                    onPress={() => openScaleDetails(scale)}
                    actions={
                      canManageSector ? (
                        <>
                          <Pressable
                            className="h-10 w-10 items-center justify-center rounded-full bg-background"
                            onPress={(event) => {
                              event.stopPropagation();
                              openParticipantsForm(scale);
                            }}>
                            <Ionicons name="people-outline" size={18} color="#38BDF8" />
                          </Pressable>
                          <Pressable
                            className="h-10 w-10 items-center justify-center rounded-full bg-background"
                            onPress={(event) => {
                              event.stopPropagation();
                              openEditScale(scale);
                            }}>
                            <Ionicons name="create-outline" size={18} color="#94A3B8" />
                          </Pressable>
                          <Pressable
                            className="h-10 w-10 items-center justify-center rounded-full bg-danger/10"
                            onPress={(event) => {
                              event.stopPropagation();
                              setScaleBeingDeleted(scale);
                              setFormErrorMessage('');
                            }}>
                            <Ionicons name="trash-outline" size={18} color="#F87171" />
                          </Pressable>
                        </>
                      ) : null
                    }
                  />
                );
              })
            )}
          </View>
        ) : null}

        {!isLoading && canManageSector ? (
          <View className="mt-8">
            {sectorDeleteConfirmOpen ? (
              <View className="rounded-[24px] border border-danger/30 bg-danger/10 px-5 py-5">
                <Text className="text-base font-bold text-textBase">Deletar setor?</Text>
                <Text className="mt-2 text-sm leading-6 text-textMuted">
                  Esta acao remove o setor {sectorDisplayName} permanentemente.
                </Text>
                {!!formErrorMessage && (
                  <View className="mt-4 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
                    <Text className="text-sm text-danger">{formErrorMessage}</Text>
                  </View>
                )}
                <View className="mt-5 flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 items-center rounded-2xl bg-surface py-4"
                    onPress={() => setSectorDeleteConfirmOpen(false)}
                    disabled={isDeleting}>
                    <Text className="font-bold text-textBase">Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 items-center rounded-2xl py-4 ${
                      isDeleting ? 'bg-surfaceAlt' : 'bg-danger'
                    }`}
                    onPress={handleDeleteSector}
                    disabled={isDeleting}>
                    <Text className="font-bold text-white">
                      {isDeleting ? 'Deletando...' : 'Confirmar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                className="self-start flex-row items-center py-2"
                onPress={() => {
                  setFormErrorMessage('');
                  setSectorDeleteConfirmOpen(true);
                }}>
                <Ionicons name="trash-outline" size={17} color="#F87171" />
                <Text className="ml-2 text-sm font-semibold text-danger">Deletar setor</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        {!isLoading && canLeaveSector ? (
          <View className="mt-8">
            {sectorLeaveConfirmOpen ? (
              <View className="rounded-[24px] border border-danger/30 bg-danger/10 px-5 py-5">
                <Text className="text-base font-bold text-textBase">Sair do setor?</Text>
                <Text className="mt-2 text-sm leading-6 text-textMuted">
                  Voce perde o acesso de membro deste setor, mas continua na igreja.
                </Text>
                {!!formErrorMessage && (
                  <View className="mt-4 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
                    <Text className="text-sm text-danger">{formErrorMessage}</Text>
                  </View>
                )}
                <View className="mt-5 flex-row gap-3">
                  <TouchableOpacity
                    className="flex-1 items-center rounded-2xl bg-surface py-4"
                    onPress={() => setSectorLeaveConfirmOpen(false)}
                    disabled={isLeavingSector}>
                    <Text className="font-bold text-textBase">Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className={`flex-1 items-center rounded-2xl py-4 ${
                      isLeavingSector ? 'bg-surfaceAlt' : 'bg-danger'
                    }`}
                    onPress={handleLeaveSector}
                    disabled={isLeavingSector}>
                    <Text className="font-bold text-white">
                      {isLeavingSector ? 'Saindo...' : 'Confirmar'}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <TouchableOpacity
                className="self-start flex-row items-center py-2"
                onPress={() => {
                  setFormErrorMessage('');
                  setSectorLeaveConfirmOpen(true);
                }}>
                <Ionicons name="exit-outline" size={17} color="#F87171" />
                <Text className="ml-2 text-sm font-semibold text-danger">Sair do setor</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}
      </ScrollView>

      <Modal visible={sectorFormOpen} transparent animationType="fade" onRequestClose={closeForms}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable className="flex-1 justify-center bg-black/60 px-5" onPress={closeForms}>
            <Pressable
              className="rounded-[28px] border border-surfaceAlt bg-surface px-5 py-5"
              onPress={(event) => event.stopPropagation()}>
              <Text className="text-xl font-bold text-textBase">Editar setor</Text>
              <TextInput
                className="mt-5 rounded-2xl border border-surfaceAlt bg-background px-4 py-4 text-base text-textBase"
                placeholder="Nome do setor"
                placeholderTextColor="#64748B"
                cursorColor="#6366F1"
                value={sectorDraftName}
                onChangeText={setSectorDraftName}
                maxLength={50}
              />
              {!!formErrorMessage && (
                <View className="mt-4 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
                  <Text className="text-sm text-danger">{formErrorMessage}</Text>
                </View>
              )}
              <View className="mt-5 flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 items-center rounded-2xl bg-background py-4"
                  onPress={closeForms}>
                  <Text className="font-bold text-textBase">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 items-center rounded-2xl py-4 ${isSaving ? 'bg-surfaceAlt' : 'bg-primary'}`}
                  onPress={handleSaveSector}
                  disabled={isSaving}>
                  <Text className="font-bold text-white">{isSaving ? 'Salvando...' : 'Salvar'}</Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      <Modal visible={membersFormOpen} transparent animationType="fade" onRequestClose={closeForms}>
        <Pressable className="flex-1 justify-center bg-black/60 px-5" onPress={closeForms}>
          <Pressable
            className="max-h-[86%] rounded-[28px] border border-surfaceAlt bg-surface px-5 py-5"
            onPress={(event) => event.stopPropagation()}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text className="text-xl font-bold text-textBase">Membros do setor</Text>
              <Text className="mt-2 text-sm leading-6 text-textMuted">
                Adicione membros da igreja e gerencie quem faz parte deste setor.
              </Text>

              {!!memberErrorMessage && (
                <View className="mt-4 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
                  <Text className="text-sm text-danger">{memberErrorMessage}</Text>
                </View>
              )}

              {isLoadingMembers ? (
                <View className="items-center px-4 py-8">
                  <ActivityIndicator color="#6366F1" />
                  <Text className="mt-3 text-sm text-textMuted">Carregando membros...</Text>
                </View>
              ) : (
                <>
                  <View className="mt-5">
                    <Text className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-textMuted">
                      No setor
                    </Text>
                    <View className="overflow-hidden rounded-2xl border border-surfaceAlt">
                      {members.map((member, index) => {
                        const isLastItem = index === members.length - 1;
                        const isMemberBusy = memberActionId === member.id;

                        return (
                          <View
                            key={member.id}
                            className={`bg-background px-4 py-4 ${
                              isLastItem ? '' : 'border-b border-surfaceAlt'
                            }`}>
                            <View className="flex-row items-start justify-between">
                              <View className="mr-3 flex-1">
                                <Text className="text-base font-bold text-textBase">{member.name}</Text>
                                <Text className="mt-1 text-xs text-textMuted">{member.email}</Text>
                                <Text className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-accent">
                                  {member.role === 'ADMIN' ? 'Admin do setor' : 'Membro'}
                                </Text>
                              </View>
                              <View className="flex-row gap-2">
                                {canUpdateSectorRoles ? (
                                  <TouchableOpacity
                                    className={`h-10 w-10 items-center justify-center rounded-full ${
                                      member.role === 'ADMIN' ? 'bg-accent/10' : 'bg-surface'
                                    }`}
                                    onPress={() => handleToggleSectorAdmin(member)}
                                    disabled={Boolean(memberActionId)}>
                                    <Ionicons
                                      name={isMemberBusy ? 'ellipsis-horizontal' : 'shield-checkmark-outline'}
                                      size={18}
                                      color={member.role === 'ADMIN' ? '#38BDF8' : '#94A3B8'}
                                    />
                                  </TouchableOpacity>
                                ) : null}
                                <TouchableOpacity
                                  className="h-10 w-10 items-center justify-center rounded-full bg-danger/10"
                                  onPress={() => handleRemoveSectorMember(member)}
                                  disabled={Boolean(memberActionId)}>
                                  <Ionicons
                                    name={isMemberBusy ? 'ellipsis-horizontal' : 'trash-outline'}
                                    size={18}
                                    color="#F87171"
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  <View className="mt-6">
                    <Text className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-textMuted">
                      Adicionar membro
                    </Text>
                    <TextInput
                      className="mb-3 rounded-2xl border border-surfaceAlt bg-background px-4 py-3 text-base text-textBase"
                      placeholder="Buscar por nome ou email"
                      placeholderTextColor="#64748B"
                      cursorColor="#6366F1"
                      value={memberSearchTerm}
                      onChangeText={setMemberSearchTerm}
                      autoCapitalize="none"
                    />
                    {availableChurchMembers.length === 0 ? (
                      <View className="rounded-2xl border border-dashed border-surfaceAlt bg-background px-4 py-5">
                        <Text className="text-sm font-semibold text-textBase">
                          Nenhum membro disponivel para adicionar.
                        </Text>
                      </View>
                    ) : (
                      <View className="overflow-hidden rounded-2xl border border-surfaceAlt">
                        {availableChurchMembers.map((member, index) => {
                          const isLastItem = index === availableChurchMembers.length - 1;
                          const isMemberBusy = memberActionId === member.id;

                          return (
                            <View
                              key={member.id}
                              className={`bg-background px-4 py-4 ${
                                isLastItem ? '' : 'border-b border-surfaceAlt'
                              }`}>
                              <View className="flex-row items-center justify-between">
                                <View className="mr-3 flex-1">
                                  <Text className="text-base font-bold text-textBase">{member.name}</Text>
                                  <Text className="mt-1 text-xs text-textMuted">{member.email}</Text>
                                </View>
                                <TouchableOpacity
                                  className="h-10 w-10 items-center justify-center rounded-full bg-primary"
                                  onPress={() => handleAddSectorMember(member)}
                                  disabled={Boolean(memberActionId)}>
                                  <Ionicons
                                    name={isMemberBusy ? 'ellipsis-horizontal' : 'add-outline'}
                                    size={20}
                                    color="#FFFFFF"
                                  />
                                </TouchableOpacity>
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>
                </>
              )}

              <TouchableOpacity
                className="mt-5 items-center rounded-2xl bg-background py-4"
                onPress={closeForms}>
                <Text className="font-bold text-textBase">Fechar</Text>
              </TouchableOpacity>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

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

              <TextInput
                className="mt-4 min-h-[120px] rounded-2xl border border-surfaceAlt bg-background px-4 py-4 text-base text-textBase"
                placeholder="Anotacoes da escala: musicas e tons, cronograma, observacoes..."
                placeholderTextColor="#64748B"
                cursorColor="#6366F1"
                value={scaleDescription}
                onChangeText={setScaleDescription}
                maxLength={2000}
                multiline
                textAlignVertical="top"
              />

              <View className="mt-4 rounded-2xl border border-surfaceAlt bg-background px-4 py-4">
                <Text className="text-sm font-bold uppercase tracking-[0.16em] text-textMuted">
                  Visibilidade
                </Text>
                <View className="mt-3 gap-2">
                  {scaleStatusOptions.map((option) => {
                    const isSelected = scaleStatus === option.value;

                    return (
                      <TouchableOpacity
                        key={option.value}
                        className={`rounded-2xl border px-4 py-3 ${
                          isSelected
                            ? 'border-primary bg-primary/15'
                            : 'border-surfaceAlt bg-surface'
                        }`}
                        onPress={() => setScaleStatus(option.value)}>
                        <View className="flex-row items-center justify-between">
                          <View className="mr-3 flex-1">
                            <Text className="text-base font-bold text-textBase">
                              {option.label}
                            </Text>
                            <Text className="mt-1 text-xs leading-5 text-textMuted">
                              {option.description}
                            </Text>
                          </View>
                          <Ionicons
                            name={isSelected ? 'checkmark-circle' : 'ellipse-outline'}
                            size={20}
                            color={isSelected ? '#6366F1' : '#94A3B8'}
                          />
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

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

              <View className="mt-4 rounded-2xl border border-surfaceAlt bg-background px-4 py-4">
                <View className="mb-3 flex-row items-center justify-between">
                  <Text className="text-sm font-bold uppercase tracking-[0.16em] text-textMuted">
                    Horario
                  </Text>
                  <Text className="text-base font-extrabold text-textBase">
                    {scaleDate ? toDateInputValue(scaleDate).slice(11, 16) : '19:00'}
                  </Text>
                </View>

                <Text className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-textMuted">
                  Hora
                </Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                  {hourOptions.map((hour) => {
                    const selectedHour = scaleDate ? toDateInputValue(scaleDate).slice(11, 13) : '19';
                    const isSelected = selectedHour === hour;

                    return (
                      <TouchableOpacity
                        key={hour}
                        className={`mr-2 min-w-[52px] items-center rounded-full px-4 py-3 ${
                          isSelected ? 'bg-primary' : 'bg-surface'
                        }`}
                        onPress={() => updateScaleTime('hour', hour)}>
                        <Text className="text-sm font-bold text-white">{hour}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </ScrollView>

                <Text className="mb-2 mt-4 text-xs font-bold uppercase tracking-[0.14em] text-textMuted">
                  Minuto
                </Text>
                <View className="flex-row gap-2">
                  {minuteOptions.map((minute) => {
                    const selectedMinute = scaleDate ? toDateInputValue(scaleDate).slice(14, 16) : '00';
                    const isSelected = selectedMinute === minute;

                    return (
                      <TouchableOpacity
                        key={minute}
                        className={`flex-1 items-center rounded-full px-4 py-3 ${
                          isSelected ? 'bg-primary' : 'bg-surface'
                        }`}
                        onPress={() => updateScaleTime('minute', minute)}>
                        <Text className="text-sm font-bold text-white">{minute}</Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
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
              {isLoadingParticipantAvailability ? (
                <View className="mt-4 flex-row items-center rounded-2xl bg-background px-4 py-3">
                  <ActivityIndicator size="small" color="#6366F1" />
                  <Text className="ml-3 text-sm text-textMuted">Verificando indisponibilidades...</Text>
                </View>
              ) : null}

              {members.length === 0 ? (
                <View className="mt-5 rounded-2xl border border-dashed border-surfaceAlt bg-background px-4 py-5">
                  <Text className="text-sm font-semibold text-textBase">
                    Nenhum membro vinculado a este setor.
                  </Text>
                </View>
              ) : (
                <View className="mt-5 gap-3">
                  {sortedScaleMembers.map((member) => {
                    const selectedParticipant = draftParticipants.find(
                      (participant) => participant.user_id === member.id,
                    );
                    const isUnavailable = unavailableMemberIds.has(member.id);
                    const isParticipantActionDisabled =
                      isLoadingParticipantAvailability ||
                      !hasLoadedParticipantAvailability ||
                      isUnavailable ||
                      !selectableMemberIdsRef.current.has(member.id);

                    return (
                      <View
                        key={member.id}
                        className={`rounded-2xl bg-background px-4 py-4 ${
                          isUnavailable ? 'opacity-60' : ''
                        }`}>
                        <View className="flex-row items-start justify-between">
                          <View className="mr-3 flex-1">
                            <Text className="text-base font-bold text-textBase">{member.name}</Text>
                            <Text className="mt-1 text-xs text-textMuted">
                              {isUnavailable
                                ? 'Indisponivel no horario desta escala'
                                : selectedParticipant?.task_name || 'Sem tarefa definida'}
                            </Text>
                          </View>
                          <TouchableOpacity
                            className={`rounded-full px-4 py-2 ${
                              isParticipantActionDisabled
                                ? 'bg-surfaceAlt'
                                : selectedParticipant
                                  ? 'bg-primary'
                                  : 'bg-surface'
                            }`}
                            onPress={
                              isParticipantActionDisabled
                                ? undefined
                                : () => toggleDraftMember(member)
                            }
                            disabled={isParticipantActionDisabled}
                            accessibilityState={{ disabled: isParticipantActionDisabled }}>
                            <Text className="text-sm font-bold text-white">
                              {isLoadingParticipantAvailability
                                ? 'Verificando'
                                : !hasLoadedParticipantAvailability
                                  ? 'Bloqueado'
                                : isUnavailable
                                ? 'Indisponivel'
                                : selectedParticipant
                                  ? 'Na escala'
                                  : 'Adicionar'}
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
                  className={`flex-1 items-center rounded-2xl py-4 ${
                    isSaving || isLoadingParticipantAvailability ? 'bg-surfaceAlt' : 'bg-primary'
                  }`}
                  onPress={handleSaveParticipants}
                  disabled={isSaving || isLoadingParticipantAvailability}>
                  <Text className="font-bold text-white">
                    {isSaving
                      ? 'Salvando...'
                      : isLoadingParticipantAvailability
                        ? 'Verificando...'
                        : 'Salvar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
