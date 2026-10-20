# AGAPE

<p align="center">
  <img src="logo-agape-quadrado.jpeg" alt="Logo Agape" width="150"/>
</p>

Sistema de monitoramento cardíaco e suporte para pessoas com TEA (Transtorno do Espectro Autista).

## Estrutura do Projeto

```
agape/
├── backend/          # API REST (Spring Boot + Java 22)
│   ├── src/
│   └── pom.xml
├── frontend/         # Web App (React + Vite)
│   ├── src/
│   └── package.json
├── .gitignore
└── README.md
```

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
3. Configure a senha em `application.properties` (padrão: `minhaSenha123`)
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

## Frontend (Web)

### Tecnologias

- **React 19** + **Vite 6**
- **React Router 7**
- **React Icons**

### Como rodar

```bash
cd frontend
npm install
npm run dev
```

Configure o IP da API no arquivo `.env`:

```env
VITE_API_URL=http://SEU_IP:9090
```

### Funcionalidades

- **Login/Cadastro** com sessão persistente
- **Home** com cards explicativos sobre TEA
- **Pulseira** → Monitoramento BLE (ESP32)
  - BPM em tempo real
  - Envio ao servidor quando BPM > 70
  - Cores: Verde (estável), Amarelo (moderado), Roxo (alerta), Vermelho (grave)
- **Histórico** → Batimentos cardíacos salvos
- **Notas/Agenda** → Anotações do usuário
- **Informações** → Conteúdo sobre TEA
