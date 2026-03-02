# Mapeamento real da API TheChurch (estado atual do código)

> Atualizado em **02/03/2026**

Este documento mapeia o que já está implementado no backend hoje, com foco em fluxo de uso e comportamento real do código.

## 1) Visão geral rápida

- Stack: **NestJS + TypeScript + TypeORM + PostgreSQL**.
- Documentação automática: **`/api-docs`** (Swagger).
- Não há prefixo global de rota (ex.: não usa `/api`).
- Autenticação: **JWT Bearer Token** no header `Authorization`.
- Validação global ativa (`whitelist`, `forbidNonWhitelisted`, transformação implícita).
- E-mails transacionais já integrados com templates Handlebars em `assets/templates`.

## 2) Fluxo principal (ponta a ponta)

## 2.1 Cadastro e acesso do usuário

1. `POST /users`
2. Se for novo usuário: cria conta e envia código de verificação por e-mail.
3. Se o e-mail já existe e está verificado: envia e-mail avisando que a conta já existe.
4. Se o e-mail já existe mas não está verificado: atualiza o cadastro e envia novo código.
5. `POST /verify-code/user` para validar código e marcar usuário como verificado.
6. `POST /auth/login` para autenticar e receber JWT (no header da resposta).

## 2.2 Recuperação de senha

1. `POST /auth/forgot-password` com e-mail.
2. API gera token, envia e-mail com link de reset (`RESET_PASSWORD_URL?token=...`).
3. Frontend pode validar token com `GET /auth/validate-reset-token?token=...&email=...`.
4. `POST /auth/update-password?token=...` para trocar senha.

## 2.3 Organização ministerial

1. Usuário autenticado cria igreja: `POST /churches`.
2. Criador da igreja vira **ADMIN da igreja** automaticamente.
3. Admin adiciona membros na igreja: `POST /churches/:church_id/members`.
4. Admin pode promover membro para admin da igreja: `POST /churches/:church_id/members/make_admin/:member_id`.
5. Admin cria setor da igreja: `POST /:church_id/sectors`.
6. Criador do setor recebe vínculo de **ADMIN do setor**.
7. Admin da igreja pode definir papel do membro no setor: `PATCH /churches/:church_id/sectors/:sector_id/members/:member_id/role`.
8. Admin do setor adiciona membros ao setor: `POST /churches/:church_id/sectors/:sector_id/members`.
9. Usuário define suas tarefas no perfil: `PUT /users/:id/tasks`.
10. Admin do setor cria tarefas: `POST /churches/:church_id/sectors/:sector_id/tasks`.
11. Admin do setor cria escala: `POST /churches/:church_id/sectors/:sector_id/scales`.
12. Admin do setor aloca participantes na escala: `PATCH /churches/:church_id/sectors/:sector_id/scales/:scale_id/participants`.
13. Usuário mantém indisponibilidades: `POST /users/:id/unavailability`.

## 3) Segurança e permissões

### 3.1 Guards implementados

- `AuthGuard`: exige token JWT válido.
- `ChurchRoleGuard`: exige vínculo usuário-igreja com papel diferente de `VOLUNTARY`.
- `SectorGuard`: libera se o usuário for:
  - `ADMIN` da igreja, ou
  - `ADMIN` do setor.

### 3.2 Regra de "somente eu"

Nas rotas de perfil (`/users/:id/...`), além do JWT, o código verifica se `id` da URL é o mesmo `id` do token. Se for diferente, retorna `Access denied`.

## 4) Rotas implementadas hoje

## 4.1 Autenticação e verificação

| Método | Rota | Auth | Regra |
|---|---|---|---|
| POST | `/auth/login` | Não | Login por e-mail/senha |
| GET | `/auth/validate-reset-token` | Não | Query `token` + `email` |
| POST | `/auth/forgot-password` | Não | Envia token de reset |
| POST | `/auth/update-password` | Não | Query `token`, body com `email` e nova senha |
| POST | `/verify-code/user` | Não | Verifica código de e-mail |

## 4.2 Usuários

| Método | Rota | Auth | Regra |
|---|---|---|---|
| POST | `/users` | Não | Cadastro |
| GET | `/users/:email` | Não | Busca usuário por e-mail |
| PATCH | `/users/:id` | Sim | Somente o próprio usuário |
| GET | `/users/:id/tasks` | Sim | Somente o próprio usuário |
| PUT | `/users/:id/tasks` | Sim | Somente o próprio usuário |
| GET | `/users/:id/unavailability` | Sim | Somente o próprio usuário |
| POST | `/users/:id/unavailability` | Sim | Somente o próprio usuário |
| DELETE | `/users/:id/unavailability/:unavailability_id` | Sim | Somente o próprio usuário |

## 4.3 Igrejas e membros da igreja

| Método | Rota | Auth | Regra |
|---|---|---|---|
| POST | `/churches` | Sim | Usuário autenticado |
| GET | `/churches/:church_id` | Sim | Usuário precisa estar vinculado à igreja |
| PATCH | `/churches/:church_id` | Sim | `ChurchRoleGuard` |
| DELETE | `/churches/:church_id` | Sim | `ChurchRoleGuard` |
| POST | `/churches/:church_id/members` | Sim | `ChurchRoleGuard` |
| GET | `/churches/:church_id/members` | Sim | `ChurchRoleGuard` |
| POST | `/churches/:church_id/members/make_admin/:member_id` | Sim | `ChurchRoleGuard` |

## 4.4 Setores e membros do setor

| Método | Rota | Auth | Regra |
|---|---|---|---|
| POST | `/:church_id/sectors` | Sim | `ChurchRoleGuard` |
| GET | `/:church_id/sectors` | Sim | Usuário precisa estar vinculado à igreja |
| GET | `/:church_id/sectors/:sector_id` | Sim | Usuário vinculado ao setor |
| PATCH | `/:church_id/sectors/:sector_id` | Sim | `SectorGuard` |
| DELETE | `/:church_id/sectors/:sector_id` | Sim | `SectorGuard` |
| POST | `/churches/:church_id/sectors/:sector_id/members` | Sim | `SectorGuard` |
| GET | `/churches/:church_id/sectors/:sector_id/members` | Sim | `SectorGuard` |
| PATCH | `/churches/:church_id/sectors/:sector_id/members/:member_id/role` | Sim | `ChurchRoleGuard` |

## 4.5 Tarefas do setor

| Método | Rota | Auth | Regra |
|---|---|---|---|
| POST | `/churches/:church_id/sectors/:sector_id/tasks` | Sim | `SectorGuard` |
| GET | `/churches/:church_id/sectors/:sector_id/tasks` | Sim | Membro da igreja **ou** do setor |
| GET | `/churches/:church_id/sectors/:sector_id/tasks/:task_id` | Sim | Membro da igreja **ou** do setor |
| PATCH | `/churches/:church_id/sectors/:sector_id/tasks/:task_id` | Sim | `SectorGuard` |
| DELETE | `/churches/:church_id/sectors/:sector_id/tasks/:task_id` | Sim | `SectorGuard` |

## 4.6 Escalas e participantes

| Método | Rota | Auth | Regra |
|---|---|---|---|
| POST | `/churches/:church_id/sectors/:sector_id/scales` | Sim | `SectorGuard` |
| GET | `/churches/:church_id/sectors/:sector_id/scales` | Sim | Membro da igreja **ou** do setor |
| GET | `/churches/:church_id/sectors/:sector_id/scales/:scale_id` | Sim | Membro da igreja **ou** do setor |
| PATCH | `/churches/:church_id/sectors/:sector_id/scales/:scale_id` | Sim | `SectorGuard` |
| PATCH | `/churches/:church_id/sectors/:sector_id/scales/:scale_id/participants` | Sim | `SectorGuard` |
| DELETE | `/churches/:church_id/sectors/:sector_id/scales/:scale_id` | Sim | `SectorGuard` |

## 5) Regras de negócio já implementadas

- Senha forte obrigatória no cadastro e na troca de senha.
- Código de verificação por e-mail com expiração.
- Token de reset de senha também expira (na implementação atual, com a mesma janela de 10 minutos do código de verificação).
- Login de usuário não verificado devolve `401` e gera novo código.
- Igreja criada já vincula o criador como admin.
- Setor criado já vincula o criador como admin do setor.
- Church admin pode promover/rebaixar membro no setor (`ADMIN` ou `MEMBER`).
- Adição de membro ao setor valida:
  - setor existe e pertence à igreja da rota,
  - usuário existe e é verificado,
  - usuário já é membro da igreja.
- Escala tem unicidade por `(sector_id, date)`.
- Ao definir participantes da escala:
  - remove duplicados do payload (`user_id + task_id`),
  - valida se tarefa existe e pertence ao setor,
  - valida se usuário pertence ao setor,
  - bloqueia usuário indisponível na data,
  - bloqueia conflito com escala de outro setor na mesma data,
  - sincroniza participantes (remove os que saíram e adiciona os novos).
- Indisponibilidade tem unicidade por usuário + data.
- Ao criar indisponibilidade, o sistema bloqueia se o usuário já estiver escalado naquela data.
- Tarefas do usuário também são sincronizadas (adiciona/remove conforme lista enviada).

## 6) Modelo de dados (entidades principais)

- `User`
- `Church`
- `Sector`
- `Task`
- `Scale`
- `Participant` (liga `Scale + User + Task`)
- `UserChurch` (vínculo usuário-igreja com `role`)
- `UserSector` (vínculo usuário-setor com `role`)
- `UserTask` (tarefas no perfil do usuário)
- `Unavailability`
- `VerificationCode`
- `PasswordResetToken`

Relações-chave:

- Igreja 1:N Setores.
- Setor 1:N Tarefas e 1:N Escalas.
- Escala 1:N Participantes.
- Usuário N:N Igreja (`UserChurch`) com papel.
- Usuário N:N Setor (`UserSector`) com papel.
- Usuário N:N Tarefa (`UserTask`).
- Usuário 1:N Indisponibilidade.

## 7) E-mails já prontos

- Verificação de conta: `assets/templates/verify.hbs`
- Conta já existente: `assets/templates/update-account.hbs`
- Reset de senha: `assets/templates/reset-password.hbs`

## 8) Pontos de atenção do estado atual

- As rotas de setor estão com base em `/:church_id/sectors` (sem prefixo `/churches`), diferente do padrão das demais rotas.
- `Task.name` e `Sector.name` estão com `unique` no banco, então o nome tende a ser único globalmente (não apenas por setor/igreja).
- O arquivo `.env.example` não lista todas as variáveis usadas em runtime (`APP_NAME`, `RESET_PASSWORD_URL`).
- O `PATCH /users/:id` reaproveita o DTO de criação; na prática, hoje ele exige `name`, `email` e `password` no payload.

## 9) O que ainda não aparece implementado via endpoint HTTP

- Listagem geral de igrejas.
- Remoção de membro da igreja.
- Remoção de membro do setor.
- Endpoint de exclusão de usuário.
