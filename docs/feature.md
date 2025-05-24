## Feature: Biblioteca de Tons Personalizados por Ministro (TheChurch)

### Objetivo

Ao escalar um **ministro de música**, as músicas da escala devem ser ajustadas automaticamente para os **tons preferidos** desse ministro, se ele os tiver definido. Caso contrário, o tom original da música é mantido.

---

### Modelagem de Dados

#### 1. songs (músicas disponíveis)

```ts
id: UUID
title: string
defaultKey: string // ex: "G", "F#m"
```

#### 2. ministers (usuários com papel de ministro)

```ts
id: UUID
userId: UUID
name: string
```

#### 3. minister\_song\_keys (biblioteca personalizada de tons)

```ts
id: UUID
ministerId: UUID
songId: UUID
customKey: string // tom preferido
```

#### 4. schedules (escala de um dia/evento)

```ts
id: UUID
date: Date
group: string // música, recepção, etc
```

#### 5. schedule\_songs (músicas na escala)

```ts
id: UUID
scheduleId: UUID
songId: UUID
key: string // tom usado na ocasião
```

---

### Lógica de Aplicação

Durante a criação da escala:

* Se o escalado for um **ministro** e tiver tom personalizado para a música:

  * Usa `minister_song_keys.customKey`.
* Caso contrário:

  * Usa `songs.defaultKey`.

```ts
function getKeyForSchedule(ministerId, song) {
  const custom = this.ministerKeysRepo.findBySongAndMinister(ministerId, song.id);
  return custom?.customKey ?? song.defaultKey;
}
```

---

### Atualização da Biblioteca de Tons

* O ministro pode acessar o histórico ou próximas escalas.
* Pode definir um "meu tom" para cada música.
* Isso cria ou atualiza a entrada em `minister_song_keys`.

---

### Exemplo Visual (no app)

* 🎵 Alvo Mais que a Neve - Tom: G (personalizado)
* 🎵 Te Louvarei - Tom: F#m (original)

---

### Restrições

* A personalização **só é aplicada** se o usuário estiver escalado **como ministro**.

---

### Possíveis Extensões Futuras

* Mostrar tons personalizados para outros membros da equipe.
* Suporte a múltiplas variações de tom (ex: manhã e noite).
