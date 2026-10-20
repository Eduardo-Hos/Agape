# AGAPE

<p align="center">
  <img src="imagens/logo-agape-quadrado.jpeg" alt="Logo Agape" width="150"/>
</p>

Sistema de monitoramento cardíaco e suporte para pessoas com TEA (Transtorno do Espectro Autista).

## Estrutura do Projeto

```
Agape/
├── backend/              # API REST (Spring Boot + Java 22)
│   ├── src/
│   └── pom.xml
├── frontend/             # Web App (React + Vite)
│   ├── src/
│   └── package.json
├── codigos-dos-esps/     # Firmware dos ESP32 (Arduino)
│   ├── esp32_hub_novo/
│   └── esp32_pulseira_novo/
├── imagens/              # Logos e imagens
├── .gitignore
└── README.md
```

## Sobre o Projeto

O AGAPE auxilia famílias e cuidadores de pessoas com TEA. O sistema é composto por:

- **Pulseira com ESP32** — lê os batimentos cardíacos (BPM) com sensor MAX30102 e sinaliza o estado por LEDs (verde, amarelo, roxo, vermelho) e buzzer.
- **Hub com ESP32** — recebe os dados da pulseira via Bluetooth e publica no site.
- **Site (Web App)** — exibe o BPM em tempo real, salva o histórico, permite anotações/agenda e traz informações sobre o TEA.

O objetivo é ajudar a identificar crises de ansiedade com antecedência, já que o coração acelera antes dos outros sintomas.

### Faixas de referência

A frequência cardíaca normal em repouso varia com a idade. O projeto atende as faixas:

| Faixa etária | BPM em repouso |
|--------------|----------------|
| 8 a 12 anos  | 70 ~ 110       |
| 12 a 18 anos | 60 ~ 100       |
| 18 a 30 anos | 60 ~ 100       |

> Referências: Ostchega et al. (CDC/NCHS, 2011) e Fleming et al. (The Lancet, 2011).

## Backend (API)

### Tecnologias

- **Java 22** + **Spring Boot 3.5.6**
- **Spring Data JPA** + **MySQL** (MariaDB via XAMPP)
- **Spring Security** + **JWT** (autenticação)
- **BCrypt** (criptografia de senhas)
- **Maven**

### Como rodar

1. Inicie o MySQL no XAMPP
2. Crie o banco:
   ```sql
   CREATE DATABASE agape_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```
3. Configure a senha em `application.properties`
4. Execute:
   ```bash
   cd backend
   mvn spring-boot:run
   ```

A API roda em `http://0.0.0.0:9090`.

### Endpoints

| Método | Rota | Descrição |
|--------|------|-----------|
| POST | `/usuario` | Criar usuário |
| GET | `/usuario?limite=50` | Listar usuários |
| GET | `/usuario/{id}` | Buscar usuário por ID |
| PUT | `/usuario/{id}` | Atualizar usuário |
| DELETE | `/usuario/{id}` | Deletar usuário |
| POST | `/login` | Login (email + senha) → JWT |
| POST | `/tipo` | Criar tipo de usuário |
| GET | `/tipo` | Listar tipos |
| POST | `/pulseira` | Criar pulseira |
| GET | `/pulseira` | Listar pulseiras |
| GET | `/pulseira/usuario/{id}` | Pulseiras de um usuário |
| POST | `/dados-pulseira` | Salvar batimento cardíaco |
| GET | `/dados-pulseira/usuario/{id}` | Histórico de batimentos |
| POST | `/registro` | Criar registro |
| GET | `/registro` | Listar registros |
| POST | `/nota` | Criar nota |
| GET | `/nota/usuario/{id}` | Notas de um usuário |
| POST | `/compromisso` | Criar compromisso (agenda) |
| GET | `/compromisso/usuario/{id}?data=AAAA-MM-DD` | Compromissos do dia |
| DELETE | `/compromisso/{id}` | Remover compromisso |

## Frontend (Web)

### Tecnologias

- **React 19** + **Vite 6**
- **React Router 7**
- **React Icons**
- **Web Bluetooth API** (conexão com os ESP32)

### Como rodar

```bash
cd frontend
npm install
npm run dev -- --host
```

O Vite sobe em `https://localhost:3000`. As chamadas à API passam pelo proxy `/api` (configurado em `vite.config.js`), o que evita bloqueio de mixed content.

### Funcionalidades

- **Login/Cadastro** com sessão persistente
- **Home** com cards explicativos sobre TEA
- **Monitor de Batimentos** → BPM em tempo real via Bluetooth (ESP32)
  - Cores: Verde (estável), Amarelo (moderado), Roxo (alerta), Vermelho (grave)
  - Modo simulação (opcional) para testes
- **Histórico** → Batimentos cardíacos salvos
- **Notas & Agenda** → Notas livres + compromissos por data e horário
- **Informações** → Conteúdo sobre TEA

## ESP32 (Firmware)

Os códigos ficam em `codigos-dos-esps/` e são gravados pela **Arduino IDE**.

- **Pulseira** (`esp32_pulseira_novo`): usa a biblioteca **MAX30105** (SparkFun MAX3010x).
- **Hub** (`esp32_hub_novo`): usa apenas o core do ESP32.

A comunicação entre pulseira e hub é feita por **Bluetooth Low Energy (BLE)**.
