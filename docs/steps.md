## Next step (status real do código)

### Usuário e autenticação

- [x] get user
- [x] update user
- [x] login com reenvio de código para usuário não verificado
- [x] recadastro de usuário não verificado (update + novo código)
- [x] verify user code
- [x] e-mail para conta já existente
- [x] verify login
- [x] forgot password + reset password
- [x] birthday no usuário
- [x] validação de user id nas rotas de perfil

---

### Igreja

- [x] CRUD church
- [x] adicionar membros na igreja (default voluntary)
- [x] listar membros da igreja
- [x] promover membro da igreja para admin

---

### Setor

- [x] CRUD sectors
- [x] listar setores por igreja
- [x] adicionar membros no setor (member)
- [x] promover/rebaixar papel no setor (ADMIN/MEMBER)
- [x] somente church admin cria setor
- [x] somente church admin define admin de setor

---

### Tarefas e escalas

- [x] CRUD tasks
- [x] related users and tasks
- [x] set tasks no perfil do usuário (minister, guitar etc)
- [x] CRUD scales
- [x] somente admin church e admin sector criam/atualizam tarefas e escalas

---

### Indisponibilidade

- [x] CRUD unavailability
- [x] usuário indisponível não pode ser escalado naquele dia
- [x] se já estiver escalado, não pode criar indisponibilidade para o mesmo dia
- [x] conflito entre setores no mesmo dia com mensagem de setor

---

## Pendências atuais (fora de future feature)

- [ ] listagem geral de igrejas
- [ ] remover membro da igreja
- [ ] remover membro do setor
- [ ] endpoint de exclusão de usuário

---

## FUTURE FEATURE

- [ ] crud extra events, like aniversaries, conference, couple service
  - related with church

- [ ] crud church assets, like music, schedules
  - https://chatgpt.com/canvas/shared/6831b5aa751c8191aa5e5d38931009e7
