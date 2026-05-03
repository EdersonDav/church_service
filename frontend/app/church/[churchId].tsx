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
import { ResourceCard } from '@/components/resource-card';
import { ApiError } from '@/lib/api';
import {
  ChurchMember,
  ChurchMembership,
  ExtraEvent,
  Sector,
  addSectorMember,
  createSector,
  deleteChurch,
  deleteSector,
  getChurchMembership,
  leaveChurch,
  listChurchMembers,
  listChurchEvents,
  listChurchSectors,
  listSectorMembers,
  removeSectorMember,
  updateSector,
  updateSectorMemberRole,
} from '@/lib/churches';

function formatEventDate(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return 'Data invalida';
  }

  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getMemberInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return '?';
  }

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('');
}

export default function ChurchDetailsScreen() {
  const router = useRouter();
  const { churchId, name, description } = useLocalSearchParams<{
    churchId?: string;
    name?: string;
    description?: string;
  }>();
  const [membership, setMembership] = useState<ChurchMembership | null>(null);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [events, setEvents] = useState<ExtraEvent[]>([]);
  const [errorMessage, setErrorMessage] = useState('');
  const [isAccessDenied, setIsAccessDenied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isDeleteConfirmOpen, setIsDeleteConfirmOpen] = useState(false);
  const [isLeaveConfirmOpen, setIsLeaveConfirmOpen] = useState(false);
  const [isSectorFormOpen, setIsSectorFormOpen] = useState(false);
  const [sectorName, setSectorName] = useState('');
  const [sectorBeingEdited, setSectorBeingEdited] = useState<Sector | null>(null);
  const [sectorBeingDeleted, setSectorBeingDeleted] = useState<Sector | null>(null);
  const [sectorManagingMembers, setSectorManagingMembers] = useState<Sector | null>(null);
  const [churchMembers, setChurchMembers] = useState<ChurchMember[]>([]);
  const [sectorMembers, setSectorMembers] = useState<ChurchMember[]>([]);
  const [sectorMembersBySector, setSectorMembersBySector] = useState<Record<string, ChurchMember[]>>({});
  const [memberSearchTerm, setMemberSearchTerm] = useState('');
  const [sectorErrorMessage, setSectorErrorMessage] = useState('');
  const [memberErrorMessage, setMemberErrorMessage] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [isSavingSector, setIsSavingSector] = useState(false);
  const [isDeletingSector, setIsDeletingSector] = useState(false);
  const [isLoadingMembers, setIsLoadingMembers] = useState(false);
  const [memberActionId, setMemberActionId] = useState('');

  const loadChurchData = useCallback(
    async (isPullToRefresh = false) => {
      if (!churchId) {
        return;
      }

      try {
        if (isPullToRefresh) {
          setIsRefreshing(true);
        } else {
          setIsLoading(true);
        }

        setErrorMessage('');
        setIsAccessDenied(false);

        const churchMembership = await getChurchMembership(churchId);
        setMembership(churchMembership);

        const [sectorsResult, eventsResult] = await Promise.allSettled([
          listChurchSectors(churchId),
          listChurchEvents(churchId),
        ]);

        const nextSectors = sectorsResult.status === 'fulfilled' ? sectorsResult.value : [];
        setSectors(nextSectors);

        if (nextSectors.length > 0) {
          const sectorMembersResults = await Promise.allSettled(
            nextSectors.map(async (sector) => ({
              sectorId: sector.id,
              members: await listSectorMembers(churchId, sector.id),
            })),
          );

          setSectorMembersBySector(
            sectorMembersResults.reduce<Record<string, ChurchMember[]>>((acc, result) => {
              if (result.status === 'fulfilled') {
                acc[result.value.sectorId] = result.value.members;
              }

              return acc;
            }, {}),
          );
        } else {
          setSectorMembersBySector({});
        }

        setEvents(
          eventsResult.status === 'fulfilled'
            ? [...eventsResult.value].sort(
              (left, right) => new Date(left.date).getTime() - new Date(right.date).getTime(),
            )
            : [],
        );
      } catch (error) {
        setMembership(null);
        setSectors([]);
        setSectorMembersBySector({});
        setEvents([]);

        if (error instanceof ApiError && (error.status === 403 || error.status === 404)) {
          setIsAccessDenied(true);
          setErrorMessage(
            'Voce ainda nao esta vinculado a esta igreja. Um administrador precisa adicionar o seu usuario como membro.',
          );
        } else if (error instanceof ApiError) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Nao foi possivel carregar os detalhes da igreja agora.');
        }
      } finally {
        setIsLoading(false);
        setIsRefreshing(false);
      }
    },
    [churchId],
  );

  useEffect(() => {
    if (!churchId) {
      return;
    }

    void loadChurchData();
  }, [churchId, loadChurchData]);

  const churchName = membership?.church.name ?? name ?? 'Igreja';
  const churchDescription =
    membership?.church.description?.trim() || description?.trim() || 'Sem descricao cadastrada.';
  const isAdmin = membership?.role === 'ADMIN';
  const canLeaveChurch = Boolean(membership) && !isAdmin;
  const currentUserId = membership?.user_id ?? membership?.user?.id;
  const isSectorDialogBusy = isSavingSector || isDeletingSector;
  const sectorMemberIds = useMemo(
    () => new Set(sectorMembers.map((member) => member.id)),
    [sectorMembers],
  );
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
  const currentSectorMember = currentUserId
    ? sectorMembers.find((member) => member.id === currentUserId)
    : null;
  const canManageSectorRoster = isAdmin || currentSectorMember?.role === 'ADMIN';
  const canUpdateSectorRoles = isAdmin;

  function openCreateSector() {
    setSectorBeingEdited(null);
    setSectorName('');
    setSectorErrorMessage('');
    setIsSectorFormOpen(true);
  }

  function closeSectorDialogs() {
    if (isSectorDialogBusy) {
      return;
    }

    setIsSectorFormOpen(false);
    setSectorBeingEdited(null);
    setSectorBeingDeleted(null);
    setSectorErrorMessage('');
  }

  async function loadSectorMemberData(sector: Sector) {
    if (!churchId) {
      return;
    }

    try {
      setIsLoadingMembers(true);
      setMemberErrorMessage('');

      const [churchMembersResult, sectorMembersResult] = await Promise.all([
        listChurchMembers(churchId),
        listSectorMembers(churchId, sector.id),
      ]);

      setChurchMembers(churchMembersResult);
      setSectorMembers(sectorMembersResult);
      setSectorMembersBySector((current) => ({
        ...current,
        [sector.id]: sectorMembersResult,
      }));
    } catch (error) {
      if (error instanceof ApiError) {
        setMemberErrorMessage(error.message);
      } else {
        setMemberErrorMessage('Nao foi possivel carregar os membros agora.');
      }
    } finally {
      setIsLoadingMembers(false);
    }
  }

  function openManageSectorMembers(sector: Sector) {
    setSectorManagingMembers(sector);
    setMemberSearchTerm('');
    setMemberErrorMessage('');
    setSectorMembers([]);
    void loadSectorMemberData(sector);
  }

  function closeMembersDialog() {
    if (isLoadingMembers || memberActionId) {
      return;
    }

    setSectorManagingMembers(null);
    setChurchMembers([]);
    setSectorMembers([]);
    setMemberSearchTerm('');
    setMemberErrorMessage('');
  }

  async function handleAddSectorMember(member: ChurchMember) {
    if (!churchId || !sectorManagingMembers) {
      return;
    }

    try {
      setMemberActionId(member.id);
      setMemberErrorMessage('');

      await addSectorMember(churchId, sectorManagingMembers.id, member.id);
      const nextMember = { ...member, role: 'MEMBER' };
      setSectorMembers((current) => [...current, nextMember]);
      setSectorMembersBySector((current) => ({
        ...current,
        [sectorManagingMembers.id]: [...(current[sectorManagingMembers.id] ?? []), nextMember],
      }));
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
    if (!churchId || !sectorManagingMembers) {
      return;
    }

    const nextRole = member.role === 'ADMIN' ? 'MEMBER' : 'ADMIN';

    try {
      setMemberActionId(member.id);
      setMemberErrorMessage('');

      await updateSectorMemberRole(churchId, sectorManagingMembers.id, member.id, nextRole);
      setSectorMembers((current) =>
        current.map((currentMember) =>
          currentMember.id === member.id ? { ...currentMember, role: nextRole } : currentMember,
        ),
      );
      setSectorMembersBySector((current) => ({
        ...current,
        [sectorManagingMembers.id]: (current[sectorManagingMembers.id] ?? []).map((currentMember) =>
          currentMember.id === member.id ? { ...currentMember, role: nextRole } : currentMember,
        ),
      }));
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
    if (!churchId || !sectorManagingMembers) {
      return;
    }

    try {
      setMemberActionId(member.id);
      setMemberErrorMessage('');

      await removeSectorMember(churchId, sectorManagingMembers.id, member.id);
      setSectorMembers((current) => current.filter((currentMember) => currentMember.id !== member.id));
      setSectorMembersBySector((current) => ({
        ...current,
        [sectorManagingMembers.id]: (current[sectorManagingMembers.id] ?? []).filter(
          (currentMember) => currentMember.id !== member.id,
        ),
      }));
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

  async function handleSaveSector() {
    if (!churchId) {
      return;
    }

    const trimmedName = sectorName.trim();

    if (!trimmedName) {
      setSectorErrorMessage('Informe o nome do setor.');
      return;
    }

    if (trimmedName.length < 3 || trimmedName.length > 50) {
      setSectorErrorMessage('O nome deve ter entre 3 e 50 caracteres.');
      return;
    }

    try {
      setIsSavingSector(true);
      setSectorErrorMessage('');

      const savedSector = sectorBeingEdited
        ? await updateSector(churchId, sectorBeingEdited.id, { name: trimmedName })
        : await createSector(churchId, { name: trimmedName });

      setSectors((current) => {
        if (sectorBeingEdited) {
          return current.map((sector) => (sector.id === savedSector.id ? savedSector : sector));
        }

        return [...current, savedSector];
      });

      if (!sectorBeingEdited && membership?.user) {
        setSectorMembersBySector((current) => ({
          ...current,
          [savedSector.id]: [{ ...membership.user, role: 'ADMIN' }],
        }));
      }

      setIsSectorFormOpen(false);
      setSectorBeingEdited(null);
      setSectorName('');
    } catch (error) {
      if (error instanceof ApiError) {
        setSectorErrorMessage(error.message);
      } else {
        setSectorErrorMessage('Nao foi possivel salvar o setor agora.');
      }
    } finally {
      setIsSavingSector(false);
    }
  }

  async function handleDeleteSector() {
    if (!churchId || !sectorBeingDeleted) {
      return;
    }

    try {
      setIsDeletingSector(true);
      setSectorErrorMessage('');

      await deleteSector(churchId, sectorBeingDeleted.id);
      setSectors((current) => current.filter((sector) => sector.id !== sectorBeingDeleted.id));
      setSectorMembersBySector((current) => {
        const nextValue = { ...current };
        delete nextValue[sectorBeingDeleted.id];
        return nextValue;
      });
      setSectorBeingDeleted(null);
    } catch (error) {
      if (error instanceof ApiError) {
        setSectorErrorMessage(error.message);
      } else {
        setSectorErrorMessage('Nao foi possivel deletar o setor agora.');
      }
    } finally {
      setIsDeletingSector(false);
    }
  }

  async function handleDeleteChurch() {
    if (!churchId) {
      return;
    }

    try {
      setIsDeleting(true);
      setErrorMessage('');

      await deleteChurch(churchId);
      router.replace('/(tabs)');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Nao foi possivel deletar a igreja agora.');
      }
    } finally {
      setIsDeleting(false);
    }
  }

  async function handleLeaveChurch() {
    if (!churchId) {
      return;
    }

    try {
      setIsLeaving(true);
      setErrorMessage('');

      await leaveChurch(churchId);
      router.replace('/(tabs)');
    } catch (error) {
      if (error instanceof ApiError) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Nao foi possivel sair da igreja agora.');
      }
    } finally {
      setIsLeaving(false);
    }
  }

  return (
    <View className="flex-1 bg-background">
      <Stack.Screen options={{ headerShown: false }} />

      <ScrollView
        contentContainerStyle={{ paddingHorizontal: 24, paddingTop: 72, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={isRefreshing} onRefresh={() => loadChurchData(true)} />
        }
        showsVerticalScrollIndicator={false}>
        <View className="mb-8 flex-row items-center">
          <TouchableOpacity
            className="h-11 w-11 items-center justify-center rounded-full bg-surface"
            onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={22} color="#F8FAFC" />
          </TouchableOpacity>
        </View>

        <View className="mb-8 overflow-hidden rounded-[30px] bg-surface px-6 py-6">
          <View className="absolute -right-8 -top-8 h-36 w-36 rounded-full bg-accent/10" />
          <Text className="text-xs font-semibold uppercase tracking-[0.28em] text-accent">
            Igreja
          </Text>
          <Text className="mt-3 text-3xl font-extrabold text-textBase">{churchName}</Text>
          <Text className="mt-3 text-base leading-6 text-textMuted">{churchDescription}</Text>

          <View className="mt-5 flex-row flex-wrap gap-3">
            <View className="rounded-full bg-background px-4 py-2">
              <Text className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
                {membership ? membership.role : 'Acesso pendente'}
              </Text>
            </View>
          </View>
        </View>

        {!!errorMessage && (
          <View
            className={`mb-6 rounded-2xl px-4 py-4 ${
              isAccessDenied
                ? 'border border-accent/30 bg-accent/10'
                : 'border border-danger/40 bg-danger/10'
            }`}>
            <Text className={`text-sm ${isAccessDenied ? 'text-accent' : 'text-danger'}`}>
              {errorMessage}
            </Text>
          </View>
        )}

        {isLoading ? (
          <View className="rounded-[28px] bg-surface px-5 py-10">
            <ActivityIndicator size="large" color="#6366F1" />
            <Text className="mt-4 text-center text-sm text-textMuted">
              Carregando dados da igreja...
            </Text>
          </View>
        ) : null}

        {!isLoading && membership ? (
          <>
            <View className="mb-8 flex-row gap-3">
              <View className="flex-1 rounded-[24px] bg-surface px-4 py-5">
                <Text className="text-sm text-textMuted">Setores</Text>
                <Text className="mt-2 text-3xl font-extrabold text-textBase">{sectors.length}</Text>
              </View>
              <View className="flex-1 rounded-[24px] bg-surface px-4 py-5">
                <Text className="text-sm text-textMuted">Eventos</Text>
                <Text className="mt-2 text-3xl font-extrabold text-textBase">{events.length}</Text>
              </View>
            </View>

            <View className="mb-8">
              <View className="mb-4 flex-row items-center justify-between">
                <Text className="text-2xl font-bold text-textBase">Setores</Text>

                {isAdmin ? (
                  <TouchableOpacity
                    className="h-11 w-11 items-center justify-center rounded-full bg-primary"
                    onPress={openCreateSector}>
                    <Ionicons name="add-outline" size={22} color="#FFFFFF" />
                  </TouchableOpacity>
                ) : null}
              </View>

              {sectors.length === 0 ? (
                <View className="rounded-[26px] border border-dashed border-surfaceAlt bg-surface px-5 py-6">
                  <Text className="text-base font-semibold text-textBase">
                    Nenhum setor criado ainda
                  </Text>
                  <Text className="mt-2 text-sm leading-6 text-textMuted">
                    Quando a igreja começar a estruturar os ministérios, os setores vão aparecer
                    aqui.
                  </Text>
                </View>
              ) : (
                sectors.map((sector) => {
                  const members = sectorMembersBySector[sector.id] ?? [];
                  const visibleMembers = members.slice(0, 4);
                  const hiddenMembersCount = Math.max(members.length - visibleMembers.length, 0);
                  const canViewSectorMembers = Boolean(membership);
                  const canOpenSectorPage = Boolean(membership);

                  return (
                    <ResourceCard
                      key={sector.id}
                      title={sector.name}
                      count={members.length}
                      avatars={visibleMembers.map((member) => ({
                        id: member.id,
                        initials: getMemberInitials(member.name),
                      }))}
                      hiddenCount={hiddenMembersCount}
                      actions={
                        canViewSectorMembers || canOpenSectorPage ? (
                          <>
                            {canViewSectorMembers ? (
                              <TouchableOpacity
                                className="h-10 w-10 items-center justify-center rounded-full bg-background"
                                onPress={() => openManageSectorMembers(sector)}>
                                <Ionicons name="people-outline" size={18} color="#38BDF8" />
                              </TouchableOpacity>
                            ) : null}
                            {canOpenSectorPage ? (
                              <TouchableOpacity
                                className="h-10 w-10 items-center justify-center rounded-full bg-background"
                                onPress={() =>
                                  router.push({
                                    pathname: '/sector/[sectorId]',
                                    params: {
                                      sectorId: sector.id,
                                      churchId: String(churchId),
                                      sectorName: sector.name,
                                    },
                                  })
                                }>
                                <Ionicons name="chevron-forward" size={18} color="#38BDF8" />
                              </TouchableOpacity>
                            ) : null}
                          </>
                        ) : null
                      }
                    />
                  );
                })
              )}
            </View>

            <View>
              <Text className="mb-4 text-2xl font-bold text-textBase">Proximos eventos</Text>

              {events.length === 0 ? (
                <View className="rounded-[26px] border border-dashed border-surfaceAlt bg-surface px-5 py-6">
                  <Text className="text-base font-semibold text-textBase">
                    Nenhum evento extra cadastrado
                  </Text>
                  <Text className="mt-2 text-sm leading-6 text-textMuted">
                    Eventos da igreja, conferencias e encontros especiais vao aparecer nesta area.
                  </Text>
                </View>
              ) : (
                events.map((event) => (
                  <View
                    key={event.id}
                    className="mb-3 rounded-[24px] border border-surfaceAlt bg-surface px-5 py-5">
                    <View className="flex-row items-start justify-between">
                      <View className="mr-4 flex-1">
                        <Text className="text-lg font-bold text-textBase">{event.name}</Text>
                        <Text className="mt-2 text-sm leading-6 text-textMuted">
                          {event.description?.trim() || 'Sem descricao adicional para este evento.'}
                        </Text>
                      </View>

                      <View className="rounded-full bg-background px-3 py-2">
                        <Text className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                          {event.type || 'Evento'}
                        </Text>
                      </View>
                    </View>

                    <View className="mt-4 flex-row items-center">
                      <Ionicons name="calendar-outline" size={16} color="#38BDF8" />
                      <Text className="ml-2 text-sm text-textMuted">
                        {formatEventDate(event.date)}
                      </Text>
                    </View>
                  </View>
                ))
              )}
            </View>

            {isAdmin || canLeaveChurch ? (
              <View className="mt-8 border-t border-surfaceAlt pt-6">
                {isAdmin ? (
                  isDeleteConfirmOpen ? (
                    <View className="rounded-[24px] border border-danger/30 bg-danger/10 px-5 py-5">
                      <Text className="text-base font-bold text-textBase">Deletar igreja?</Text>
                      <Text className="mt-2 text-sm leading-6 text-textMuted">
                        Esta acao remove a igreja e os dados associados permanentemente.
                      </Text>
                      <View className="mt-5 flex-row gap-3">
                        <TouchableOpacity
                          className="flex-1 items-center rounded-2xl bg-surface py-4"
                          onPress={() => setIsDeleteConfirmOpen(false)}
                          disabled={isDeleting}>
                          <Text className="font-bold text-textBase">Cancelar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                          className={`flex-1 items-center rounded-2xl py-4 ${
                            isDeleting ? 'bg-surfaceAlt' : 'bg-danger'
                          }`}
                          onPress={handleDeleteChurch}
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
                      onPress={() => setIsDeleteConfirmOpen(true)}>
                      <Ionicons name="trash-outline" size={17} color="#F87171" />
                      <Text className="ml-2 text-sm font-semibold text-danger">Deletar igreja</Text>
                    </TouchableOpacity>
                  )
                ) : null}

                {canLeaveChurch && isLeaveConfirmOpen ? (
                  <View className="rounded-[24px] border border-danger/30 bg-danger/10 px-5 py-5">
                    <Text className="text-base font-bold text-textBase">Sair da igreja?</Text>
                    <Text className="mt-2 text-sm leading-6 text-textMuted">
                      Voce perde o acesso a esta igreja ate um administrador aprovar uma nova entrada.
                    </Text>
                    <View className="mt-5 flex-row gap-3">
                      <TouchableOpacity
                        className="flex-1 items-center rounded-2xl bg-surface py-4"
                        onPress={() => setIsLeaveConfirmOpen(false)}
                        disabled={isLeaving}>
                        <Text className="font-bold text-textBase">Cancelar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className={`flex-1 items-center rounded-2xl py-4 ${
                          isLeaving ? 'bg-surfaceAlt' : 'bg-danger'
                        }`}
                        onPress={handleLeaveChurch}
                        disabled={isLeaving}>
                        <Text className="font-bold text-white">
                          {isLeaving ? 'Saindo...' : 'Confirmar'}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : null}

                {canLeaveChurch && !isLeaveConfirmOpen ? (
                  <TouchableOpacity
                    className="self-start flex-row items-center py-2"
                    onPress={() => setIsLeaveConfirmOpen(true)}>
                    <Ionicons name="exit-outline" size={17} color="#F87171" />
                    <Text className="ml-2 text-sm font-semibold text-danger">Sair da igreja</Text>
                  </TouchableOpacity>
                ) : null}
              </View>
            ) : null}
          </>
        ) : null}
      </ScrollView>

      <Modal
        visible={isSectorFormOpen}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeSectorDialogs}>
        <KeyboardAvoidingView
          className="flex-1"
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <Pressable className="flex-1 justify-center bg-black/60 px-5" onPress={closeSectorDialogs}>
            <Pressable
              className="rounded-[28px] border border-surfaceAlt bg-surface px-5 py-5"
              onPress={(event) => event.stopPropagation()}>
              <Text className="text-xl font-bold text-textBase">
                {sectorBeingEdited ? 'Editar setor' : 'Novo setor'}
              </Text>

              <View className="mt-5">
                <Text className="mb-2 ml-1 text-sm font-semibold uppercase tracking-wider text-textMuted">
                  Nome
                </Text>
                <TextInput
                  className="rounded-2xl border border-surfaceAlt bg-background px-4 py-4 text-base text-textBase"
                  placeholder="Ex: Louvor"
                  placeholderTextColor="#64748B"
                  cursorColor="#6366F1"
                  value={sectorName}
                  onChangeText={setSectorName}
                  maxLength={50}
                />
              </View>

              {!!sectorErrorMessage && (
                <View className="mt-4 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
                  <Text className="text-sm text-danger">{sectorErrorMessage}</Text>
                </View>
              )}

              <View className="mt-5 flex-row gap-3">
                <TouchableOpacity
                  className="flex-1 items-center rounded-2xl bg-background py-4"
                  onPress={closeSectorDialogs}
                  disabled={isSavingSector}>
                  <Text className="font-bold text-textBase">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className={`flex-1 items-center rounded-2xl py-4 ${
                    isSavingSector ? 'bg-surfaceAlt' : 'bg-primary'
                  }`}
                  onPress={handleSaveSector}
                  disabled={isSavingSector}>
                  <Text className="font-bold text-white">
                    {isSavingSector ? 'Salvando...' : 'Salvar'}
                  </Text>
                </TouchableOpacity>
              </View>
            </Pressable>
          </Pressable>
        </KeyboardAvoidingView>
      </Modal>

      <Modal
        visible={Boolean(sectorBeingDeleted)}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeSectorDialogs}>
        <Pressable className="flex-1 justify-center bg-black/60 px-5" onPress={closeSectorDialogs}>
          <Pressable
            className="rounded-[28px] border border-danger/30 bg-surface px-5 py-5"
            onPress={(event) => event.stopPropagation()}>
            <Text className="text-xl font-bold text-textBase">Deletar setor?</Text>
            <Text className="mt-2 text-sm leading-6 text-textMuted">
              {sectorBeingDeleted
                ? `Esta acao remove o setor ${sectorBeingDeleted.name} permanentemente.`
                : 'Esta acao remove o setor permanentemente.'}
            </Text>

            {!!sectorErrorMessage && (
              <View className="mt-4 rounded-2xl border border-danger/40 bg-danger/10 px-4 py-3">
                <Text className="text-sm text-danger">{sectorErrorMessage}</Text>
              </View>
            )}

            <View className="mt-5 flex-row gap-3">
              <TouchableOpacity
                className="flex-1 items-center rounded-2xl bg-background py-4"
                onPress={closeSectorDialogs}
                disabled={isDeletingSector}>
                <Text className="font-bold text-textBase">Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`flex-1 items-center rounded-2xl py-4 ${
                  isDeletingSector ? 'bg-surfaceAlt' : 'bg-danger'
                }`}
                onPress={handleDeleteSector}
                disabled={isDeletingSector}>
                <Text className="font-bold text-white">
                  {isDeletingSector ? 'Deletando...' : 'Confirmar'}
                </Text>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      <Modal
        visible={Boolean(sectorManagingMembers)}
        transparent
        animationType="fade"
        statusBarTranslucent
        onRequestClose={closeMembersDialog}>
        <Pressable className="flex-1 justify-center bg-black/60 px-5" onPress={closeMembersDialog}>
          <Pressable
            className="max-h-[86%] rounded-[28px] border border-surfaceAlt bg-surface px-5 py-5"
            onPress={(event) => event.stopPropagation()}>
            <ScrollView keyboardShouldPersistTaps="handled" showsVerticalScrollIndicator={false}>
              <Text className="text-xl font-bold text-textBase">
                {sectorManagingMembers ? sectorManagingMembers.name : 'Membros do setor'}
              </Text>
              <Text className="mt-2 text-sm leading-6 text-textMuted">
                Adicione membros da igreja e defina administradores deste setor.
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

                    {sectorMembers.length === 0 ? (
                      <View className="rounded-2xl border border-dashed border-surfaceAlt bg-background px-4 py-5">
                        <Text className="text-sm font-semibold text-textBase">
                          Nenhum membro neste setor
                        </Text>
                      </View>
                    ) : (
                      <View className="overflow-hidden rounded-2xl border border-surfaceAlt">
                        {sectorMembers.map((member, index) => {
                          const isLastItem = index === sectorMembers.length - 1;
                          const isBusy = memberActionId === member.id;

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

                                {canManageSectorRoster ? (
                                  <View className="flex-row gap-2">
                                    {canUpdateSectorRoles ? (
                                      <TouchableOpacity
                                        className={`h-10 w-10 items-center justify-center rounded-full ${
                                          member.role === 'ADMIN' ? 'bg-accent/10' : 'bg-surface'
                                        }`}
                                        onPress={() => handleToggleSectorAdmin(member)}
                                        disabled={Boolean(memberActionId)}>
                                        <Ionicons
                                          name={isBusy ? 'ellipsis-horizontal' : 'shield-checkmark-outline'}
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
                                        name={isBusy ? 'ellipsis-horizontal' : 'remove-outline'}
                                        size={18}
                                        color="#F87171"
                                      />
                                    </TouchableOpacity>
                                  </View>
                                ) : null}
                              </View>
                            </View>
                          );
                        })}
                      </View>
                    )}
                  </View>

                  {canManageSectorRoster ? (
                    <View className="mt-6">
                      <Text className="mb-3 text-sm font-bold uppercase tracking-[0.18em] text-textMuted">
                        Adicionar da igreja
                      </Text>

                      <View className="mb-3 flex-row items-center rounded-2xl border border-surfaceAlt bg-background px-4">
                        <Ionicons name="search-outline" size={18} color="#94A3B8" />
                        <TextInput
                          className="ml-3 flex-1 py-4 text-base text-textBase"
                          placeholder="Buscar por nome ou email"
                          placeholderTextColor="#64748B"
                          cursorColor="#6366F1"
                          autoCorrect={false}
                          value={memberSearchTerm}
                          onChangeText={setMemberSearchTerm}
                        />
                      </View>

                      {availableChurchMembers.length === 0 ? (
                        <View className="rounded-2xl border border-dashed border-surfaceAlt bg-background px-4 py-5">
                          <Text className="text-sm font-semibold text-textBase">
                            Nenhum membro disponivel
                          </Text>
                        </View>
                      ) : (
                        <View className="overflow-hidden rounded-2xl border border-surfaceAlt">
                          {availableChurchMembers.map((member, index) => {
                            const isLastItem = index === availableChurchMembers.length - 1;
                            const isBusy = memberActionId === member.id;

                            return (
                              <View
                                key={member.id}
                                className={`flex-row items-center bg-background px-4 py-4 ${
                                  isLastItem ? '' : 'border-b border-surfaceAlt'
                                }`}>
                                <View className="mr-3 flex-1">
                                  <Text className="text-base font-bold text-textBase">{member.name}</Text>
                                  <Text className="mt-1 text-xs text-textMuted">{member.email}</Text>
                                </View>

                                <TouchableOpacity
                                  className="h-10 w-10 items-center justify-center rounded-full bg-success/10"
                                  onPress={() => handleAddSectorMember(member)}
                                  disabled={Boolean(memberActionId)}>
                                  <Ionicons
                                    name={isBusy ? 'ellipsis-horizontal' : 'add-outline'}
                                    size={19}
                                    color="#22C55E"
                                  />
                                </TouchableOpacity>
                              </View>
                            );
                          })}
                        </View>
                      )}
                    </View>
                  ) : null}
                </>
              )}
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
}
